package bll

import (
	"bytes"
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IStatistic 统计查询业务逻辑接口
type IStatistic interface {
	// 查询项目统计数据
	QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error)
	// 导出项目资产数据
	ExportProject(ctx context.Context, params schema.ProjectStatisticQueryParam) (*bytes.Buffer, error)
	// 查询各分类收入
	QueryIncomeClassification(ctx context.Context, params schema.IncomeClassificationStatisticQueryParam) ([]*schema.IncomeClassificationStatistic, error)
	// 查询运营指标
	QueryOperationalIndicator(ctx context.Context, params schema.OperationalIndicatorStatisticQueryParam) (*schema.OperationalIndicatorStatistic, error)
	// 查询概览
	QueryOverview(ctx context.Context, params schema.OverviewStatisticQueryParam) (*schema.OverviewStatistic, error)
	// 季度财务指标统计
	QueryQuarterFinanciallIndicator(ctx context.Context, params schema.QuarterFinanciallIndicatorStatisticQueryParam) (*schema.QuarterFinanciallIndicatorStatistic, error)
	// 财务指标统计
	QueryFinanciallIndicator(ctx context.Context, params schema.FinanciallIndicatorStatisticQueryParam) ([]*schema.FinanciallIndicatorStatistic, error)
}
