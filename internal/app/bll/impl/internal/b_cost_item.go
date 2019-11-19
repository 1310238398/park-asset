package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewCostItem 创建成本项
func NewCostItem(mCostItem model.ICostItem) *CostItem {
	return &CostItem{
		CostItemModel: mCostItem,
	}
}

// CostItem 成本项业务逻辑
type CostItem struct {
	CostItemModel model.ICostItem
}

// Query 查询数据
func (a *CostItem) Query(ctx context.Context, params schema.CostItemQueryParam, opts ...schema.CostItemQueryOptions) (*schema.CostItemQueryResult, error) {
	return a.CostItemModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *CostItem) Get(ctx context.Context, recordID string, opts ...schema.CostItemQueryOptions) (*schema.CostItem, error) {
	item, err := a.CostItemModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *CostItem) getUpdate(ctx context.Context, recordID string) (*schema.CostItem, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *CostItem) Create(ctx context.Context, item schema.CostItem) (*schema.CostItem, error) {
	item.RecordID = util.MustUUID()
	err := a.CostItemModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *CostItem) Update(ctx context.Context, recordID string, item schema.CostItem) (*schema.CostItem, error) {
	oldItem, err := a.CostItemModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.CostItemModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *CostItem) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.CostItemModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.CostItemModel.Delete(ctx, recordID)
}
