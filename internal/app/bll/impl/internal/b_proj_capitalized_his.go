package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCapitalizedHis 创建项目资本化利息测算历史
func NewProjCapitalizedHis(mProjCapitalizedHis model.IProjCapitalizedHis) *ProjCapitalizedHis {
	return &ProjCapitalizedHis{
		ProjCapitalizedHisModel: mProjCapitalizedHis,
	}
}

// ProjCapitalizedHis 项目资本化利息测算历史业务逻辑
type ProjCapitalizedHis struct {
	ProjCapitalizedHisModel model.IProjCapitalizedHis
}

// Query 查询数据
func (a *ProjCapitalizedHis) Query(ctx context.Context, params schema.ProjCapitalizedHisQueryParam, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHisQueryResult, error) {
	return a.ProjCapitalizedHisModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCapitalizedHis) Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHis, error) {
	item, err := a.ProjCapitalizedHisModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCapitalizedHis) getUpdate(ctx context.Context, recordID string) (*schema.ProjCapitalizedHis, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCapitalizedHis) Create(ctx context.Context, item schema.ProjCapitalizedHis) (*schema.ProjCapitalizedHis, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCapitalizedHisModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCapitalizedHis) Update(ctx context.Context, recordID string, item schema.ProjCapitalizedHis) (*schema.ProjCapitalizedHis, error) {
	oldItem, err := a.ProjCapitalizedHisModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCapitalizedHisModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCapitalizedHis) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCapitalizedHisModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCapitalizedHisModel.Delete(ctx, recordID)
}
