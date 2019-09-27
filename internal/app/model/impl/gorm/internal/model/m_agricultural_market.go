package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAgriculturalMarket 创建农贸市场管理存储实例
func NewAgriculturalMarket(db *gormplus.DB) *AgriculturalMarket {
	return &AgriculturalMarket{db}
}

// AgriculturalMarket 农贸市场管理存储
type AgriculturalMarket struct {
	db *gormplus.DB
}

func (a *AgriculturalMarket) getQueryOption(opts ...schema.AgriculturalMarketQueryOptions) schema.AgriculturalMarketQueryOptions {
	var opt schema.AgriculturalMarketQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *AgriculturalMarket) Query(ctx context.Context, params schema.AgriculturalMarketQueryParam, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarketQueryResult, error) {
	db := entity.GetAgriculturalMarketDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.AgriculturalMarkets
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AgriculturalMarketQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAgriculturalMarkets(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *AgriculturalMarket) Get(ctx context.Context, recordID string, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarket, error) {
	db := entity.GetAgriculturalMarketDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.AgriculturalMarket
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAgriculturalMarket(), nil
}

// Create 创建数据
func (a *AgriculturalMarket) Create(ctx context.Context, item schema.AgriculturalMarket) error {
	AgriculturalMarket := entity.SchemaAgriculturalMarket(item).ToAgriculturalMarket()
	result := entity.GetAgriculturalMarketDB(ctx, a.db).Create(AgriculturalMarket)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *AgriculturalMarket) Update(ctx context.Context, recordID string, item schema.AgriculturalMarket) error {
	AgriculturalMarket := entity.SchemaAgriculturalMarket(item).ToAgriculturalMarket()
	result := entity.GetAgriculturalMarketDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(AgriculturalMarket)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *AgriculturalMarket) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAgriculturalMarketDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.AgriculturalMarket{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
