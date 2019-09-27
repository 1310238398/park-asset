package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewApartment 创建公寓管理存储实例
func NewApartment(db *gormplus.DB) *Apartment {
	return &Apartment{db}
}

// Apartment 公寓管理存储
type Apartment struct {
	db *gormplus.DB
}

func (a *Apartment) getQueryOption(opts ...schema.ApartmentQueryOptions) schema.ApartmentQueryOptions {
	var opt schema.ApartmentQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Apartment) Query(ctx context.Context, params schema.ApartmentQueryParam, opts ...schema.ApartmentQueryOptions) (*schema.ApartmentQueryResult, error) {
	db := entity.GetApartmentDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Apartments
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ApartmentQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaApartments(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Apartment) Get(ctx context.Context, recordID string, opts ...schema.ApartmentQueryOptions) (*schema.Apartment, error) {
	db := entity.GetApartmentDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Apartment
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaApartment(), nil
}

// Create 创建数据
func (a *Apartment) Create(ctx context.Context, item schema.Apartment) error {
	Apartment := entity.SchemaApartment(item).ToApartment()
	result := entity.GetApartmentDB(ctx, a.db).Create(Apartment)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Apartment) Update(ctx context.Context, recordID string, item schema.Apartment) error {
	Apartment := entity.SchemaApartment(item).ToApartment()
	result := entity.GetApartmentDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Apartment)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Apartment) Delete(ctx context.Context, recordID string) error {
	result := entity.GetApartmentDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Apartment{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
