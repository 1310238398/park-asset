package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetCostItemDB 成本项
func GetCostItemDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, CostItem{})
}

// SchemaCostItem 成本项
type SchemaCostItem schema.CostItem

// ToCostItem 转换为成本项实体
func (a SchemaCostItem) ToCostItem() *CostItem {
	item := &CostItem{
		RecordID:      &a.RecordID,
		ParentID:      &a.ParentID,
		ParentPath:    &a.ParentPath,
		Level:         &a.Level,
		Name:          &a.Name,
		TaxID:         &a.TaxID,
		Status:        &a.Status,
		Label:         &a.Label,
		CalculateType: &a.CalculateType,
		InLandTax:     &a.InLandTax,
	}
	return item
}

// CostItem 成本项实体
type CostItem struct {
	CostModel
	RecordID      *string `gorm:"column:record_id;size:36;index;"`    // 记录ID
	ParentID      *string `gorm:"column:parent_id;size:36;index;"`    // 父级ID
	ParentPath    *string `gorm:"column:parent_path;size:518;index;"` // 父级路经
	Level         *int    `gorm:"column:level;index;"`                // 层级
	Name          *string `gorm:"column:name;size:200;index;"`        // 业态名称
	TaxID         *string `gorm:"column:tax_id;size:36;index;"`       // 税目ID
	Status        *int    `gorm:"column:status;index;"`               // 状态(1:启用2:停用)
	Label         *int    `gorm:"column:label;index;"`                // 标签(1:成本科目 2:测算科目)
	CalculateType *int    `gorm:"column:calculate_type"`              //计算方式(1.单价算总价,2.总价算单价)
	InLandTax     *int    `gorm:"column:in_land_tax"`                 //是否计入土地增值税(1.计入,2.不计入)
}

func (a CostItem) String() string {
	return toString(a)
}

// TableName 表名
func (a CostItem) TableName() string {
	return a.CostModel.TableName("cost_item")
}

// ToSchemaCostItem 转换为成本项对象
func (a CostItem) ToSchemaCostItem() *schema.CostItem {
	item := &schema.CostItem{
		RecordID:      *a.RecordID,
		ParentID:      *a.ParentID,
		ParentPath:    *a.ParentPath,
		Level:         *a.Level,
		Name:          *a.Name,
		TaxID:         *a.TaxID,
		Status:        *a.Status,
		Label:         *a.Label,
		CalculateType: *a.CalculateType,
		InLandTax:     *a.InLandTax,
	}
	return item
}

// CostItems 成本项列表
type CostItems []*CostItem

// ToSchemaCostItems 转换为成本项对象列表
func (a CostItems) ToSchemaCostItems() []*schema.CostItem {
	list := make([]*schema.CostItem, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaCostItem()
	}
	return list
}
