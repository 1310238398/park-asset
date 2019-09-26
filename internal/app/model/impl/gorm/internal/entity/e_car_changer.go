package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetCarChangerDB 车改商管理
func GetCarChangerDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, CarChanger{})
}

// SchemaCarChanger 车改商管理
type SchemaCarChanger schema.CarChanger

// ToCarChanger 转换为车改商管理实体
func (a SchemaCarChanger) ToCarChanger() *CarChanger {
	item := &CarChanger{
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

// CarChanger 车改商管理实体
type CarChanger struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 车位号
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a CarChanger) String() string {
	return toString(a)
}

// TableName 表名
func (a CarChanger) TableName() string {
	return a.Model.TableName("car_changer")
}

// ToSchemaCarChanger 转换为车改商管理对象
func (a CarChanger) ToSchemaCarChanger() *schema.CarChanger {
	item := &schema.CarChanger{
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

// CarChangers 车改商管理列表
type CarChangers []*CarChanger

// ToSchemaCarChangers 转换为车改商管理对象列表
func (a CarChangers) ToSchemaCarChangers() []*schema.CarChanger {
	list := make([]*schema.CarChanger, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaCarChanger()
	}
	return list
}
