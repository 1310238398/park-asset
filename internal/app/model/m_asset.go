package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAsset 资产管理存储接口
type IAsset interface {
	// 查询数据
	Query(ctx context.Context, params schema.AssetQueryParam, opts ...schema.AssetQueryOptions) (*schema.AssetQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AssetQueryOptions) (*schema.Asset, error)
	// 创建数据
	Create(ctx context.Context, item schema.Asset) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Asset) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
