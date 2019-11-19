package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCostBusiness 项目成本项业态业务逻辑接口
type IProjCostBusiness interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCostBusinessQueryParam, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusinessQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusiness, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCostBusiness) (*schema.ProjCostBusiness, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCostBusiness) (*schema.ProjCostBusiness, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
