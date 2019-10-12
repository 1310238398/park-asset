package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetApartmentDB 公寓管理
func GetApartmentDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Apartment{})
}

// SchemaApartment 公寓管理
type SchemaApartment schema.Apartment

// ToApartment 转换为公寓管理实体
func (a SchemaApartment) ToApartment() *Apartment {
	item := &Apartment{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		Name:         &a.Name,
		IsAllRent:    &a.IsAllRent,
		UnitNum:      &a.UnitNum,
		UnitNaming:   &a.UnitNaming,
		LayerNum:     &a.LayerNum,
		LayerNaming:  &a.LayerNaming,
		BuildingType: &a.BuildingType,
		BuildingArea: &a.BuildingArea,
		RentArea:     &a.RentArea,
		RentStatus:   &a.RentStatus,
		ParentID:     &a.ParentID,
		ParentPath:   &a.ParentPath,
		Creator:      &a.Creator,
	}
	return item
}

// Apartment 公寓管理实体
type Apartment struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 建筑名称
	IsAllRent    *int    `gorm:"column:is_all_rent;index;"`        // 是否全部出租:(1是 2否)
	UnitNum      *int    `gorm:"column:unit_num;"`                 // 单元数
	UnitNaming   *string `gorm:"column:unit_naming;size:50;"`      // 单元命名规则
	LayerNum     *int    `gorm:"column:layer_num;"`                // 层数
	LayerNaming  *string `gorm:"column:layer_naming;size:50;"`     // 层命名规则
	BuildingType *int    `gorm:"column:building_type;index;"`      // 建筑类型: 1:楼栋 2:单元 3:楼层 4:门牌
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a Apartment) String() string {
	return toString(a)
}

// TableName 表名
func (a Apartment) TableName() string {
	return a.Model.TableName("apartment")
}

// ToSchemaApartment 转换为公寓管理对象
func (a Apartment) ToSchemaApartment() *schema.Apartment {
	item := &schema.Apartment{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		Name:         *a.Name,
		IsAllRent:    *a.IsAllRent,
		UnitNum:      *a.UnitNum,
		UnitNaming:   *a.UnitNaming,
		LayerNum:     *a.LayerNum,
		LayerNaming:  *a.LayerNaming,
		BuildingType: *a.BuildingType,
		BuildingArea: *a.BuildingArea,
		RentArea:     *a.RentArea,
		RentStatus:   *a.RentStatus,
		ParentID:     *a.ParentID,
		ParentPath:   *a.ParentPath,
		Creator:      *a.Creator,
	}
	return item
}

// Apartments 公寓管理列表
type Apartments []*Apartment

// ToSchemaApartments 转换为公寓管理对象列表
func (a Apartments) ToSchemaApartments() []*schema.Apartment {
	list := make([]*schema.Apartment, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaApartment()
	}
	return list
}
