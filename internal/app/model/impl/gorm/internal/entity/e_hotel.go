package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetHotelDB 酒店管理
func GetHotelDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Hotel{})
}

// SchemaHotel 酒店管理
type SchemaHotel schema.Hotel

// ToHotel 转换为酒店管理实体
func (a SchemaHotel) ToHotel() *Hotel {
	item := &Hotel{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		Name:         &a.Name,
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

// Hotel 酒店管理实体
type Hotel struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	Name         *string `gorm:"column:name;size:200;index;"`      // 建筑名称
	BuildingType *int    `gorm:"column:building_type;index;"`      // 建筑类型: 1:楼栋 2:单元 3:楼层 4:门牌
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;"`              // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a Hotel) String() string {
	return toString(a)
}

// TableName 表名
func (a Hotel) TableName() string {
	return a.Model.TableName("hotel")
}

// ToSchemaHotel 转换为酒店管理对象
func (a Hotel) ToSchemaHotel() *schema.Hotel {
	item := &schema.Hotel{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		Name:         *a.Name,
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

// Hotels 酒店管理列表
type Hotels []*Hotel

// ToSchemaHotels 转换为酒店管理对象列表
func (a Hotels) ToSchemaHotels() []*schema.Hotel {
	list := make([]*schema.Hotel, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaHotel()
	}
	return list
}
