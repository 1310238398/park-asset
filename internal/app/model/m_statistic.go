package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IStatistic 统计查询存储接口
type IStatistic interface {
	// 查询项目统计数据
	QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error)

	// 查询收入分类占比统计数据
	QueryIncomeClassification(ctx context.Context, params schema.IncomeClassificationStatisticQueryParam, opts ...schema.IncomeClassificationStatisticQueryOptions) (*schema.IncomeClassificationStatisticQueryResult, error)
}
