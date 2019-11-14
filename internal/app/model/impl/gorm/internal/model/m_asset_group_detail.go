package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAssetGroupDetail 创建资产组明细管理存储实例
func NewAssetGroupDetail(db *gormplus.DB) *AssetGroupDetail {
	return &AssetGroupDetail{db}
}

// AssetGroupDetail 资产组明细管理存储
type AssetGroupDetail struct {
	db *gormplus.DB
}

func (a *AssetGroupDetail) getQueryOption(opts ...schema.AssetGroupDetailQueryOptions) schema.AssetGroupDetailQueryOptions {
	var opt schema.AssetGroupDetailQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *AssetGroupDetail) Query(ctx context.Context, params schema.AssetGroupDetailQueryParam, opts ...schema.AssetGroupDetailQueryOptions) (*schema.AssetGroupDetailQueryResult, error) {
	db := entity.GetAssetGroupDetailDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.AssetGroupDetails
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AssetGroupDetailQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAssetGroupDetails(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *AssetGroupDetail) Get(ctx context.Context, recordID string, opts ...schema.AssetGroupDetailQueryOptions) (*schema.AssetGroupDetail, error) {
	db := entity.GetAssetGroupDetailDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.AssetGroupDetail
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAssetGroupDetail(), nil
}

// Create 创建数据
func (a *AssetGroupDetail) Create(ctx context.Context, item schema.AssetGroupDetail) error {
	AssetGroupDetail := entity.SchemaAssetGroupDetail(item).ToAssetGroupDetail()
	result := entity.GetAssetGroupDetailDB(ctx, a.db).Create(AssetGroupDetail)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *AssetGroupDetail) Update(ctx context.Context, recordID string, item schema.AssetGroupDetail) error {
	AssetGroupDetail := entity.SchemaAssetGroupDetail(item).ToAssetGroupDetail()
	result := entity.GetAssetGroupDetailDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(AssetGroupDetail)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *AssetGroupDetail) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAssetGroupDetailDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.AssetGroupDetail{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
