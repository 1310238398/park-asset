package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewCostBusiness 创建成本项业态
func NewCostBusiness(mCostBusiness model.ICostBusiness) *CostBusiness {
	return &CostBusiness{
		CostBusinessModel: mCostBusiness,
	}
}

// CostBusiness 成本项业态业务逻辑
type CostBusiness struct {
	CostBusinessModel model.ICostBusiness
}

// Query 查询数据
func (a *CostBusiness) Query(ctx context.Context, params schema.CostBusinessQueryParam, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusinessQueryResult, error) {
	return a.CostBusinessModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *CostBusiness) Get(ctx context.Context, recordID string, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusiness, error) {
	item, err := a.CostBusinessModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *CostBusiness) getUpdate(ctx context.Context, recordID string) (*schema.CostBusiness, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *CostBusiness) Create(ctx context.Context, item schema.CostBusiness) (*schema.CostBusiness, error) {
	item.RecordID = util.MustUUID()
	err := a.CostBusinessModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *CostBusiness) Update(ctx context.Context, recordID string, item schema.CostBusiness) (*schema.CostBusiness, error) {
	oldItem, err := a.CostBusinessModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.CostBusinessModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *CostBusiness) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.CostBusinessModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.CostBusinessModel.Delete(ctx, recordID)
}
