package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjContractPlanning 项目合约规划存储接口
type IProjContractPlanning interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjContractPlanningQueryParam, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanningQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanning, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjContractPlanning) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjContractPlanning) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
