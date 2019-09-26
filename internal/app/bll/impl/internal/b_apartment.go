package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewApartment 创建公寓管理
func NewApartment(mApartment model.IApartment) *Apartment {
	return &Apartment{
		ApartmentModel: mApartment,
	}
}

// Apartment 公寓管理业务逻辑
type Apartment struct {
	ApartmentModel model.IApartment
}

// Query 查询数据
func (a *Apartment) Query(ctx context.Context, params schema.ApartmentQueryParam, opts ...schema.ApartmentQueryOptions) (*schema.ApartmentQueryResult, error) {
	return a.ApartmentModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Apartment) Get(ctx context.Context, recordID string, opts ...schema.ApartmentQueryOptions) (*schema.Apartment, error) {
	item, err := a.ApartmentModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Apartment) getUpdate(ctx context.Context, recordID string) (*schema.Apartment, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Apartment) Create(ctx context.Context, item schema.Apartment) (*schema.Apartment, error) {
	item.RecordID = util.MustUUID()
	err := a.ApartmentModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Apartment) Update(ctx context.Context, recordID string, item schema.Apartment) (*schema.Apartment, error) {
	oldItem, err := a.ApartmentModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ApartmentModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Apartment) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ApartmentModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ApartmentModel.Delete(ctx, recordID)
}
