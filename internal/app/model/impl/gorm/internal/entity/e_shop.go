package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetShopDB 商铺管理
func GetShopDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, Shop{})
}

// SchemaShop 商铺管理
type SchemaShop schema.Shop

// ToShop 转换为商铺管理实体
func (a SchemaShop) ToShop() *Shop {
	item := &Shop{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		Name:         &a.Name,
		Business:     &a.Business,
		BuildingArea: &a.BuildingArea,
		RentArea:     &a.RentArea,
		RentStatus:   &a.RentStatus,
		ParentID:     &a.ParentID,
		ParentPath:   &a.ParentPath,
		Creator:      &a.Creator,
	}
	return item
}

// Shop 商铺管理实体
type Shop struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 商铺号
	Business     *string `gorm:"column:business;size:50;index;"`   // 业态
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a Shop) String() string {
	return toString(a)
}

// TableName 表名
func (a Shop) TableName() string {
	return a.Model.TableName("shop")
}

// ToSchemaShop 转换为商铺管理对象
func (a Shop) ToSchemaShop() *schema.Shop {
	item := &schema.Shop{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		Name:         *a.Name,
		Business:     *a.Business,
		BuildingArea: *a.BuildingArea,
		RentArea:     *a.RentArea,
		RentStatus:   *a.RentStatus,
		ParentID:     *a.ParentID,
		ParentPath:   *a.ParentPath,
		Creator:      *a.Creator,
	}
	return item
}

// Shops 商铺管理列表
type Shops []*Shop

// ToSchemaShops 转换为商铺管理对象列表
func (a Shops) ToSchemaShops() []*schema.Shop {
	list := make([]*schema.Shop, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaShop()
	}
	return list
}
