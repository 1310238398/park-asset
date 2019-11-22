package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjDeliveryStandard 成本项目交付标准业务逻辑接口
type IProjDeliveryStandard interface {

	// 整体更新
	UpdateList(ctx context.Context, projectID string, list []*schema.ProjDeliveryStandard) error
	// 查询数据
	Query(ctx context.Context, params schema.ProjDeliveryStandardQueryParam, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandardQueryResult, error)
	// 查询树结构
	QueryTree(ctx context.Context, params schema.ProjDeliveryStandardQueryParam) (schema.ProjDeliveryStandards, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandard, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
