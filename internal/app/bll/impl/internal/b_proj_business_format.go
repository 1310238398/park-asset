package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjBusinessFormat 创建项目业态
func NewProjBusinessFormat(mProjBusinessFormat model.IProjBusinessFormat) *ProjBusinessFormat {
	return &ProjBusinessFormat{
		ProjBusinessFormatModel: mProjBusinessFormat,
	}
}

// ProjBusinessFormat 项目业态业务逻辑
type ProjBusinessFormat struct {
	ProjBusinessFormatModel model.IProjBusinessFormat
}

// Query 查询数据
func (a *ProjBusinessFormat) Query(ctx context.Context, params schema.ProjBusinessFormatQueryParam, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormatQueryResult, error) {
	return a.ProjBusinessFormatModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjBusinessFormat) Get(ctx context.Context, recordID string, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormat, error) {
	item, err := a.ProjBusinessFormatModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjBusinessFormat) getUpdate(ctx context.Context, recordID string) (*schema.ProjBusinessFormat, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjBusinessFormat) Create(ctx context.Context, item schema.ProjBusinessFormat) (*schema.ProjBusinessFormat, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjBusinessFormatModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjBusinessFormat) Update(ctx context.Context, recordID string, item schema.ProjBusinessFormat) (*schema.ProjBusinessFormat, error) {
	oldItem, err := a.ProjBusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjBusinessFormatModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjBusinessFormat) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjBusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjBusinessFormatModel.Delete(ctx, recordID)
}
