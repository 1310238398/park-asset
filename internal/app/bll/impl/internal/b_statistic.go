package internal

import (
	"bytes"
	"context"
	"gxt-park-assets/internal/app/config"
	"gxt-park-assets/pkg/minio"
	"io"

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

// ExportProject 导出项目资产数据
func (a *Statistic) ExportProject(ctx context.Context, params schema.ProjectStatisticQueryParam) (*bytes.Buffer, error) {
	obj, err := minio.GetClient().Get(ctx, config.GetGlobalConfig().ExcelExport.ProjectTpl)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	io.Copy(buf, obj)

	return buf, nil
}

// QueryIncomeClassification 查询各分类收入
func (a *Statistic) QueryIncomeClassification(ctx context.Context, params schema.IncomeClassificationStatisticQueryParam) ([]*schema.IncomeClassificationStatistic, error) {
	var items []*schema.IncomeClassificationStatistic
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "写字楼",
		ActualAmount:  10000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "商铺",
		ActualAmount:  9000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "酒店",
		ActualAmount:  5000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "公寓",
		ActualAmount:  4000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "农贸市场",
		ActualAmount:  3000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "车改商",
		ActualAmount:  2000000000,
	})
	items = append(items, &schema.IncomeClassificationStatistic{
		AssetTypeName: "厂房",
		ActualAmount:  7000000000,
	})

	return items, nil
}

// QueryOperationalIndicator 查询运营指标
func (a *Statistic) QueryOperationalIndicator(ctx context.Context, params schema.OperationalIndicatorStatisticQueryParam) (*schema.OperationalIndicatorStatistic, error) {
	item := &schema.OperationalIndicatorStatistic{
		ContractNum:                    30000,
		ThisMonthAddContractNum:        1000,
		ThisMonthWithdrawalContractNum: 200,
		ThisMonthRenewContractNum:      300,
		EnterpriseNum:                  5000,
		MerchantNum:                    3000,
	}

	return item, nil
}

// QueryOverview 查询概览统计
func (a *Statistic) QueryOverview(ctx context.Context, params schema.OverviewStatisticQueryParam) (*schema.OverviewStatistic, error) {
	item := &schema.OverviewStatistic{
		AnnualPlanIncome:   100 * 10000 * 10000 * 100,
		AnnualActualIncome: 90 * 10000 * 10000 * 100,
		ProjectNum:         500,
		BuildingArea:       100 * 10000 * 100,
		RentArea:           95 * 10000 * 100,
		RentedArea:         80 * 10000 * 100,
	}

	return item, nil
}
