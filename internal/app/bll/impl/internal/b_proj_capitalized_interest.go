package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCapitalizedInterest 创建项目资本化利息测算
func NewProjCapitalizedInterest(mProjCapitalizedInterest model.IProjCapitalizedInterest) *ProjCapitalizedInterest {
	return &ProjCapitalizedInterest{
		ProjCapitalizedInterestModel: mProjCapitalizedInterest,
	}
}

// ProjCapitalizedInterest 项目资本化利息测算业务逻辑
type ProjCapitalizedInterest struct {
	ProjCapitalizedInterestModel model.IProjCapitalizedInterest
}

// Query 查询数据
func (a *ProjCapitalizedInterest) Query(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterestQueryResult, error) {
	return a.ProjCapitalizedInterestModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCapitalizedInterest) Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterest, error) {
	item, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCapitalizedInterest) getUpdate(ctx context.Context, recordID string) (*schema.ProjCapitalizedInterest, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCapitalizedInterest) Create(ctx context.Context, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCapitalizedInterestModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCapitalizedInterest) Update(ctx context.Context, recordID string, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error) {
	oldItem, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCapitalizedInterestModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCapitalizedInterest) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCapitalizedInterestModel.Delete(ctx, recordID)
}
