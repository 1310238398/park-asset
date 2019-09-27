package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IAssetRentPayment 资产租金缴费明细存储接口
type IAssetRentPayment interface {
	// 查询数据
	Query(ctx context.Context, params schema.AssetRentPaymentQueryParam, opts ...schema.AssetRentPaymentQueryOptions) (*schema.AssetRentPaymentQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.AssetRentPaymentQueryOptions) (*schema.AssetRentPayment, error)
	// 创建数据
	Create(ctx context.Context, item schema.AssetRentPayment) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.AssetRentPayment) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
