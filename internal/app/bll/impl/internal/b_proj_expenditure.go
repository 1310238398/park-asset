package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpenditure 创建项目支出节点
func NewProjExpenditure(
	mTrans model.ITrans,
	mProjExpenditure model.IProjExpenditure,
	mProjExpendCost model.IProjExpendCost, mProjCostItem model.IProjCostItem,
	mProjExpenditureTime model.IProjExpenditureTime,
) *ProjExpenditure {
	return &ProjExpenditure{
		TransModel:               mTrans,
		ProjExpenditureModel:     mProjExpenditure,
		ProjExpendCostModel:      mProjExpendCost,
		ProjCostItemModel:        mProjCostItem,
		ProjExpenditureTimeModel: mProjExpenditureTime,
	}
}

// ProjExpenditure 项目支出节点业务逻辑
type ProjExpenditure struct {
	TransModel               model.ITrans
	ProjExpenditureModel     model.IProjExpenditure
	ProjExpendCostModel      model.IProjExpendCost
	ProjCostItemModel        model.IProjCostItem
	ProjExpenditureTimeModel model.IProjExpenditureTime
}

// Query 查询数据
func (a *ProjExpenditure) Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error) {
	result, err := a.ProjExpenditureModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	// pCostResult, err := a.ProjCostItemModel.QueryShow(ctx, schema.ProjCostItemQueryParam{
	// 	ProjectID: params.ProjectID,
	// })
	// if err != nil {
	// 	return nil, err
	// }

	// pExpend, a.ProjExpendCostModel.Query(ctx,schema.ProjExpendCostQueryParam{

	// })

	// result.Data.FillProjCostItem

	return result, nil
}

// Get 查询指定数据
func (a *ProjExpenditure) Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditure, error) {
	item, err := a.ProjExpenditureModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjExpenditure) getUpdate(ctx context.Context, recordID string) (*schema.ProjExpenditure, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjExpenditure) Create(ctx context.Context, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	item.RecordID = util.MustUUID()
	parentPath, err := a.getParentPath(ctx, item.ParentID)
	if err != nil {
		return nil, err
	}
	item.ParentPath = parentPath

	err = a.ProjExpenditureModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjExpenditure) Update(ctx context.Context, recordID string, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	oldItem, err := a.ProjExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.update(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjExpenditure) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	// return ExecTrans(ctx, a.TransModel func(ctx context.Context)error{

	// })

	err = a.ProjExpenditureTimeModel.DeleteByProjExpendID(ctx, recordID)
	if err != nil {
		return err
	}
	err = a.ProjExpendCostModel.DeleteByProjExpendID(ctx, recordID)
	if err != nil {
		return err
	}

	return a.ProjExpenditureModel.Delete(ctx, recordID)
}

func (a *ProjExpenditure) create(ctx context.Context, item schema.ProjExpenditure) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		// 填充本次支出金额
		err := a.fillProjCostsAmount(ctx, item)
		if err != nil {
			return err
		}
		// 创建对应成本项
		err = a.createProjExpenCost(ctx, item)
		if err != nil {
			return err
		}
		// 创建对应支出时间表
		err = a.createExpendTime(ctx, item)
		if err != nil {
			return err
		}
		return nil
	})
}

// 获取父级路径
func (a *ProjExpenditure) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.ProjExpenditureModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	return a.joinParentPath(pitem.ParentPath, pitem.RecordID), nil
}

func (a *ProjExpenditure) joinParentPath(parentPath, parentID string) string {
	if parentPath == "" && parentID == "" {
		return ""
	}

	if parentPath != "" {
		parentPath += "/"
	}
	return parentPath + parentID
}

// 创建项目支出节点对应的成本项
func (a *ProjExpenditure) createProjExpenCost(ctx context.Context, item schema.ProjExpenditure) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		// 非累计支出
		if item.ISAccExpend == 0 {
			for _, projCostItem := range item.ProjCostItems {
				var projExpendCost schema.ProjExpendCost
				projExpendCost.RecordID = util.MustUUID()
				projExpendCost.ProjExpenditureID = item.RecordID
				projExpendCost.ProjCostID = projCostItem.RecordID
				projExpendCost.Amount = item.ExpendRate * projCostItem.Price
				err := a.ProjExpendCostModel.Create(ctx, projExpendCost)
				if err != nil {
					return err
				}
			}

		}

		// 累计支出
		if item.ISAccExpend == 1 {
			mProjCost, err := a.getAccProjExpendCost(ctx, item)
			if err != nil {
				return nil
			}
			for _, projCostItem := range item.ProjCostItems {
				var projExpendCost schema.ProjExpendCost
				projExpendCost.RecordID = util.MustUUID()
				projExpendCost.ProjExpenditureID = item.RecordID
				projExpendCost.ProjCostID = projCostItem.RecordID
				// 本次累计金额 - 之前金额
				projAmount := item.ExpendRate*projCostItem.Price - mProjCost[projCostItem.RecordID]
				if projAmount < 0 {
					projExpendCost.Amount = 0
				}
				projExpendCost.Amount = projAmount

				err := a.ProjExpendCostModel.Create(ctx, projExpendCost)
				if err != nil {
					return err
				}
			}
		}

		return nil
	})

}

// 填充本次此项目支出节点金额
func (a *ProjExpenditure) fillProjCostsAmount(ctx context.Context, item schema.ProjExpenditure) error {
	// 此支出节点下所有成本项相加
	var totalCost float64
	for _, pCostItem := range item.ProjCostItems {
		totalCost += pCostItem.Price
	}

	// 非累计支出比例支出金额
	if item.ISAccExpend == 0 {
		item.TotalCost = totalCost * item.ExpendRate
	}

	// 累计支出比例支出金额(累计比例*成本-之前支出金额)
	if item.ISAccExpend == 1 {
		accAmout := totalCost * item.ExpendRate
		var beforeAmount float64
		m, err := a.getAccProjExpendCost(ctx, item)
		if err != nil {
			return err
		}

		for _, v := range m {
			beforeAmount += v
		}

		item.TotalCost = accAmout - beforeAmount

	}

	return nil
}

// 此项目支出节点对应成本项累计支出金额 key项目成本项ID value之前累计金额 (不包括本次支出)
func (a *ProjExpenditure) getAccProjExpendCost(ctx context.Context, item schema.ProjExpenditure) (map[string]float64, error) {
	projExpenedResult, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
		ProjectID:       item.ProjectID,
		BeforeStartTime: item.StartTime,
	})
	if err != nil {
		return nil, err
	}

	projExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjExpenditureIDs:    projExpenedResult.Data.ToProjExpendIDs(),
		NotProjExpenditureIDs: []string{item.RecordID},
	})

	var m map[string]float64
	mProjCost := projExpendCostResult.Data.ToProjExpendCostsMap()

	for _, projCostItem := range item.ProjCostItems {
		list, ok := mProjCost[projCostItem.RecordID]
		if !ok {
			continue
		}
		for _, v := range list {
			m[projCostItem.RecordID] += v.Amount
		}
	}

	return m, nil
}

// 创建支出时间表
func (a *ProjExpenditure) createExpendTime(ctx context.Context, item schema.ProjExpenditure) error {
	var expendTimeItem schema.ProjExpenditureTime
	expendTimeItem.RecordID = util.MustUUID()
	expendTimeItem.ProjExpenditureID = item.RecordID

	years := item.EndTime.Year() - item.StartTime.Year()
	if years < 0 {
		return errors.New("结束时间不能早于开始时间")
	}

	switch item.ExpenditureTimeType {
	case 1:
		payTime := item.EndTime.AddDate(0, 0, -30)
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID
		err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
		if err != nil {
			return err
		}

	case 2:
		expendTimeItem.Day = item.EndTime.Day()
		expendTimeItem.Month = int(item.EndTime.Month())
		expendTimeItem.Quarter = (int(item.EndTime.Month())-1)/3 + 1
		expendTimeItem.Year = item.EndTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

		err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
		if err != nil {
			return err
		}

	case 3:
		payTime := item.EndTime.AddDate(0, 0, 30)
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

		err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
		if err != nil {
			return err
		}

	case 4:
		payTime := item.EndTime.AddDate(0, 2, 0)
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

	case 5:
		payTime := item.EndTime.AddDate(0, 6, 0)
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

		err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
		if err != nil {
			return err
		}

	case 6:
		payTime := item.EndTime.AddDate(1, 0, 0)
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

		err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
		if err != nil {
			return err
		}

	case 7:
		months := 12*years + int(item.EndTime.Month()) - int(item.StartTime.Month())
		sMonth := int(item.StartTime.Month())
		sQuarter := (sMonth-1)/3 + 1
		expendTimeItem.ExpenditureAmount = item.TotalCost / float64(months)
		expendTimeItem.ProjExpenditureID = item.RecordID

		for month := 0; month <= months; month++ {
			quarter := month / 3
			expendTimeItem.Year = item.StartTime.Year() + (sMonth+month-1)/12
			expendTimeItem.Quarter = (sQuarter+quarter-1)%4 + 1
			expendTimeItem.Month = (sMonth+month-1)%12 + 1
			err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
			if err != nil {
				return err
			}

		}

	case 8:
		months := 12*years + int(item.EndTime.Month()) - int(item.StartTime.Month())
		sMonth := int(item.StartTime.Month())
		quarters := months/3 + util.BoolToInt(0 > months%3)
		sQuarter := (sMonth-1)/3 + 1
		expendTimeItem.ExpenditureAmount = item.TotalCost / float64(quarters)
		expendTimeItem.ProjExpenditureID = item.RecordID

		for quarter := 0; quarter <= quarters; quarter++ {
			expendTimeItem.Year = item.StartTime.Year() + (sQuarter+quarter-1)/4
			expendTimeItem.Quarter = (sQuarter+quarter-1)%4 + 1

			err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
			if err != nil {
				return err
			}
		}

	}

	return nil

}

func (a *ProjExpenditure) update(ctx context.Context, item schema.ProjExpenditure) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		// 填充本次支出金额
		err := a.fillProjCostsAmount(ctx, item)
		if err != nil {
			return err
		}

		err = a.ProjExpendCostModel.DeleteByProjExpendID(ctx, item.RecordID)
		if err != nil {
			return err
		}

		err = a.ProjExpenditureTimeModel.DeleteByProjExpendID(ctx, item.RecordID)
		if err != nil {
			return err
		}

		// 创建对应成本项
		err = a.createProjExpenCost(ctx, item)
		if err != nil {
			return err
		}

		// 创建对应支出时间表
		err = a.createExpendTime(ctx, item)
		if err != nil {
			return err
		}
		return nil
	})
}
