package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjExpendCost 项目支出节点成本项存储接口
type IProjExpendCost interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjExpendCostQueryParam, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCostQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCost, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjExpendCost) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjExpendCost) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
