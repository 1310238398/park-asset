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
func NewStatistic(
	mStatistic model.IStatistic,
	mOrganization model.IOrganization,
) *Statistic {
	return &Statistic{
		StatisticModel:    mStatistic,
		OrganizationModel: mOrganization,
	}
}

// Statistic 统计查询业务逻辑
type Statistic struct {
	StatisticModel    model.IStatistic
	OrganizationModel model.IOrganization
}

// QueryProject 查询项目统计数据
func (a *Statistic) QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error) {
	return a.StatisticModel.QueryProject(ctx, params, opts...)
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

func (a *Statistic) getOrgName(ctx context.Context, orgID string) (string, error) {
	item, err := a.OrganizationModel.Get(ctx, orgID)
	if err != nil {
		return "", err
	} else if item == nil {
		return "", nil
	}
	return item.Name, nil
}

// QueryIncomeClassification 查询各分类收入
func (a *Statistic) QueryIncomeClassification(ctx context.Context, params schema.IncomeClassificationStatisticQueryParam) ([]*schema.IncomeClassificationStatistic, error) {
	if params.OrgID != "" {
		orgName, err := a.getOrgName(ctx, params.OrgID)
		if err != nil {
			return nil, err
		}
		params.OrgName = orgName
	}

	result, err := a.StatisticModel.QueryIncomeClassification(ctx, params)
	if err != nil {
		return nil, err
	}
	result.FillAssetTypeName()
	return result.Data, nil
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

// QueryQuarterFinanciallIndicator 季度财务指标统计
func (a *Statistic) QueryQuarterFinanciallIndicator(ctx context.Context, params schema.QuarterFinanciallIndicatorStatisticQueryParam) (*schema.QuarterFinanciallIndicatorStatistic, error) {
	item := &schema.QuarterFinanciallIndicatorStatistic{
		PlanIncome:   1000 * 10000 * 100,
		ActualIncome: 900 * 10000 * 100,
	}

	return item, nil
}

// QueryFinanciallIndicator 财务指标统计
func (a *Statistic) QueryFinanciallIndicator(ctx context.Context, params schema.FinanciallIndicatorStatisticQueryParam) ([]*schema.FinanciallIndicatorStatistic, error) {
	var items []*schema.FinanciallIndicatorStatistic
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 1,
		Quarter:     1,
		Amount:      1000 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 1,
		Quarter:     2,
		Amount:      2000 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 1,
		Quarter:     3,
		Amount:      3000 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 1,
		Quarter:     4,
		Amount:      4000 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 2,
		Quarter:     1,
		Amount:      600 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 2,
		Quarter:     2,
		Amount:      900 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 2,
		Quarter:     3,
		Amount:      1000 * 10000 * 100,
	})
	items = append(items, &schema.FinanciallIndicatorStatistic{
		PaymentType: 2,
		Quarter:     4,
		Amount:      1500 * 10000 * 100,
	})
	return items, nil
}

// QueryCompany 子公司统计
func (a *Statistic) QueryCompany(ctx context.Context, params schema.CompanyStatisticQueryParam) ([]*schema.CompanyStatistic, error) {
	var items []*schema.CompanyStatistic

	orgResult, err := a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
		OrgType: 2,
	})
	if err != nil {
		return nil, err
	}

	for _, item := range orgResult.Data {
		items = append(items, &schema.CompanyStatistic{
			OrgID:        item.RecordID,
			OrgName:      item.Name,
			PlanIncome:   1000 * 10000 * 100,
			ActualIncome: 900 * 10000 * 100,
		})
	}

	return items, nil
}
