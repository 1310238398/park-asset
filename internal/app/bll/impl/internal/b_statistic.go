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
		ThisMonthAddContractNum:        0,
		ThisMonthWithdrawalContractNum: 0,
		ThisMonthRenewContractNum:      0,
	}

	var orgName string
	if v := params.OrgID; v != "" {
		name, err := a.getOrgName(ctx, v)
		if err != nil {
			return nil, err
		}
		orgName = name
	}

	contractNum, err := a.StatisticModel.GetContractNum(ctx, schema.GetContractNumQueryParam{
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	}
	item.ContractNum = contractNum

	enterpriseNum, err := a.StatisticModel.GetEnterpriseNum(ctx, schema.GetEnterpriseNumQueryParam{
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	}
	item.EnterpriseNum = enterpriseNum

	merchantNum, err := a.StatisticModel.GetMerchantNum(ctx, schema.GetMerchantNumQueryParam{
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	}
	item.MerchantNum = merchantNum

	return item, nil
}

// QueryOverview 查询概览统计
func (a *Statistic) QueryOverview(ctx context.Context, params schema.OverviewStatisticQueryParam) (*schema.OverviewStatistic, error) {
	item := &schema.OverviewStatistic{
		BuildingArea: 0,
	}

	var orgName string
	if v := params.OrgID; v != "" {
		name, err := a.getOrgName(ctx, v)
		if err != nil {
			return nil, err
		}
		orgName = name
	}

	projectNum, err := a.StatisticModel.GetProjectNum(ctx, schema.GetProjectNumQueryParam{
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	}
	item.ProjectNum = projectNum

	income, err := a.StatisticModel.GetIncome(ctx, schema.GetIncomeStatisticQueryParam{
		Year:    params.Year,
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	} else if income != nil {
		item.AnnualPlanIncome = income.PlanIncome
		item.AnnualActualIncome = income.ActualIncome
	}

	area, err := a.StatisticModel.GetArea(ctx, schema.GetAreaStatisticQueryParam{
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	} else if area != nil {
		item.RentArea = area.RentArea
		item.RentedArea = area.RentedArea
	}

	return item, nil
}

// QueryQuarterFinanciallIndicator 季度财务指标统计
func (a *Statistic) QueryQuarterFinanciallIndicator(ctx context.Context, params schema.QuarterFinanciallIndicatorStatisticQueryParam) (*schema.QuarterFinanciallIndicatorStatistic, error) {
	item := &schema.QuarterFinanciallIndicatorStatistic{}

	var orgName string
	if v := params.OrgID; v != "" {
		name, err := a.getOrgName(ctx, v)
		if err != nil {
			return nil, err
		}
		orgName = name
	}

	income, err := a.StatisticModel.GetIncome(ctx, schema.GetIncomeStatisticQueryParam{
		Year:    params.Year,
		Quarter: params.Quarter,
		OrgName: orgName,
	})
	if err != nil {
		return nil, err
	} else if income != nil {
		item.PlanIncome = income.PlanIncome
		item.ActualIncome = income.ActualIncome
	}

	return item, nil
}

// QueryFinanciallIndicator 财务指标统计
func (a *Statistic) QueryFinanciallIndicator(ctx context.Context, params schema.FinanciallIndicatorStatisticQueryParam) ([]*schema.FinanciallIndicatorStatistic, error) {
	var items []*schema.FinanciallIndicatorStatistic

	var orgName string
	if v := params.OrgID; v != "" {
		name, err := a.getOrgName(ctx, v)
		if err != nil {
			return nil, err
		}
		orgName = name
	}

	for i := 1; i <= 4; i++ {
		income, err := a.StatisticModel.GetIncome(ctx, schema.GetIncomeStatisticQueryParam{
			Year:    params.Year,
			Quarter: i,
			OrgName: orgName,
		})
		if err != nil {
			return nil, err
		} else if income != nil {
			items = append(items, &schema.FinanciallIndicatorStatistic{
				PaymentType: 1,
				Quarter:     i,
				Amount:      income.PlanIncome,
			})
			items = append(items, &schema.FinanciallIndicatorStatistic{
				PaymentType: 2,
				Quarter:     i,
				Amount:      income.ActualIncome,
			})
		}
	}

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
		sitem := &schema.CompanyStatistic{
			OrgID:   item.RecordID,
			OrgName: item.Name,
		}

		income, err := a.StatisticModel.GetIncome(ctx, schema.GetIncomeStatisticQueryParam{
			Year:    params.Year,
			OrgName: item.Name,
		})
		if err != nil {
			return nil, err
		} else if income != nil {
			sitem.PlanIncome = income.PlanIncome
			sitem.ActualIncome = income.ActualIncome
		}

		items = append(items, sitem)
	}

	return items, nil
}
