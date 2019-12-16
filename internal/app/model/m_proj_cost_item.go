package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCostItem 项目成本项存储接口
type IProjCostItem interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error)
	//QueryShow 查询展示
	QueryShow(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (schema.ProjCostItemShows, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error)
	// 根据项目ID及成本项名称查询项目成本
	GetByProjectIDAndCostName(ctx context.Context, projectID, costName string) (*schema.ProjCostItem, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCostItem) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCostItem) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
