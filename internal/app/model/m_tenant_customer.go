package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ITenantCustomer 租户信息管理存储接口
type ITenantCustomer interface {
	// 查询数据
	Query(ctx context.Context, params schema.TenantCustomerQueryParam, opts ...schema.TenantCustomerQueryOptions) (*schema.TenantCustomerQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.TenantCustomerQueryOptions) (*schema.TenantCustomer, error)
	// 创建数据
	Create(ctx context.Context, item schema.TenantCustomer) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.TenantCustomer) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
