package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjSalesPlan 创建项目销售计划
func NewProjSalesPlan(mProjSalesPlan model.IProjSalesPlan) *ProjSalesPlan {
	return &ProjSalesPlan{
		ProjSalesPlanModel: mProjSalesPlan,
	}
}

// ProjSalesPlan 项目销售计划业务逻辑
type ProjSalesPlan struct {
	ProjSalesPlanModel model.IProjSalesPlan
}

// Query 查询数据
func (a *ProjSalesPlan) Query(ctx context.Context, params schema.ProjSalesPlanQueryParam, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlanQueryResult, error) {
	return a.ProjSalesPlanModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjSalesPlan) Get(ctx context.Context, recordID string, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlan, error) {
	item, err := a.ProjSalesPlanModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjSalesPlan) getUpdate(ctx context.Context, recordID string) (*schema.ProjSalesPlan, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjSalesPlan) Create(ctx context.Context, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjSalesPlanModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjSalesPlan) Update(ctx context.Context, recordID string, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error) {
	oldItem, err := a.ProjSalesPlanModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjSalesPlanModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjSalesPlan) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjSalesPlanModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjSalesPlanModel.Delete(ctx, recordID)
}
