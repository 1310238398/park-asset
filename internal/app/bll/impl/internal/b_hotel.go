package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewHotel 创建酒店管理
func NewHotel(mHotel model.IHotel) *Hotel {
	return &Hotel{
		HotelModel: mHotel,
	}
}

// Hotel 酒店管理业务逻辑
type Hotel struct {
	HotelModel model.IHotel
}

// Query 查询数据
func (a *Hotel) Query(ctx context.Context, params schema.HotelQueryParam, opts ...schema.HotelQueryOptions) (*schema.HotelQueryResult, error) {
	return a.HotelModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Hotel) Get(ctx context.Context, recordID string, opts ...schema.HotelQueryOptions) (*schema.Hotel, error) {
	item, err := a.HotelModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Hotel) getUpdate(ctx context.Context, recordID string) (*schema.Hotel, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Hotel) Create(ctx context.Context, item schema.Hotel) (*schema.Hotel, error) {
	item.RecordID = util.MustUUID()
	err := a.HotelModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Hotel) Update(ctx context.Context, recordID string, item schema.Hotel) (*schema.Hotel, error) {
	oldItem, err := a.HotelModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.HotelModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Hotel) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.HotelModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.HotelModel.Delete(ctx, recordID)
}
