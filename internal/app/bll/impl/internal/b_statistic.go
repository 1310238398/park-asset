package internal

import (
	"bytes"
	"context"
	"gxt-park-assets/internal/app/config"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/pkg/minio"
	"io"

	"github.com/tealeg/xlsx"

	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
)

// NewStatistic 创建统计查询
func NewStatistic(
	mStatistic model.IStatistic,
	mOrganization model.IOrganization,
	mTAssetData model.ITAssetData,
) *Statistic {
	return &Statistic{
		StatisticModel:    mStatistic,
		OrganizationModel: mOrganization,
		TAssetDataModel:   mTAssetData,
	}
}

// Statistic 统计查询业务逻辑
type Statistic struct {
	StatisticModel    model.IStatistic
	OrganizationModel model.IOrganization
	TAssetDataModel   model.ITAssetData
}

// QueryProject 查询项目统计数据
func (a *Statistic) QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error) {
	return a.StatisticModel.QueryProject(ctx, params, opts...)
}

// ExportProject 导出项目资产数据
func (a *Statistic) ExportProject(ctx context.Context, params schema.ProjectStatisticQueryParam) (*bytes.Buffer, error) {
	result, err := a.TAssetDataModel.Query(ctx, schema.TAssetDataQueryParam{
		LikeOrgName:     params.LikeOrgName,
		LikeProjectName: params.LikeProjectName,
		AssetType:       params.AssetType,
	})
	if err != nil {
		return nil, err
	}

	obj, err := minio.GetClient().Get(ctx, config.GetGlobalConfig().ExcelExport.ProjectTpl)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	io.Copy(buf, obj)

	f, err := xlsx.OpenBinary(buf.Bytes())
	if err != nil {
		return nil, errors.WithStack(err)
	}

	var preItem *schema.TAssetData
	for _, item := range result.Data {
		if item.AssetType < 1 || item.AssetType > 7 {
			continue
		}

		// 同一份合同只导出一次
		if preItem != nil && preItem.Code == item.Code {
			continue
		}

		var row *xlsx.Row
		switch item.AssetType {
		case 1:
			row = f.Sheets[0].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.BuildingName)
			row.AddCell().SetString(item.UnitName)
			row.AddCell().SetString(item.LayerName)
			row.AddCell().SetString(item.HouseName)
		case 2:
			row = f.Sheets[1].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.AssetName)
		case 3:
			row = f.Sheets[6].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.AssetName)
		case 4:
			row = f.Sheets[3].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.BuildingName)
			row.AddCell().SetString(item.UnitName)
			row.AddCell().SetString(item.LayerName)
			row.AddCell().SetString(item.HouseName)
		case 5:
			row = f.Sheets[2].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.BuildingName)
			row.AddCell().SetString(item.UnitName)
			row.AddCell().SetString(item.LayerName)
			row.AddCell().SetString(item.HouseName)
		case 6:
			row = f.Sheets[4].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.AssetName)
		case 7:
			row = f.Sheets[5].AddRow()
			row.AddCell().SetString(item.OrgName)
			row.AddCell().SetString(item.ProjectName)
			row.AddCell().SetString(item.AssetName)
		}

		row.AddCell().SetString(item.BuildingArea)
		row.AddCell().SetString(item.RentArea)
		row.AddCell().SetString(item.SigningStatus)
		row.AddCell().SetString(item.Code)
		row.AddCell().SetString(item.LeaseStart)
		row.AddCell().SetString(item.LeaseEnd)
		row.AddCell().SetString(item.Period)
		row.AddCell().SetString(item.DayRent)
		row.AddCell().SetString(item.MonthRent)
		row.AddCell().SetString(item.PaymentCycle)
		row.AddCell().SetString(item.AdvancePayment)
		row.AddCell().SetString(item.RentFreeStart + "-" + item.RentFreeEnd)
		row.AddCell().SetString(item.DepositDueAmount)
		row.AddCell().SetString(item.DepositActualAmount)
		row.AddCell().SetString(item.SigningDate)
		row.AddCell().SetString(item.CustomerName)
		row.AddCell().SetString(item.CustomerContactName)
		row.AddCell().SetString(item.CustomerContactTel)
		row.AddCell().SetString(item.CustomerContactAddress)
		row.AddCell().SetString(item.CustomerContactEmail)

		rentCycle := params.RentCycle
		if len(rentCycle) == 0 {
			continue
		}

		if len(rentCycle) > 1 {
			citem := *item

			item.QuarterY201901 = "0"
			item.QuarterS201901 = "0"
			item.QuarterY201902 = "0"
			item.QuarterS201902 = "0"
			item.QuarterY201903 = "0"
			item.QuarterS201903 = "0"
			item.QuarterY201904 = "0"
			item.QuarterS201904 = "0"

			item.QuarterY202001 = "0"
			item.QuarterS202001 = "0"
			item.QuarterY202002 = "0"
			item.QuarterS202002 = "0"
			item.QuarterY202003 = "0"
			item.QuarterS202003 = "0"
			item.QuarterY202004 = "0"
			item.QuarterS202004 = "0"
			switch rentCycle[1] {
			case 1:
				item.QuarterY201901 = citem.QuarterY201901
				item.QuarterS201901 = citem.QuarterS201901
				item.QuarterY202001 = citem.QuarterY202001
				item.QuarterS202001 = citem.QuarterS202001
			case 2:
				item.QuarterY201902 = citem.QuarterY201902
				item.QuarterS201902 = citem.QuarterS201902
				item.QuarterY202002 = citem.QuarterY202002
				item.QuarterS202002 = citem.QuarterS202002
			case 3:
				item.QuarterY201903 = citem.QuarterY201903
				item.QuarterS201903 = citem.QuarterS201903
				item.QuarterY202003 = citem.QuarterY202003
				item.QuarterS202003 = citem.QuarterS202003
			case 4:
				item.QuarterY201904 = citem.QuarterY201904
				item.QuarterS201904 = citem.QuarterS201904
				item.QuarterY202004 = citem.QuarterY202004
				item.QuarterS202004 = citem.QuarterS202004
			}
		}

		if rentCycle[0] == 2019 {
			row.AddCell().SetString(item.QuarterY201901)
			row.AddCell().SetString(item.QuarterS201901)
			row.AddCell().SetString(item.QuarterY201902)
			row.AddCell().SetString(item.QuarterS201902)
			row.AddCell().SetString(item.QuarterY201903)
			row.AddCell().SetString(item.QuarterS201903)
			row.AddCell().SetString(item.QuarterY201904)
			row.AddCell().SetString(item.QuarterS201904)
		} else {
			row.AddCell().SetString(item.QuarterY202001)
			row.AddCell().SetString(item.QuarterS202001)
			row.AddCell().SetString(item.QuarterY202002)
			row.AddCell().SetString(item.QuarterS202002)
			row.AddCell().SetString(item.QuarterY202003)
			row.AddCell().SetString(item.QuarterS202003)
			row.AddCell().SetString(item.QuarterY202004)
			row.AddCell().SetString(item.QuarterS202004)
		}

		preItem = item
	}

	nbuf := new(bytes.Buffer)
	err = f.Write(nbuf)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	return nbuf, nil
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
