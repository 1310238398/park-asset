package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjSalesPlan 项目销售计划业务逻辑接口
type IProjSalesPlan interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjSalesPlanQueryParam, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlanQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlan, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 批量创建
	CreateList(ctx context.Context, items schema.ProjSalesPlans) error
	// 批量删除
	DeleteList(ctx context.Context, recordIDs []string) error
}
