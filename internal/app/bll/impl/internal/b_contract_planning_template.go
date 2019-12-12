package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewContractPlanningTemplate 创建合约规划模板
func NewContractPlanningTemplate(
	mContractPlanningTemplate model.IContractPlanningTemplate,
	mCostItem model.ICostItem,
) *ContractPlanningTemplate {
	return &ContractPlanningTemplate{
		CostItemModel:                 mCostItem,
		ContractPlanningTemplateModel: mContractPlanningTemplate,
	}
}

// ContractPlanningTemplate 合约规划模板业务逻辑
type ContractPlanningTemplate struct {
	CostItemModel                 model.ICostItem
	ContractPlanningTemplateModel model.IContractPlanningTemplate
}

// Query 查询数据
func (a *ContractPlanningTemplate) Query(ctx context.Context, params schema.ContractPlanningTemplateQueryParam, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplateQueryResult, error) {
	result, err := a.ContractPlanningTemplateModel.Query(ctx, params, opts...)
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
func (a *ContractPlanningTemplate) Get(ctx context.Context, recordID string, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplate, error) {
	item, err := a.ContractPlanningTemplateModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	err = a.FillCostNamePath(ctx, schema.ContractPlanningTemplates{item})
	if err != nil {
		return nil, err
	}

	return item, nil
}

func (a *ContractPlanningTemplate) getUpdate(ctx context.Context, recordID string) (*schema.ContractPlanningTemplate, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ContractPlanningTemplate) Create(ctx context.Context, item schema.ContractPlanningTemplate) (*schema.ContractPlanningTemplate, error) {
	item.RecordID = util.MustUUID()
	err := a.ContractPlanningTemplateModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ContractPlanningTemplate) Update(ctx context.Context, recordID string, item schema.ContractPlanningTemplate) (*schema.ContractPlanningTemplate, error) {
	oldItem, err := a.ContractPlanningTemplateModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ContractPlanningTemplateModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ContractPlanningTemplate) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ContractPlanningTemplateModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ContractPlanningTemplateModel.Delete(ctx, recordID)
}

// FillCostNamePath 填充成本项科目名称路经
func (a *ContractPlanningTemplate) FillCostNamePath(ctx context.Context, items schema.ContractPlanningTemplates) error {
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
