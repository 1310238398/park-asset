package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IContractPlanningTemplate 合约规划模板存储接口
type IContractPlanningTemplate interface {
	// 查询数据
	Query(ctx context.Context, params schema.ContractPlanningTemplateQueryParam, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplateQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplate, error)
	// 创建数据
	Create(ctx context.Context, item schema.ContractPlanningTemplate) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ContractPlanningTemplate) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
