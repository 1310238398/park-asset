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
	// 获取项目当前收益测算数据
	GetCurrent(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error)
	// 获取上个版本的收益测算
	GetLast(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error)
	// 获取前一个版本的收益测算
	GetBeforeLast(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error)
	// 获取项目最终收益测算数据
	GetFinish(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjIncomeCalculation) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjIncomeCalculation) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
