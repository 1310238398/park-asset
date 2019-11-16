package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjCostItemDB 项目成本项
func GetProjCostItemDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjCostItem{})
}

// SchemaProjCostItem 项目成本项
type SchemaProjCostItem schema.ProjCostItem

// ToProjCostItem 转换为项目成本项实体
func (a SchemaProjCostItem) ToProjCostItem() *ProjCostItem {
	item := &ProjCostItem{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		CostID:       &a.CostID,
		TaxRate:      &a.TaxRate,
		TaxPrise:     &a.TaxPrise,
		Prise:        &a.Prise,
		Memo:         &a.Memo,
		Principal:    &a.Principal,
		ProjIncomeID: &a.ProjIncomeID,
	}
	return item
}

// ProjCostItem 项目成本项实体
type ProjCostItem struct {
	CostModel
	RecordID     *string  `gorm:"column:record_id;size:36;index;"`      // 记录ID
	ProjectID    *string  `gorm:"column:project_id;size:36;index;"`     // 成本项目ID
	CostID       *string  `gorm:"column:cost_id;size:36;index;"`        // 成本项ID
	TaxRate      *float64 `gorm:"column:tax_rate;type:decimal(20,4);"`  // 税率
	TaxPrise     *float64 `gorm:"column:tax_prise;type:decimal(20,4);"` // 缴税税额
	Prise        *float64 `gorm:"column:prise;type:decimal(20,4);"`     // 成本项价格
	Memo         *string  `gorm:"column:memo;size:1024;"`               // 备注
	Principal    *string  `gorm:"column:principal;size:200;index;"`     // 负责人
	ProjIncomeID *string  `gorm:"column:proj_income_id;size:36;index;"` // 项目收益测算ID
}

func (a ProjCostItem) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjCostItem) TableName() string {
	return a.CostModel.TableName("proj_cost_item")
}

// ToSchemaProjCostItem 转换为项目成本项对象
func (a ProjCostItem) ToSchemaProjCostItem() *schema.ProjCostItem {
	item := &schema.ProjCostItem{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		CostID:       *a.CostID,
		TaxRate:      *a.TaxRate,
		TaxPrise:     *a.TaxPrise,
		Prise:        *a.Prise,
		Memo:         *a.Memo,
		Principal:    *a.Principal,
		ProjIncomeID: *a.ProjIncomeID,
	}
	return item
}

// ProjCostItems 项目成本项列表
type ProjCostItems []*ProjCostItem

// ToSchemaProjCostItems 转换为项目成本项对象列表
func (a ProjCostItems) ToSchemaProjCostItems() []*schema.ProjCostItem {
	list := make([]*schema.ProjCostItem, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjCostItem()
	}
	return list
}
