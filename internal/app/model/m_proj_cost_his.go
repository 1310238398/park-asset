package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCostHis 项目成本项历史存储接口
type IProjCostHis interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCostHisQueryParam, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHisQueryResult, error)
	// 查询展示数据
	QueryShow(ctx context.Context, params schema.ProjCostHisQueryParam, opts ...schema.ProjCostItemQueryOptions) (schema.ProjCostItemShows, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHis, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCostHis) error
	// 批量创建数据
	CreateList(ctx context.Context, list []*schema.ProjCostHis) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCostHis) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
