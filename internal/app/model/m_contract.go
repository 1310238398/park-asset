package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IContract 合同信息管理存储接口
type IContract interface {
	// 查询数据
	Query(ctx context.Context, params schema.ContractQueryParam, opts ...schema.ContractQueryOptions) (*schema.ContractQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ContractQueryOptions) (*schema.Contract, error)
	// 创建数据
	Create(ctx context.Context, item schema.Contract) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Contract) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
