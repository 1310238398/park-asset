package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ICostBusiness 成本项业态业务逻辑接口
type ICostBusiness interface {
	// 查询数据
	Query(ctx context.Context, params schema.CostBusinessQueryParam, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusinessQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusiness, error)
	// 创建数据
	Create(ctx context.Context, item schema.CostBusiness) (*schema.CostBusiness, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.CostBusiness) (*schema.CostBusiness, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
