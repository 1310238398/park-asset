package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ICostItem 成本项存储接口
type ICostItem interface {
	// 查询数据
	Query(ctx context.Context, params schema.CostItemQueryParam, opts ...schema.CostItemQueryOptions) (*schema.CostItemQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.CostItemQueryOptions) (*schema.CostItem, error)
	// 创建数据
	Create(ctx context.Context, item schema.CostItem) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.CostItem) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
