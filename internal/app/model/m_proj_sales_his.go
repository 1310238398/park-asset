package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjSalesHis 项目销售计划历史存储接口
type IProjSalesHis interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjSalesHisQueryParam, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHisQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHis, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjSalesHis) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjSalesHis) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
