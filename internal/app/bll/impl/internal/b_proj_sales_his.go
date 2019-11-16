package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjSalesHis 创建项目销售计划历史
func NewProjSalesHis(mProjSalesHis model.IProjSalesHis) *ProjSalesHis {
	return &ProjSalesHis{
		ProjSalesHisModel: mProjSalesHis,
	}
}

// ProjSalesHis 项目销售计划历史业务逻辑
type ProjSalesHis struct {
	ProjSalesHisModel model.IProjSalesHis
}

// Query 查询数据
func (a *ProjSalesHis) Query(ctx context.Context, params schema.ProjSalesHisQueryParam, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHisQueryResult, error) {
	return a.ProjSalesHisModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjSalesHis) Get(ctx context.Context, recordID string, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHis, error) {
	item, err := a.ProjSalesHisModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjSalesHis) getUpdate(ctx context.Context, recordID string) (*schema.ProjSalesHis, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjSalesHis) Create(ctx context.Context, item schema.ProjSalesHis) (*schema.ProjSalesHis, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjSalesHisModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjSalesHis) Update(ctx context.Context, recordID string, item schema.ProjSalesHis) (*schema.ProjSalesHis, error) {
	oldItem, err := a.ProjSalesHisModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjSalesHisModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjSalesHis) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjSalesHisModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjSalesHisModel.Delete(ctx, recordID)
}
