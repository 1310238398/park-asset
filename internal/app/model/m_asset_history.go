package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAssetHistory 资产历史管理存储接口
type IAssetHistory interface {
	// 查询数据
	Query(ctx context.Context, params schema.AssetHistoryQueryParam, opts ...schema.AssetHistoryQueryOptions) (*schema.AssetHistoryQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AssetHistoryQueryOptions) (*schema.AssetHistory, error)
	// 创建数据
	Create(ctx context.Context, item schema.AssetHistory) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.AssetHistory) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
