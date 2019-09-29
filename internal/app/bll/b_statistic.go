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
}
