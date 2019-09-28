package internal

import (
	"context"

	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
)

// NewStatistic 创建统计查询
func NewStatistic(mStatistic model.IStatistic) *Statistic {
	return &Statistic{
		StatisticModel: mStatistic,
	}
}

// Statistic 统计查询业务逻辑
type Statistic struct {
	StatisticModel model.IStatistic
}

// QueryProject 查询项目统计数据
func (a *Statistic) QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error) {
	var items []*schema.ProjectStatistic
	items = append(items, &schema.ProjectStatistic{
		OrgID:         "",
		OrgName:       "智慧谷置业公司",
		ProjectID:     "",
		ProjectName:   "汉峪金谷",
		AssetType:     1,
		RentArea:      100000000,
		RentedArea:    90000000,
		PaymentAmount: 100000000,
		ActualAmount:  90000000,
	})
	result := &schema.ProjectStatisticQueryResult{
		Data: items,
		PageResult: &schema.PaginationResult{
			Total: 1,
		},
	}
	return result, nil
}
