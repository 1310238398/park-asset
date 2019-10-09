package entity

import (
	"gxt-park-assets/internal/app/schema"
)

// ProjectStatistic 项目统计查询实体
type ProjectStatistic struct {
	OrgName       string `gorm:"column:org_name;"`
	ProjectName   string `gorm:"column:project_name;"`
	AssetType     int    `gorm:"column:asset_type;"`
	RentArea      int    `gorm:"column:rent_area;"`
	RentedArea    int    `gorm:"column:rented_area;"`
	PaymentAmount int    `gorm:"column:payment_amount;"`
	ActualAmount  int    `gorm:"column:actual_amount;"`
}

// ToSchemaProjectStatistic 转换为项目统计查询对象
func (a ProjectStatistic) ToSchemaProjectStatistic() *schema.ProjectStatistic {
	item := &schema.ProjectStatistic{
		OrgName:       a.OrgName,
		ProjectName:   a.ProjectName,
		AssetType:     a.AssetType,
		RentArea:      a.RentArea,
		RentedArea:    a.RentedArea,
		PaymentAmount: a.PaymentAmount,
		ActualAmount:  a.ActualAmount,
	}
	return item
}

// ProjectStatistics 项目统计查询列表
type ProjectStatistics []*ProjectStatistic

// ToSchemaProjectStatistics 转换为统计查询对象列表
func (a ProjectStatistics) ToSchemaProjectStatistics() []*schema.ProjectStatistic {
	list := make([]*schema.ProjectStatistic, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjectStatistic()
	}
	return list
}

// IncomeClassificationStatistic 收入分类占比统计查询实体
type IncomeClassificationStatistic struct {
	AssetType    int `gorm:"column:asset_type;"`
	ActualAmount int `gorm:"column:actual_amount;"`
}

// ToSchemaIncomeClassificationStatistic 转换为收入分类占比统计查询对象
func (a IncomeClassificationStatistic) ToSchemaIncomeClassificationStatistic() *schema.IncomeClassificationStatistic {
	item := &schema.IncomeClassificationStatistic{
		AssetType:    a.AssetType,
		ActualAmount: a.ActualAmount,
	}
	return item
}

// IncomeClassificationStatistics 收入分类占比统计查询列表
type IncomeClassificationStatistics []*IncomeClassificationStatistic

// ToSchemaIncomeClassificationStatistics 转换为统计查询对象列表
func (a IncomeClassificationStatistics) ToSchemaIncomeClassificationStatistics() []*schema.IncomeClassificationStatistic {
	list := make([]*schema.IncomeClassificationStatistic, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaIncomeClassificationStatistic()
	}
	return list
}

// IncomeStatistic 收入统计
type IncomeStatistic struct {
	PaymentAmount int `gorm:"column:payment_amount;"`
	ActualAmount  int `gorm:"column:actual_amount;"`
}

// ToSchemaGetIncomeStatisticResult 转换为收入统计对象
func (a *IncomeStatistic) ToSchemaGetIncomeStatisticResult() *schema.GetIncomeStatisticResult {
	return &schema.GetIncomeStatisticResult{
		PlanIncome:   a.PaymentAmount,
		ActualIncome: a.ActualAmount,
	}
}

// AreaStatistic 面积统计
type AreaStatistic struct {
	RentArea   int `gorm:"column:rent_area;"`
	RentedArea int `gorm:"column:rented_area;"`
}

// ToSchemaGetAreaStatisticResult 转换为面积统计对象
func (a *AreaStatistic) ToSchemaGetAreaStatisticResult() *schema.GetAreaStatisticResult {
	return &schema.GetAreaStatisticResult{
		RentArea:   a.RentArea,
		RentedArea: a.RentedArea,
	}
}
