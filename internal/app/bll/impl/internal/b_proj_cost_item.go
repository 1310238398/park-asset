package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCostItem 创建项目成本项
func NewProjCostItem(mProjCostItem model.IProjCostItem) *ProjCostItem {
	return &ProjCostItem{
		ProjCostItemModel: mProjCostItem,
	}
}

// ProjCostItem 项目成本项业务逻辑
type ProjCostItem struct {
	ProjCostItemModel model.IProjCostItem
}

// Query 查询数据
func (a *ProjCostItem) Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error) {
	return a.ProjCostItemModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCostItem) Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error) {
	item, err := a.ProjCostItemModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCostItem) getUpdate(ctx context.Context, recordID string) (*schema.ProjCostItem, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCostItem) Create(ctx context.Context, item schema.ProjCostItem) (*schema.ProjCostItem, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCostItemModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCostItem) Update(ctx context.Context, recordID string, item schema.ProjCostItem) (*schema.ProjCostItem, error) {
	oldItem, err := a.ProjCostItemModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCostItemModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCostItem) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCostItemModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCostItemModel.Delete(ctx, recordID)
}
