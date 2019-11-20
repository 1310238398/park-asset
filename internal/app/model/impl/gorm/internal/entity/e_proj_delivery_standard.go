package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjDeliveryStandardDB 成本项目交付标准
func GetProjDeliveryStandardDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjDeliveryStandard{})
}

// SchemaProjDeliveryStandard 成本项目交付标准
type SchemaProjDeliveryStandard schema.ProjDeliveryStandard

// ToProjDeliveryStandard 转换为成本项目交付标准实体
func (a SchemaProjDeliveryStandard) ToProjDeliveryStandard() *ProjDeliveryStandard {
	item := &ProjDeliveryStandard{
		RecordID:   &a.RecordID,
		ProjectID:  &a.ProjectID,
		Content:    &a.Content,
		Part:       &a.Part,
		ParentID:   &a.ParentID,
		ParentPath: &a.ParentPath,
	}
	return item
}

// ProjDeliveryStandard 成本项目交付标准实体
type ProjDeliveryStandard struct {
	CostModel
	RecordID   *string `gorm:"column:record_id;size:36;index;"`    // 记录ID
	ProjectID  *string `gorm:"column:project_id;size:36;index;"`   // 成本项目ID
	Content    *string `gorm:"column:content;size:1024;"`          // 交付标准内容
	Part       *string `gorm:"column:part;size:200;"`              // 建筑部位
	ParentID   *string `gorm:"column:parent_id;size:36;index;"`    // 父级ID
	ParentPath *string `gorm:"column:parent_path;size:518;index;"` // 父级路经
}

func (a ProjDeliveryStandard) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjDeliveryStandard) TableName() string {
	return a.CostModel.TableName("proj_delivery_standard")
}

// ToSchemaProjDeliveryStandard 转换为成本项目交付标准对象
func (a ProjDeliveryStandard) ToSchemaProjDeliveryStandard() *schema.ProjDeliveryStandard {
	item := &schema.ProjDeliveryStandard{
		RecordID:   *a.RecordID,
		ProjectID:  *a.ProjectID,
		Content:    *a.Content,
		Part:       *a.Part,
		ParentID:   *a.ParentID,
		ParentPath: *a.ParentPath,
	}
	return item
}

// ProjDeliveryStandards 成本项目交付标准列表
type ProjDeliveryStandards []*ProjDeliveryStandard

// ToSchemaProjDeliveryStandards 转换为成本项目交付标准对象列表
func (a ProjDeliveryStandards) ToSchemaProjDeliveryStandards() []*schema.ProjDeliveryStandard {
	list := make([]*schema.ProjDeliveryStandard, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjDeliveryStandard()
	}
	return list
}
