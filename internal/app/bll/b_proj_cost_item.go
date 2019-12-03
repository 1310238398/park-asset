package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCostItem 项目成本项业务逻辑接口
type IProjCostItem interface {
	// 成本项目初始化
	Init(ctx context.Context, projectID string) error
	// 查询树结构
	QueryTree(ctx context.Context, params schema.ProjCostItemQueryParam) (int, schema.ProjCostItemShows, error)
	// 查询数据
	Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCostItem) (*schema.ProjCostItem, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCostItem) (*schema.ProjCostItem, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 刷新项目成本项
	Renew(ctx context.Context, projectID string) error
}
