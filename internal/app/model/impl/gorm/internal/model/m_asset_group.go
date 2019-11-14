package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAssetGroup 创建资产组管理存储实例
func NewAssetGroup(db *gormplus.DB) *AssetGroup {
	return &AssetGroup{db}
}

// AssetGroup 资产组管理存储
type AssetGroup struct {
	db *gormplus.DB
}

func (a *AssetGroup) getQueryOption(opts ...schema.AssetGroupQueryOptions) schema.AssetGroupQueryOptions {
	var opt schema.AssetGroupQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *AssetGroup) Query(ctx context.Context, params schema.AssetGroupQueryParam, opts ...schema.AssetGroupQueryOptions) (*schema.AssetGroupQueryResult, error) {
	db := entity.GetAssetGroupDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.AssetGroups
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AssetGroupQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAssetGroups(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *AssetGroup) Get(ctx context.Context, recordID string, opts ...schema.AssetGroupQueryOptions) (*schema.AssetGroup, error) {
	db := entity.GetAssetGroupDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.AssetGroup
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAssetGroup(), nil
}

// Create 创建数据
func (a *AssetGroup) Create(ctx context.Context, item schema.AssetGroup) error {
	AssetGroup := entity.SchemaAssetGroup(item).ToAssetGroup()
	result := entity.GetAssetGroupDB(ctx, a.db).Create(AssetGroup)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *AssetGroup) Update(ctx context.Context, recordID string, item schema.AssetGroup) error {
	AssetGroup := entity.SchemaAssetGroup(item).ToAssetGroup()
	result := entity.GetAssetGroupDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(AssetGroup)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *AssetGroup) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAssetGroupDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.AssetGroup{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
