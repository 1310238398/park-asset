package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAssetGroupDetail 资产组明细管理存储接口
type IAssetGroupDetail interface {
	// 查询数据
	Query(ctx context.Context, params schema.AssetGroupDetailQueryParam, opts ...schema.AssetGroupDetailQueryOptions) (*schema.AssetGroupDetailQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AssetGroupDetailQueryOptions) (*schema.AssetGroupDetail, error)
	// 创建数据
	Create(ctx context.Context, item schema.AssetGroupDetail) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.AssetGroupDetail) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
