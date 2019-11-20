package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCostBusiness 创建项目成本项业态
func NewProjCostBusiness(mProjCostBusiness model.IProjCostBusiness) *ProjCostBusiness {
	return &ProjCostBusiness{
		ProjCostBusinessModel: mProjCostBusiness,
	}
}

// ProjCostBusiness 项目成本项业态业务逻辑
type ProjCostBusiness struct {
	ProjCostBusinessModel model.IProjCostBusiness
}

// Query 查询数据
func (a *ProjCostBusiness) Query(ctx context.Context, params schema.ProjCostBusinessQueryParam, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusinessQueryResult, error) {
	return a.ProjCostBusinessModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCostBusiness) Get(ctx context.Context, recordID string, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusiness, error) {
	item, err := a.ProjCostBusinessModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCostBusiness) getUpdate(ctx context.Context, recordID string) (*schema.ProjCostBusiness, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCostBusiness) Create(ctx context.Context, item schema.ProjCostBusiness) (*schema.ProjCostBusiness, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCostBusinessModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCostBusiness) Update(ctx context.Context, recordID string, item schema.ProjCostBusiness) (*schema.ProjCostBusiness, error) {
	oldItem, err := a.ProjCostBusinessModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCostBusinessModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCostBusiness) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCostBusinessModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCostBusinessModel.Delete(ctx, recordID)
}
