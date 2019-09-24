package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetOfficeBuildingDB 写字楼管理
func GetOfficeBuildingDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, OfficeBuilding{})
}

// SchemaOfficeBuilding 写字楼管理
type SchemaOfficeBuilding schema.OfficeBuilding

// ToOfficeBuilding 转换为写字楼管理实体
func (a SchemaOfficeBuilding) ToOfficeBuilding() *OfficeBuilding {
	item := &OfficeBuilding{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		Name:         &a.Name,
		BuildingType: &a.BuildingType,
		IsAllRent:    &a.IsAllRent,
		UnitNum:      &a.UnitNum,
		UnitNaming:   &a.UnitNaming,
		LayerNum:     &a.LayerNum,
		LayerNaming:  &a.LayerNaming,
		RentArea:     &a.RentArea,
		Decoration:   &a.Decoration,
		RentStatus:   &a.RentStatus,
		LockReason:   &a.LockReason,
		ParentID:     &a.ParentID,
		ParentPath:   &a.ParentPath,
		Creator:      &a.Creator,
	}
	return item
}

// OfficeBuilding 写字楼管理实体
type OfficeBuilding struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 建筑名称
	BuildingType *int    `gorm:"column:building_type;index;"`      // 建筑类型: 1:楼栋 2:单元 3:楼层 4:门牌
	IsAllRent    *int    `gorm:"column:is_all_rent;index;"`        // 是否全部出租:(1是 2否)
	UnitNum      *int    `gorm:"column:unit_num;"`                 // 单元数
	UnitNaming   *string `gorm:"column:unit_naming;size:50;"`      // 单元命名规则
	LayerNum     *int    `gorm:"column:layer_num;"`                // 层数
	LayerNaming  *string `gorm:"column:layer_naming;size:50;"`     // 层命名规则
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	Decoration   *int    `gorm:"column:decoration;"`               // 装修情况
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	LockReason   *string `gorm:"column:lock_reason;size:200;"`     // 锁定原因
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a OfficeBuilding) String() string {
	return toString(a)
}

// TableName 表名
func (a OfficeBuilding) TableName() string {
	return a.Model.TableName("office_building")
}

// ToSchemaOfficeBuilding 转换为写字楼管理对象
func (a OfficeBuilding) ToSchemaOfficeBuilding() *schema.OfficeBuilding {
	item := &schema.OfficeBuilding{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		Name:         *a.Name,
		BuildingType: *a.BuildingType,
		IsAllRent:    *a.IsAllRent,
		UnitNum:      *a.UnitNum,
		UnitNaming:   *a.UnitNaming,
		LayerNum:     *a.LayerNum,
		LayerNaming:  *a.LayerNaming,
		RentArea:     *a.RentArea,
		Decoration:   *a.Decoration,
		RentStatus:   *a.RentStatus,
		LockReason:   *a.LockReason,
		ParentID:     *a.ParentID,
		ParentPath:   *a.ParentPath,
		Creator:      *a.Creator,
	}
	return item
}

// OfficeBuildings 写字楼管理列表
type OfficeBuildings []*OfficeBuilding

// ToSchemaOfficeBuildings 转换为写字楼管理对象列表
func (a OfficeBuildings) ToSchemaOfficeBuildings() []*schema.OfficeBuilding {
	list := make([]*schema.OfficeBuilding, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaOfficeBuilding()
	}
	return list
}
