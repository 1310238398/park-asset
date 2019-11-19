package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewBusinessFormat 创建业态
func NewBusinessFormat(mBusinessFormat model.IBusinessFormat) *BusinessFormat {
	return &BusinessFormat{
		BusinessFormatModel: mBusinessFormat,
	}
}

// BusinessFormat 业态业务逻辑
type BusinessFormat struct {
	BusinessFormatModel model.IBusinessFormat
}

// Query 查询数据
func (a *BusinessFormat) Query(ctx context.Context, params schema.BusinessFormatQueryParam, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormatQueryResult, error) {
	return a.BusinessFormatModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *BusinessFormat) Get(ctx context.Context, recordID string, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormat, error) {
	item, err := a.BusinessFormatModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *BusinessFormat) getUpdate(ctx context.Context, recordID string) (*schema.BusinessFormat, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *BusinessFormat) Create(ctx context.Context, item schema.BusinessFormat) (*schema.BusinessFormat, error) {
	item.RecordID = util.MustUUID()
	err := a.BusinessFormatModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *BusinessFormat) Update(ctx context.Context, recordID string, item schema.BusinessFormat) (*schema.BusinessFormat, error) {
	oldItem, err := a.BusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.BusinessFormatModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *BusinessFormat) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.BusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.BusinessFormatModel.Delete(ctx, recordID)
}
