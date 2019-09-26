package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewShop 创建商铺管理存储实例
func NewShop(db *gormplus.DB) *Shop {
	return &Shop{db}
}

// Shop 商铺管理存储
type Shop struct {
	db *gormplus.DB
}

func (a *Shop) getQueryOption(opts ...schema.ShopQueryOptions) schema.ShopQueryOptions {
	var opt schema.ShopQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Shop) Query(ctx context.Context, params schema.ShopQueryParam, opts ...schema.ShopQueryOptions) (*schema.ShopQueryResult, error) {
	db := entity.GetShopDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Shops
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ShopQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaShops(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Shop) Get(ctx context.Context, recordID string, opts ...schema.ShopQueryOptions) (*schema.Shop, error) {
	db := entity.GetShopDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Shop
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaShop(), nil
}

// Create 创建数据
func (a *Shop) Create(ctx context.Context, item schema.Shop) error {
	Shop := entity.SchemaShop(item).ToShop()
	result := entity.GetShopDB(ctx, a.db).Create(Shop)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Shop) Update(ctx context.Context, recordID string, item schema.Shop) error {
	Shop := entity.SchemaShop(item).ToShop()
	result := entity.GetShopDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Shop)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Shop) Delete(ctx context.Context, recordID string) error {
	result := entity.GetShopDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Shop{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
