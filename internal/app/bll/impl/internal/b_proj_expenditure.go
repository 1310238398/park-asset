package internal

import (
	"context"
	"time"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpenditure 创建项目支出节点
func NewProjExpenditure(
	mTrans model.ITrans,
	mProjExpenditure model.IProjExpenditure,
	mProjExpendCost model.IProjExpendCost,
	mProjCostItem model.IProjCostItem,
	mProjExpenditureTime model.IProjExpenditureTime,
	mExpenditure model.IExpenditure,
) *ProjExpenditure {
	return &ProjExpenditure{
		TransModel:               mTrans,
		ProjExpenditureModel:     mProjExpenditure,
		ProjExpendCostModel:      mProjExpendCost,
		ProjCostItemModel:        mProjCostItem,
		ProjExpenditureTimeModel: mProjExpenditureTime,
		ExpenditureModel:         mExpenditure,
	}
}

// ProjExpenditure 项目支出节点业务逻辑
type ProjExpenditure struct {
	TransModel               model.ITrans
	ProjExpenditureModel     model.IProjExpenditure
	ProjExpendCostModel      model.IProjExpendCost
	ProjCostItemModel        model.IProjCostItem
	ProjExpenditureTimeModel model.IProjExpenditureTime
	ExpenditureModel         model.IExpenditure
}

// Query 查询数据
func (a *ProjExpenditure) Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error) {
	err := a.ReLoad(ctx, params.ProjectID)
	if err != nil {
		return nil, err
	}
	result, err := a.ProjExpenditureModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	pExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjectID: params.ProjectID,
	})
	if err != nil {
		return nil, err
	}

	result.Data.FillProjCostItem(pExpendCostResult.Data)
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

	pExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjExpenditureID: recordID,
	})
	if err != nil {
		return nil, err
	}

	item.ProjCostItemIDs = pExpendCostResult.Data.ToProjCostIDs()

	return item, nil
}

func (a *ProjExpenditure) getUpdate(ctx context.Context, recordID string) (*schema.ProjExpenditure, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjExpenditure) Create(ctx context.Context, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	item.RecordID = util.MustUUID()
	err := a.create(ctx, item)
	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjExpenditure) Update(ctx context.Context, recordID string, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	err := a.update(ctx, recordID, item)
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

	result, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
		ParentID: recordID,
	}, schema.ProjExpenditureQueryOptions{PageParam: &schema.PaginationParam{PageSize: -1}})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrNotAllowDeleteWithChild
	}

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		err = a.ProjExpenditureTimeModel.DeleteByProjExpendID(ctx, recordID)
		if err != nil {
			return err
		}
		err = a.ProjExpendCostModel.DeleteByProjExpendID(ctx, recordID)
		if err != nil {
			return err
		}

		err = a.ProjExpenditureModel.Delete(ctx, recordID)
		if err != nil {
			return err
		}

		return nil
	})

}

func (a *ProjExpenditure) create(ctx context.Context, item schema.ProjExpenditure) error {
	err := a.ReLoad(ctx, item.ProjectID)
	if err != nil {
		return err
	}

	if item.PreviousID != "" {
		lastItem, err := a.ProjExpenditureModel.Get(ctx, item.PreviousID)
		if err != nil {
			return err
		}

		f := util.FracFloat(lastItem.Sequence)
		if f > 0 {
			item.Sequence = lastItem.Sequence + 0.1*f
		} else {
			item.Sequence = lastItem.Sequence + 0.1
		}

	} else if item.PreviousID == "" {
		size, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
			ProjectID: item.ProjectID,
		}, schema.ProjExpenditureQueryOptions{
			PageParam: &schema.PaginationParam{PageSize: -1},
		})
		if err != nil {
			return err
		}

		item.Sequence = float64(size.PageResult.Total) + 1
	}

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		parentPath, err := a.getParentPath(ctx, item.ParentID)
		if err != nil {
			return err
		}
		item.ParentPath = parentPath

		// 填充本次支出金额
		err = a.fillProjCostsAmount(ctx, &item)
		if err != nil {
			return err
		}
		// 创建对应成本项
		err = a.createProjExpenCost(ctx, &item)
		if err != nil {
			return err
		}
		// 创建对应支出时间表
		err = a.createExpendTime(ctx, &item)
		if err != nil {
			return err
		}

		err = a.ProjExpenditureModel.Create(ctx, item)
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
func (a *ProjExpenditure) createProjExpenCost(ctx context.Context, item *schema.ProjExpenditure) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		mProjCost, err := a.getAccProjExpendCost(ctx, item)
		if err != nil {
			return nil
		}
		pCostResult, err := a.ProjCostItemModel.Query(ctx, schema.ProjCostItemQueryParam{
			RecordIDs: item.ProjCostItemIDs,
		})
		if err != nil {
			return err
		}

		mpCost := pCostResult.Data.ToMap()
		var toatlAmount float64
		for _, projCostItemID := range item.ProjCostItemIDs {
			var projExpendCost schema.ProjExpendCost
			projExpendCost.RecordID = util.MustUUID()
			projExpendCost.ProjExpenditureID = item.RecordID
			projExpendCost.ProjCostID = projCostItemID
			if _, ok := mProjCost[projCostItemID]; !ok {
				mProjCost[projCostItemID] = 0
			}

			// 本次累计金额 - 之前金额
			projAmount := item.ExpendRate*mpCost[projCostItemID].Price - mProjCost[projCostItemID]
			if projAmount < 0 {
				projExpendCost.Amount = 0
			}

			projExpendCost.Amount = projAmount
			projExpendCost.CostPrice = mpCost[projCostItemID].Price
			toatlAmount += projAmount
			err := a.ProjExpendCostModel.Create(ctx, projExpendCost)
			if err != nil {
				return err
			}
		}

		item.TotalCost = toatlAmount
		return nil
	})

}

// 填充本次此项目支出节点金额(非累计)
func (a *ProjExpenditure) fillProjCostsAmount(ctx context.Context, item *schema.ProjExpenditure) error {
	if len(item.ProjCostItemIDs) == 0 {
		return nil
	}

	pCostResult, err := a.ProjCostItemModel.Query(ctx, schema.ProjCostItemQueryParam{
		RecordIDs: item.ProjCostItemIDs,
	})
	if err != nil {
		return err
	}

	// 此支出节点下所有成本项相加
	var totalCost float64
	for _, pCostItem := range pCostResult.Data {
		totalCost += pCostItem.Price
	}

	// 累计支出比例支出金额(累计比例*成本-之前支出金额)
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

	return nil
}

// 此项目支出节点对应成本项累计支出金额 key:项目成本项ID value:之前累计金额 (不包括本次支出)
func (a *ProjExpenditure) getAccProjExpendCost(ctx context.Context, item *schema.ProjExpenditure) (map[string]float64, error) {
	m := make(map[string]float64, len(item.ProjCostItemIDs))
	if item.StartTime == nil {
		for _, id := range item.ProjCostItemIDs {
			m[id] = 0
		}
		return m, nil
	}
	projExpenedResult, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
		ProjectID:       item.ProjectID,
		BeforeStartTime: *item.StartTime,
	})
	if err != nil {
		return nil, err
	}

	projExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjExpenditureIDs:    projExpenedResult.Data.ToProjExpendIDs(),
		NotProjExpenditureIDs: []string{item.RecordID},
	})

	mProjCosts := projExpendCostResult.Data.ToProjExpendCostsMap()

	// 获得项目成本项ID 对应的之前的金额
	for _, projCostItemID := range item.ProjCostItemIDs {
		m[projCostItemID] = 0
		list, ok := mProjCosts[projCostItemID]
		if !ok {
			continue

		}
		for _, v := range list {
			m[projCostItemID] += v.Amount
		}
	}

	return m, nil
}

//
func (a *ProjExpenditure) getBeforeAmount(ctx context.Context, startTime time.Time, projectID string, projCostIDs ...string) (map[string]float64, error) {
	if len(projCostIDs) == 0 {
		return nil, nil
	}

	m := make(map[string]float64, len(projCostIDs))

	projExpenedResult, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
		ProjectID:       projectID,
		BeforeStartTime: startTime,
	})
	if err != nil {
		return nil, err
	}

	projExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjExpenditureIDs: projExpenedResult.Data.ToProjExpendIDs(),
	})

	mProjCosts := projExpendCostResult.Data.ToProjExpendCostsMap()

	// 获得项目成本项ID 对应的之前的金额
	for _, projCostItemID := range projCostIDs {
		m[projCostItemID] = 0
		list, ok := mProjCosts[projCostItemID]
		if !ok {
			continue

		}
		for _, v := range list {
			m[projCostItemID] += v.Amount
		}
	}

	return m, nil
}

// 创建支出时间表
func (a *ProjExpenditure) createExpendTime(ctx context.Context, item *schema.ProjExpenditure) error {
	var expendTimeItem schema.ProjExpenditureTime
	if item.StartTime == nil || item.EndTime == nil {
		return nil
	}

	years := item.EndTime.Year() - item.StartTime.Year()
	if years < 0 {
		return errors.ErrBadRequest
	}

	switch item.ExpenditureTimeType {
	case 1:
		expendTimeItem.RecordID = util.MustUUID()
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
		expendTimeItem.RecordID = util.MustUUID()
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
		expendTimeItem.RecordID = util.MustUUID()
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
		expendTimeItem.RecordID = util.MustUUID()
		expendTimeItem.Day = payTime.Day()
		expendTimeItem.Month = int(payTime.Month())
		expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
		expendTimeItem.Year = payTime.Year()
		expendTimeItem.ExpenditureAmount = item.TotalCost
		expendTimeItem.ProjExpenditureID = item.RecordID

	case 5:
		payTime := item.EndTime.AddDate(0, 6, 0)
		expendTimeItem.RecordID = util.MustUUID()
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
		expendTimeItem.RecordID = util.MustUUID()
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
		// 分摊到每个月
		expendTimeItem.ProjExpenditureID = item.RecordID
		months := 12*years + int(item.EndTime.Month()) - int(item.StartTime.Month())
		sMonth := int(item.StartTime.Month())
		sQuarter := (sMonth-1)/3 + 1
		if months == 0 {
			expendTimeItem.ExpenditureAmount = item.TotalCost
		} else {
			expendTimeItem.ExpenditureAmount = item.TotalCost / float64(months)
		}

		for month := 0; month <= months; month++ {
			quarter := (month + 1) / 3
			expendTimeItem.RecordID = util.MustUUID()
			expendTimeItem.Year = item.StartTime.Year() + (sMonth+month-1)/12
			expendTimeItem.Quarter = (sQuarter+quarter-1)%4 + 1
			expendTimeItem.Month = (sMonth+month-1)%12 + 1
			err := a.ProjExpenditureTimeModel.Create(ctx, expendTimeItem)
			if err != nil {
				return err
			}

		}

	case 8:
		// 分摊到每个季度
		expendTimeItem.ProjExpenditureID = item.RecordID
		months := 12*years + int(item.EndTime.Month()) - int(item.StartTime.Month())
		sMonth := int(item.StartTime.Month())
		quarters := months/3 + util.BoolToInt(months%3 > 0)
		sQuarter := (sMonth-1)/3 + 1
		if quarters == 0 {
			expendTimeItem.ExpenditureAmount = item.TotalCost

		} else {
			expendTimeItem.ExpenditureAmount = item.TotalCost / float64(quarters)
		}

		for quarter := 0; quarter <= quarters; quarter++ {
			expendTimeItem.RecordID = util.MustUUID()
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

func (a *ProjExpenditure) update(ctx context.Context, recordID string, item schema.ProjExpenditure) error {
	oldItem, err := a.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		err := a.ReLoad(ctx, oldItem.ProjectID)
		if err != nil {
			return err
		}

		newItem := *oldItem
		if item.StartTime != nil {
			newItem.StartTime = item.StartTime
		}
		if item.EndTime != nil {
			newItem.EndTime = item.EndTime
		}
		if len(item.ProjCostItemIDs) > 0 {
			newItem.ProjCostItemIDs = item.ProjCostItemIDs
		}
		if item.ExpendRate > 0 {
			newItem.ExpendRate = item.ExpendRate
		}
		if item.ExpenditureTimeType > 0 {
			newItem.ExpenditureTimeType = item.ExpenditureTimeType
		}
		if item.Sequence > 0 {
			newItem.Sequence = item.Sequence
		}

		if oldItem.StartTime != newItem.StartTime || oldItem.EndTime != newItem.EndTime ||
			oldItem.ExpenditureTimeType != newItem.ExpenditureTimeType || len(item.ProjCostItemIDs) > 0 ||
			oldItem.ExpendRate != newItem.ExpendRate {
			// 删除对应成本项
			err = a.ProjExpendCostModel.DeleteByProjExpendID(ctx, recordID)
			if err != nil {
				return err
			}

			// 创建对应成本项
			err = a.createProjExpenCost(ctx, &newItem)
			if err != nil {
				return err
			}

			// 删除旧的支出时间表
			err = a.ProjExpenditureTimeModel.DeleteByProjExpendID(ctx, recordID)
			if err != nil {
				return err
			}

			// 创建对应支出时间表
			err = a.createExpendTime(ctx, &newItem)
			if err != nil {
				return err
			}
		}

		err = a.ProjExpenditureModel.Update(ctx, recordID, newItem)
		if err != nil {
			return err
		}

		return nil
	})
}

// ReLoad 更新项目成本项价格数据(对比项目成本项价格和项目支出节点成本项价格 一致则不更新 不一致则更新)
func (a *ProjExpenditure) ReLoad(ctx context.Context, projectID string) error {
	pExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjectID: projectID,
	})
	if err != nil {
		return err
	}

	pCostResult, err := a.ProjCostItemModel.Query(ctx, schema.ProjCostItemQueryParam{
		RecordIDs: pExpendCostResult.Data.ToProjCostIDs(),
	})
	if err != nil {
		return err
	}

	// 计算出需要更新的成本项
	mProjExpendCosts := make(map[string][]*schema.ProjExpendCost)
	mNotRate := map[string]struct{}{}
	var rateProjExpendIDs, notRateProjExpendIDs []string

	for _, pCostItem := range pCostResult.Data {
		for _, pExpendCostItem := range pExpendCostResult.Data {
			// 项目成本项价格非零
			if pCostItem.RecordID == pExpendCostItem.ProjCostID && pCostItem.Price != pExpendCostItem.CostPrice && pExpendCostItem.CostPrice > 0 {
				// 通过比例进行更新
				changedRate := pCostItem.Price / pExpendCostItem.CostPrice
				pExpendCostItem.Amount = pExpendCostItem.Amount * changedRate
				pExpendCostItem.CostPrice = pCostItem.Price
				// 需要更新的项目支出节点对应的成本项
				// 需更新的项目支出节点ID列表
				if _, ok := mProjExpendCosts[pExpendCostItem.ProjExpenditureID]; !ok {
					rateProjExpendIDs = append(rateProjExpendIDs, pExpendCostItem.ProjExpenditureID)

				}
				mProjExpendCosts[pExpendCostItem.ProjExpenditureID] = append(mProjExpendCosts[pExpendCostItem.ProjExpenditureID], pExpendCostItem)
			}
			// 项目成本项价格为零
			if pCostItem.RecordID == pExpendCostItem.ProjCostID && pCostItem.Price != pExpendCostItem.CostPrice && pExpendCostItem.CostPrice == 0 {
				// 非比例进行更新 需要更新的项目支出节点
				// 需更新的项目支出节点ID列表(去重)
				if _, ok := mNotRate[pExpendCostItem.ProjExpenditureID]; !ok {
					mNotRate[pExpendCostItem.ProjExpenditureID] = struct{}{}
					notRateProjExpendIDs = append(notRateProjExpendIDs, pExpendCostItem.ProjExpenditureID)
				}

			}

		}
	}

	projExpendIDs := append(rateProjExpendIDs, notRateProjExpendIDs...)
	if len(projExpendIDs) == 0 {
		return nil
	}

	updateResult, err := a.ProjExpenditureModel.Query(ctx, schema.ProjExpenditureQueryParam{
		RecordIDs: projExpendIDs,
	})
	if err != nil {
		return err
	}

	updateResult.Data.ToMap()
	updateResult.Data.FillProjCostItem(pExpendCostResult.Data)

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		for _, updateItem := range updateResult.Data {
			if _, ok := mNotRate[updateItem.RecordID]; ok {
				err := a.update(ctx, updateItem.RecordID, *updateItem)
				if err != nil {
					return err
				}
				continue
			}

			err := a.reload(ctx, updateItem.RecordID, updateItem, mProjExpendCosts[updateItem.RecordID])
			if err != nil {
				return err
			}
		}
		return nil
	})

}

// reload 更新变更的项目成本项
func (a *ProjExpenditure) reload(ctx context.Context, recordID string, item *schema.ProjExpenditure, projExpendCostItems []*schema.ProjExpendCost) error {
	var totalCost float64
	// 更新项目支出节点对应的成本项价格
	for _, projExpendCostItem := range projExpendCostItems {
		err := a.ProjExpendCostModel.Update(ctx, projExpendCostItem.RecordID, *projExpendCostItem)
		if err != nil {
			return err
		}
		totalCost += projExpendCostItem.Amount

	}
	// 新的项目支出节点的价格
	item.TotalCost = totalCost
	// 删除旧的支出时间表
	err := a.ProjExpenditureTimeModel.DeleteByProjExpendID(ctx, recordID)
	if err != nil {
		return err
	}
	// 创建对应支出时间表
	err = a.createExpendTime(ctx, item)
	if err != nil {
		return err
	}

	err = a.ProjExpenditureModel.Update(ctx, recordID, *item)
	if err != nil {
		return err
	}

	return nil
}
