package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ITAssetData 资产数据存储接口
type ITAssetData interface {
	// 查询数据
	Query(ctx context.Context, params schema.TAssetDataQueryParam, opts ...schema.TAssetDataQueryOptions) (*schema.TAssetDataQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.TAssetDataQueryOptions) (*schema.TAssetData, error)
	// 创建数据
	Create(ctx context.Context, item schema.TAssetData) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.TAssetData) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
