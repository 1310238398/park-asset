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
	// 获取合同数
	GetContractNum(ctx context.Context, params schema.GetContractNumQueryParam) (int, error)
	// 获取企业数
	GetEnterpriseNum(ctx context.Context, params schema.GetEnterpriseNumQueryParam) (int, error)
	// 获取商家数
	GetMerchantNum(ctx context.Context, params schema.GetMerchantNumQueryParam) (int, error)
	// 获取项目数
	GetProjectNum(ctx context.Context, params schema.GetProjectNumQueryParam) (int, error)
	// 获取收入统计
	GetIncome(ctx context.Context, params schema.GetIncomeStatisticQueryParam) (*schema.GetIncomeStatisticResult, error)
	// 获取面积统计
	GetArea(ctx context.Context, params schema.GetAreaStatisticQueryParam) (*schema.GetAreaStatisticResult, error)
}
