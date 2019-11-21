package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjIncomeCalculation 项目收益测算存储接口
type IProjIncomeCalculation interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjIncomeCalculationQueryParam, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculationQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculation, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjIncomeCalculation) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjIncomeCalculation) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}