package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IShop 商铺管理存储接口
type IShop interface {
	// 查询数据
	Query(ctx context.Context, params schema.ShopQueryParam, opts ...schema.ShopQueryOptions) (*schema.ShopQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ShopQueryOptions) (*schema.Shop, error)
	// 创建数据
	Create(ctx context.Context, item schema.Shop) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Shop) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
