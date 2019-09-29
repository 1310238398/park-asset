package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IStatistic 统计查询存储接口
type IStatistic interface {
	// 查询数据
	Query(ctx context.Context, params schema.StatisticQueryParam, opts ...schema.StatisticQueryOptions) (*schema.StatisticQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.StatisticQueryOptions) (*schema.Statistic, error)
	// 创建数据
	Create(ctx context.Context, item schema.Statistic) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Statistic) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
