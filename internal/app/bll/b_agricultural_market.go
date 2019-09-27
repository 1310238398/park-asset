package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAgriculturalMarket 农贸市场管理业务逻辑接口
type IAgriculturalMarket interface {
	// 查询数据
	Query(ctx context.Context, params schema.AgriculturalMarketQueryParam, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarketQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarket, error)
	// 创建数据
	Create(ctx context.Context, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
