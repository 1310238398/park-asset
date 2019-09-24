package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAsset 创建资产管理存储实例
func NewAsset(db *gormplus.DB) *Asset {
	return &Asset{db}
}

// Asset 资产管理存储
type Asset struct {
	db *gormplus.DB
}

func (a *Asset) getQueryOption(opts ...schema.AssetQueryOptions) schema.AssetQueryOptions {
	var opt schema.AssetQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Asset) Query(ctx context.Context, params schema.AssetQueryParam, opts ...schema.AssetQueryOptions) (*schema.AssetQueryResult, error) {
	db := entity.GetAssetDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Assets
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AssetQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAssets(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Asset) Get(ctx context.Context, recordID string, opts ...schema.AssetQueryOptions) (*schema.Asset, error) {
	db := entity.GetAssetDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Asset
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAsset(), nil
}

// Create 创建数据
func (a *Asset) Create(ctx context.Context, item schema.Asset) error {
	Asset := entity.SchemaAsset(item).ToAsset()
	result := entity.GetAssetDB(ctx, a.db).Create(Asset)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Asset) Update(ctx context.Context, recordID string, item schema.Asset) error {
	Asset := entity.SchemaAsset(item).ToAsset()
	result := entity.GetAssetDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Asset)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Asset) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAssetDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Asset{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
