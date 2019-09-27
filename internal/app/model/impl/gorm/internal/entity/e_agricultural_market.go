package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetAgriculturalMarketDB 农贸市场管理
func GetAgriculturalMarketDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, AgriculturalMarket{})
}

// SchemaAgriculturalMarket 农贸市场管理
type SchemaAgriculturalMarket schema.AgriculturalMarket

// ToAgriculturalMarket 转换为农贸市场管理实体
func (a SchemaAgriculturalMarket) ToAgriculturalMarket() *AgriculturalMarket {
	item := &AgriculturalMarket{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		Name:         &a.Name,
		BuildingArea: &a.BuildingArea,
		RentArea:     &a.RentArea,
		RentStatus:   &a.RentStatus,
		ParentID:     &a.ParentID,
		ParentPath:   &a.ParentPath,
		Creator:      &a.Creator,
	}
	return item
}

// AgriculturalMarket 农贸市场管理实体
type AgriculturalMarket struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 摊位号
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a AgriculturalMarket) String() string {
	return toString(a)
}

// TableName 表名
func (a AgriculturalMarket) TableName() string {
	return a.Model.TableName("agricultural_market")
}

// ToSchemaAgriculturalMarket 转换为农贸市场管理对象
func (a AgriculturalMarket) ToSchemaAgriculturalMarket() *schema.AgriculturalMarket {
	item := &schema.AgriculturalMarket{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		Name:         *a.Name,
		BuildingArea: *a.BuildingArea,
		RentArea:     *a.RentArea,
		RentStatus:   *a.RentStatus,
		ParentID:     *a.ParentID,
		ParentPath:   *a.ParentPath,
		Creator:      *a.Creator,
	}
	return item
}

// AgriculturalMarkets 农贸市场管理列表
type AgriculturalMarkets []*AgriculturalMarket

// ToSchemaAgriculturalMarkets 转换为农贸市场管理对象列表
func (a AgriculturalMarkets) ToSchemaAgriculturalMarkets() []*schema.AgriculturalMarket {
	list := make([]*schema.AgriculturalMarket, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAgriculturalMarket()
	}
	return list
}
