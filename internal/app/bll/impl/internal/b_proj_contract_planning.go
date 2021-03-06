package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjContractPlanning 创建项目合约规划
func NewProjContractPlanning(
	mTrans model.ITrans,
	mProjContractPlanning model.IProjContractPlanning,
	mContractPlanningTemplate model.IContractPlanningTemplate,
	mProjIncomeCalculation model.IProjIncomeCalculation,
	mCostItem model.ICostItem,
	mProjCostHis model.IProjCostHis,
	mPcProject model.IPcProject,

) *ProjContractPlanning {
	return &ProjContractPlanning{
		TransModel:                    mTrans,
		ProjContractPlanningModel:     mProjContractPlanning,
		ContractPlanningTemplateModel: mContractPlanningTemplate,
		ProjIncomeCalculationModel:    mProjIncomeCalculation,
		CostItemModel:                 mCostItem,
		ProjCostHisModel:              mProjCostHis,
		PcProjectModel:                mPcProject,
	}
}

// ProjContractPlanning 项目合约规划业务逻辑
type ProjContractPlanning struct {
	TransModel                    model.ITrans
	ProjContractPlanningModel     model.IProjContractPlanning
	ContractPlanningTemplateModel model.IContractPlanningTemplate
	ProjIncomeCalculationModel    model.IProjIncomeCalculation
	CostItemModel                 model.ICostItem
	ProjCostHisModel              model.IProjCostHis
	PcProjectModel                model.IPcProject
}

// Query 查询数据
func (a *ProjContractPlanning) Query(ctx context.Context, params schema.ProjContractPlanningQueryParam, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanningQueryResult, error) {
	err := a.generate(ctx, params.ProjectID)
	if err != nil {
		return nil, err
	}

	result, err := a.ProjContractPlanningModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	err = a.FillCostNamePath(ctx, result.Data)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// Get 查询指定数据
func (a *ProjContractPlanning) Get(ctx context.Context, recordID string, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanning, error) {
	item, err := a.ProjContractPlanningModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjContractPlanning) getUpdate(ctx context.Context, recordID string) (*schema.ProjContractPlanning, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjContractPlanning) Create(ctx context.Context, item schema.ProjContractPlanning) (*schema.ProjContractPlanning, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjContractPlanningModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjContractPlanning) Update(ctx context.Context, recordID string, item schema.ProjContractPlanning) (*schema.ProjContractPlanning, error) {
	oldItem, err := a.ProjContractPlanningModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	newItem := oldItem
	newItem.Name = item.Name
	newItem.Information = item.Information
	newItem.PlanningChange = item.PlanningChange
	newItem.PlanningPrice = item.PlanningPrice
	newItem.Memo = item.Memo
	err = a.ProjContractPlanningModel.Update(ctx, recordID, *newItem)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjContractPlanning) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjContractPlanningModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjContractPlanningModel.Delete(ctx, recordID)
}

func (a *ProjContractPlanning) generate(ctx context.Context, projectID string) error {
	pIncomeResult, err := a.ProjIncomeCalculationModel.Query(ctx, schema.ProjIncomeCalculationQueryParam{
		ProjectID: projectID,
		Flag:      4,
	}, schema.ProjIncomeCalculationQueryOptions{
		PageParam: &schema.PaginationParam{
			PageSize: -1,
		},
	})
	if err != nil {
		return err
	}
	sizeResult, err := a.ProjContractPlanningModel.Query(ctx, schema.ProjContractPlanningQueryParam{
		ProjectID: projectID,
	}, schema.ProjContractPlanningQueryOptions{
		PageParam: &schema.PaginationParam{
			PageSize: -1,
		},
	})
	if err != nil {
		return err
	}

	if pIncomeResult.PageResult.Total != 1 || sizeResult.PageResult.Total != 0 {
		return nil
	}

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		templateResult, err := a.ContractPlanningTemplateModel.Query(ctx, schema.ContractPlanningTemplateQueryParam{})
		if err != nil {
			return err
		}
		for _, templateItem := range templateResult.Data {
			err = a.ProjContractPlanningModel.Create(ctx, schema.ProjContractPlanning{
				RecordID:     util.MustUUID(),
				CostID:       templateItem.CostID,
				ContractType: templateItem.ContractType,
				Name:         templateItem.Name,
				Information:  templateItem.Information,
				ProjectID:    projectID,
			})
			if err != nil {
				return err
			}
		}
		return nil
	})

}

// FillCostNamePath 填充成本科目名路经
func (a *ProjContractPlanning) FillCostNamePath(ctx context.Context, items schema.ProjContractPlannings) error {
	costResult, err := a.CostItemModel.Query(ctx, schema.CostItemQueryParam{
		Label: 1,
	})
	if err != nil {
		return err
	}
	m := costResult.Data.ToNameMap()

	for _, item := range items {
		if namePath, ok := m[item.CostID]; ok {
			item.CostNamePath = namePath
		}
	}

	return nil
}

// QueryStatistic 查询统计数据
func (a *ProjContractPlanning) QueryStatistic(ctx context.Context, params schema.ProjContractPlanningQueryParam) (*schema.PContractStatistic, error) {
	pIncomeResult, err := a.ProjIncomeCalculationModel.Query(ctx, schema.ProjIncomeCalculationQueryParam{
		ProjectID: params.ProjectID,
		Flag:      4,
	})
	if err != nil {
		return nil, err
	} else if len(pIncomeResult.Data) != 1 {
		return nil, errors.ErrNoInCome
	}

	var item schema.PContractStatistic
	pCostHisResult, err := a.ProjCostHisModel.Query(ctx, schema.ProjCostHisQueryParam{
		CostID:       params.CostID,
		ProjectID:    params.ProjectID,
		ProjIncomeID: pIncomeResult.Data[0].RecordID,
	})
	if err != nil {
		return nil, err
	}

	if len(pCostHisResult.Data) == 0 {
		item.TargetCost = 0
	} else if len(pCostHisResult.Data) > 0 {
		item.TargetCost = util.DecimalFloat64(pCostHisResult.Data[0].Price)
	}

	pContractPlanResult, err := a.ProjContractPlanningModel.Query(ctx, params)
	if err != nil {
		return nil, err
	}
	item.Count = len(pContractPlanResult.Data)

	for _, sitem := range pContractPlanResult.Data {
		item.PlanAmount += sitem.PlanningPrice + sitem.PlanningChange
	}
	item.LeftAmount = item.TargetCost - item.PlanAmount

	util.DecimalFloat64(item.PlanAmount)
	util.DecimalFloat64(item.LeftAmount)
	return &item, nil
}

// Audit 审核 status (1:审核中 2:通过 3:拒绝)
func (a *ProjContractPlanning) Audit(ctx context.Context, projectID string, status int) error {
	if status == 2 {
		// 审核通过 合同执行阶段
		err := a.PcProjectModel.UpdateStage(ctx, projectID, 5)
		if err != nil {
			return err
		}
	}

	return nil
}
