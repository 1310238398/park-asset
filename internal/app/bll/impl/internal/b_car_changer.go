package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewCarChanger 创建车改商管理
func NewCarChanger(mCarChanger model.ICarChanger) *CarChanger {
	return &CarChanger{
		CarChangerModel: mCarChanger,
	}
}

// CarChanger 车改商管理业务逻辑
type CarChanger struct {
	CarChangerModel model.ICarChanger
}

// Query 查询数据
func (a *CarChanger) Query(ctx context.Context, params schema.CarChangerQueryParam, opts ...schema.CarChangerQueryOptions) (*schema.CarChangerQueryResult, error) {
	return a.CarChangerModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *CarChanger) Get(ctx context.Context, recordID string, opts ...schema.CarChangerQueryOptions) (*schema.CarChanger, error) {
	item, err := a.CarChangerModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *CarChanger) getUpdate(ctx context.Context, recordID string) (*schema.CarChanger, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *CarChanger) Create(ctx context.Context, item schema.CarChanger) (*schema.CarChanger, error) {
	item.RecordID = util.MustUUID()
	err := a.CarChangerModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *CarChanger) Update(ctx context.Context, recordID string, item schema.CarChanger) (*schema.CarChanger, error) {
	oldItem, err := a.CarChangerModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.CarChangerModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *CarChanger) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.CarChangerModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.CarChangerModel.Delete(ctx, recordID)
}
