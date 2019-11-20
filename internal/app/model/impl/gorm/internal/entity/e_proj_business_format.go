package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjBusinessFormatDB 项目业态
func GetProjBusinessFormatDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjBusinessFormat{})
}

// SchemaProjBusinessFormat 项目业态
type SchemaProjBusinessFormat schema.ProjBusinessFormat

// ToProjBusinessFormat 转换为项目业态实体
func (a SchemaProjBusinessFormat) ToProjBusinessFormat() *ProjBusinessFormat {
	item := &ProjBusinessFormat{
		RecordID:         &a.RecordID,
		ProjectID:        &a.ProjectID,
		BusinessFormatID: &a.BusinessFormatID,
		FloorArea:        &a.FloorArea,
	}
	return item
}

// ProjBusinessFormat 项目业态实体
type ProjBusinessFormat struct {
	CostModel
	RecordID         *string  `gorm:"column:record_id;size:36;index;"`          // 记录ID
	ProjectID        *string  `gorm:"column:project_id;size:36;index;"`         // 成本项目ID
	BusinessFormatID *string  `gorm:"column:business_format_id;size:36;index;"` // 业态ID
	FloorArea        *float64 `gorm:"column:floor_area;type:decimal(20,4);"`    // 建筑面积
}

func (a ProjBusinessFormat) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjBusinessFormat) TableName() string {
	return a.CostModel.TableName("proj_business_format")
}

// ToSchemaProjBusinessFormat 转换为项目业态对象
func (a ProjBusinessFormat) ToSchemaProjBusinessFormat() *schema.ProjBusinessFormat {
	item := &schema.ProjBusinessFormat{
		RecordID:         *a.RecordID,
		ProjectID:        *a.ProjectID,
		BusinessFormatID: *a.BusinessFormatID,
		FloorArea:        *a.FloorArea,
	}
	return item
}

// ProjBusinessFormats 项目业态列表
type ProjBusinessFormats []*ProjBusinessFormat

// ToSchemaProjBusinessFormats 转换为项目业态对象列表
func (a ProjBusinessFormats) ToSchemaProjBusinessFormats() []*schema.ProjBusinessFormat {
	list := make([]*schema.ProjBusinessFormat, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjBusinessFormat()
	}
	return list
}
