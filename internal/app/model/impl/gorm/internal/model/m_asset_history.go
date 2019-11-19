package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAssetHistory 创建资产历史管理存储实例
func NewAssetHistory(db *gormplus.DB) *AssetHistory {
	return &AssetHistory{db}
}

// AssetHistory 资产历史管理存储
type AssetHistory struct {
	db *gormplus.DB
}

func (a *AssetHistory) getQueryOption(opts ...schema.AssetHistoryQueryOptions) schema.AssetHistoryQueryOptions {
	var opt schema.AssetHistoryQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *AssetHistory) Query(ctx context.Context, params schema.AssetHistoryQueryParam, opts ...schema.AssetHistoryQueryOptions) (*schema.AssetHistoryQueryResult, error) {
	db := entity.GetAssetHistoryDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.AssetHistories
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AssetHistoryQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAssetHistories(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *AssetHistory) Get(ctx context.Context, recordID string, opts ...schema.AssetHistoryQueryOptions) (*schema.AssetHistory, error) {
	db := entity.GetAssetHistoryDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.AssetHistory
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAssetHistory(), nil
}

// Create 创建数据
func (a *AssetHistory) Create(ctx context.Context, item schema.AssetHistory) error {
	AssetHistory := entity.SchemaAssetHistory(item).ToAssetHistory()
	result := entity.GetAssetHistoryDB(ctx, a.db).Create(AssetHistory)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *AssetHistory) Update(ctx context.Context, recordID string, item schema.AssetHistory) error {
	AssetHistory := entity.SchemaAssetHistory(item).ToAssetHistory()
	result := entity.GetAssetHistoryDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(AssetHistory)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *AssetHistory) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAssetHistoryDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.AssetHistory{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
