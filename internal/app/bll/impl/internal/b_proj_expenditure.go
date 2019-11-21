package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpenditure 创建项目支出节点
func NewProjExpenditure(mProjExpenditure model.IProjExpenditure, mTrans model.ITrans,
	mProjExpendCost model.IProjExpendCost, mProjCostItem model.IProjCostItem) *ProjExpenditure {
	return &ProjExpenditure{
		ProjExpenditureModel: mProjExpenditure,
		TransModel:           mTrans,
		ProjExpendCostModel:  mProjExpendCost,
		ProjCostItemModel:    mProjCostItem,
	}
}

// ProjExpenditure 项目支出节点业务逻辑
type ProjExpenditure struct {
	TransModel           model.ITrans
	ProjExpenditureModel model.IProjExpenditure
	ProjExpendCostModel  model.IProjExpendCost
	ProjCostItemModel    model.IProjCostItem
}

// Query 查询数据
func (a *ProjExpenditure) Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error) {
	return a.ProjExpenditureModel.Query(ctx, params, opts...)
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

	err = a.ProjExpenditureModel.Update(ctx, recordID, item)
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

	return a.ProjExpenditureModel.Delete(ctx, recordID)
}

func (a *ProjExpenditure) create(ctx context.Context, item schema.ProjExpenditure) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {

		// TODO 对应支出时间表
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

		case 2:
			expendTimeItem.Day = item.EndTime.Day()
			expendTimeItem.Month = int(item.EndTime.Month())
			expendTimeItem.Quarter = (int(item.EndTime.Month())-1)/3 + 1
			expendTimeItem.Year = item.EndTime.Year()

		case 3:
			payTime := item.EndTime.AddDate(0, 0, 30)
			expendTimeItem.Day = payTime.Day()
			expendTimeItem.Month = int(payTime.Month())
			expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
			expendTimeItem.Year = payTime.Year()

		case 4:
			payTime := item.EndTime.AddDate(0, 2, 0)
			expendTimeItem.Day = payTime.Day()
			expendTimeItem.Month = int(payTime.Month())
			expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
			expendTimeItem.Year = payTime.Year()

		case 5:
			payTime := item.EndTime.AddDate(0, 6, 0)
			expendTimeItem.Day = payTime.Day()
			expendTimeItem.Month = int(payTime.Month())
			expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
			expendTimeItem.Year = payTime.Year()

		case 6:
			payTime := item.EndTime.AddDate(1, 0, 0)
			expendTimeItem.Day = payTime.Day()
			expendTimeItem.Month = int(payTime.Month())
			expendTimeItem.Quarter = (int(payTime.Month())-1)/3 + 1
			expendTimeItem.Year = payTime.Year()

		case 7:
			// for i := 0; i < years; i++ {
			// 	expendTimeItem.Year = item.StartTime.Year()
			// 	quarters := years / 3

			// }
		case 8:
			// months := 12*years + int(item.EndTime.Month()) - int(item.StartTime.Month())
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

func (a *ProjExpenditure) createProjExpenCost(ctx context.Context, item schema.ProjExpenditure) error {
	err := a.ProjExpenditureModel.Create(ctx, item)
	if err != nil {
		return err
	}
	result, err := a.ProjCostItemModel.Query(ctx, schema.ProjCostItemQueryParam{
		ProjectID: item.ProjectID,
	})
	if err != nil {
		return err
	}

	// 获取项目成本项键值对
	// projCostMap := result.Data.ToMap()

	for _, projCostItem := range item.ProjCostItems {
		var projExpendCost schema.ProjExpendCost
		projExpendCost.RecordID = util.MustUUID()
		projExpendCost.ProjExpenditureID = item.RecordID
		projExpendCost.ProjCostID = projCostItem.RecordID
		_ = result.Data
		err = a.ProjExpendCostModel.Create(ctx, projExpendCost)
		if err != nil {
			return err
		}
	}

	return nil
}

// 获取此项目支出节点对应的所有项目成本项支出金额之和
func (a *ProjExpenditure) getTotalCostTimeProjCosts(ctx context.Context, item schema.ProjExpenditure) (float64, error) {
	projExpendCostResult, err := a.ProjExpendCostModel.Query(ctx, schema.ProjExpendCostQueryParam{
		ProjExpenditureID: item.RecordID,
	})
	if err != nil {
		return 0, nil
	}

	var totalCost float64
	for _, item := range projExpendCostResult.Data {
		totalCost += item.Amount
	}

	return totalCost, nil
}

// 此项目支出节点对应成本项累计支出金额
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
	for _, item := range projExpendCostResult.Data {
		m[item.ProjCostID] += item.Amount
	}

	return nil, nil
}
