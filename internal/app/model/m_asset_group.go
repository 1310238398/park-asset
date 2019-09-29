package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAssetGroup 资产组管理存储接口
type IAssetGroup interface {
	// 查询数据
	Query(ctx context.Context, params schema.AssetGroupQueryParam, opts ...schema.AssetGroupQueryOptions) (*schema.AssetGroupQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AssetGroupQueryOptions) (*schema.AssetGroup, error)
	// 创建数据
	Create(ctx context.Context, item schema.AssetGroup) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.AssetGroup) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
