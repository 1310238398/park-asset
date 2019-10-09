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
