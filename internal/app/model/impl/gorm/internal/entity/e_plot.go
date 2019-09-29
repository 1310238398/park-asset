package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetPlotDB 地块管理
func GetPlotDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Plot{})
}

// SchemaPlot 地块管理
type SchemaPlot schema.Plot

// ToPlot 转换为地块管理实体
func (a SchemaPlot) ToPlot() *Plot {
	item := &Plot{
		RecordID: &a.RecordID,
		Name:     &a.Name,
		Location: &a.Location,
		Address:  &a.Address,
		Photo:    &a.Photo,
		Memo:     &a.Memo,
		Creator:  &a.Creator,
	}
	return item
}

// Plot 地块管理实体
type Plot struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name     *string `gorm:"column:name;size:200;index;"`     // 地块名称
	Location *string `gorm:"column:location;size:1024;"`      // 位置(经纬度以逗号分隔)
	Address  *string `gorm:"column:address;size:1024;"`       // 地址
	Photo    *string `gorm:"column:photo;size:2048;"`         // 照片(JSON)
	Memo     *string `gorm:"column:memo;size:1024;"`          // 备注
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a Plot) String() string {
	return toString(a)
}

// TableName 表名
func (a Plot) TableName() string {
	return a.Model.TableName("plot")
}

// ToSchemaPlot 转换为地块管理对象
func (a Plot) ToSchemaPlot() *schema.Plot {
	item := &schema.Plot{
		RecordID: *a.RecordID,
		Name:     *a.Name,
		Location: *a.Location,
		Address:  *a.Address,
		Photo:    *a.Photo,
		Memo:     *a.Memo,
		Creator:  *a.Creator,
	}
	return item
}

// Plots 地块管理列表
type Plots []*Plot

// ToSchemaPlots 转换为地块管理对象列表
func (a Plots) ToSchemaPlots() []*schema.Plot {
	list := make([]*schema.Plot, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaPlot()
	}
	return list
}
