package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetFactoryBuildingDB 厂房管理
func GetFactoryBuildingDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, FactoryBuilding{})
}

// SchemaFactoryBuilding 厂房管理
type SchemaFactoryBuilding schema.FactoryBuilding

// ToFactoryBuilding 转换为厂房管理实体
func (a SchemaFactoryBuilding) ToFactoryBuilding() *FactoryBuilding {
	item := &FactoryBuilding{
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

// FactoryBuilding 厂房管理实体
type FactoryBuilding struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 厂房号
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a FactoryBuilding) String() string {
	return toString(a)
}

// TableName 表名
func (a FactoryBuilding) TableName() string {
	return a.Model.TableName("factory_building")
}

// ToSchemaFactoryBuilding 转换为厂房管理对象
func (a FactoryBuilding) ToSchemaFactoryBuilding() *schema.FactoryBuilding {
	item := &schema.FactoryBuilding{
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

// FactoryBuildings 厂房管理列表
type FactoryBuildings []*FactoryBuilding

// ToSchemaFactoryBuildings 转换为厂房管理对象列表
func (a FactoryBuildings) ToSchemaFactoryBuildings() []*schema.FactoryBuilding {
	list := make([]*schema.FactoryBuilding, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaFactoryBuilding()
	}
	return list
}
