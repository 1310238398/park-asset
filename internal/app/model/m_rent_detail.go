package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IRentDetail 租金明细存储接口
type IRentDetail interface {
	// 查询数据
	Query(ctx context.Context, params schema.RentDetailQueryParam, opts ...schema.RentDetailQueryOptions) (*schema.RentDetailQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.RentDetailQueryOptions) (*schema.RentDetail, error)
	// 创建数据
	Create(ctx context.Context, item schema.RentDetail) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.RentDetail) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
