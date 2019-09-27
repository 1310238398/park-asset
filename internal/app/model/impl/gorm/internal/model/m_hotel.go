package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewHotel 创建酒店管理存储实例
func NewHotel(db *gormplus.DB) *Hotel {
	return &Hotel{db}
}

// Hotel 酒店管理存储
type Hotel struct {
	db *gormplus.DB
}

func (a *Hotel) getQueryOption(opts ...schema.HotelQueryOptions) schema.HotelQueryOptions {
	var opt schema.HotelQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Hotel) Query(ctx context.Context, params schema.HotelQueryParam, opts ...schema.HotelQueryOptions) (*schema.HotelQueryResult, error) {
	db := entity.GetHotelDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Hotels
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.HotelQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaHotels(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Hotel) Get(ctx context.Context, recordID string, opts ...schema.HotelQueryOptions) (*schema.Hotel, error) {
	db := entity.GetHotelDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Hotel
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaHotel(), nil
}

// Create 创建数据
func (a *Hotel) Create(ctx context.Context, item schema.Hotel) error {
	Hotel := entity.SchemaHotel(item).ToHotel()
	result := entity.GetHotelDB(ctx, a.db).Create(Hotel)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Hotel) Update(ctx context.Context, recordID string, item schema.Hotel) error {
	Hotel := entity.SchemaHotel(item).ToHotel()
	result := entity.GetHotelDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Hotel)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Hotel) Delete(ctx context.Context, recordID string) error {
	result := entity.GetHotelDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Hotel{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
