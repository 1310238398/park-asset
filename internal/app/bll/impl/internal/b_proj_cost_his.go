package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCostHis 创建项目成本项历史
func NewProjCostHis(mProjCostHis model.IProjCostHis) *ProjCostHis {
	return &ProjCostHis{
		ProjCostHisModel: mProjCostHis,
	}
}

// ProjCostHis 项目成本项历史业务逻辑
type ProjCostHis struct {
	ProjCostHisModel model.IProjCostHis
}

// Query 查询数据
func (a *ProjCostHis) Query(ctx context.Context, params schema.ProjCostHisQueryParam, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHisQueryResult, error) {
	return a.ProjCostHisModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCostHis) Get(ctx context.Context, recordID string, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHis, error) {
	item, err := a.ProjCostHisModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCostHis) getUpdate(ctx context.Context, recordID string) (*schema.ProjCostHis, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCostHis) Create(ctx context.Context, item schema.ProjCostHis) (*schema.ProjCostHis, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCostHisModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCostHis) Update(ctx context.Context, recordID string, item schema.ProjCostHis) (*schema.ProjCostHis, error) {
	oldItem, err := a.ProjCostHisModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCostHisModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCostHis) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCostHisModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCostHisModel.Delete(ctx, recordID)
}
