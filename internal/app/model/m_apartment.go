package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IApartment 公寓管理存储接口
type IApartment interface {
	// 查询数据
	Query(ctx context.Context, params schema.ApartmentQueryParam, opts ...schema.ApartmentQueryOptions) (*schema.ApartmentQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ApartmentQueryOptions) (*schema.Apartment, error)
	// 创建数据
	Create(ctx context.Context, item schema.Apartment) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Apartment) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
