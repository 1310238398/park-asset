package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCostItem 项目成本项存储接口
type IProjCostItem interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCostItem) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCostItem) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
