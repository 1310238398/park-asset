package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetTaxCalculationDB 税目计算表
func GetTaxCalculationDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, TaxCalculation{})
}

// SchemaTaxCalculation 税目计算表
type SchemaTaxCalculation schema.TaxCalculation

// ToTaxCalculation 转换为税目计算表实体
func (a SchemaTaxCalculation) ToTaxCalculation() *TaxCalculation {
	item := &TaxCalculation{
		RecordID:           &a.RecordID,
		Category:           &a.Category,
		Name:               &a.Name,
		CalculationFormula: &a.CalculationFormula,
		Type:               &a.Type,
		TaxRate:            &a.TaxRate,
		Memo:               &a.Memo,
	}
	return item
}

// TaxCalculation 税目计算表实体
type TaxCalculation struct {
	CostModel
	RecordID           *string  `gorm:"column:record_id;size:36;index;"`      // 记录ID
	Category           *string  `gorm:"column:category;size:50;index;"`       // 类别
	Name               *string  `gorm:"column:name;size:200;index;"`          // 税目名称
	CalculationFormula *string  `gorm:"column:calculation_formula;size:200;"` // 计算公式
	Type               *int     `gorm:"column:type;index;"`                   // 税率类型(1:含税计算 2:不含税计算)
	TaxRate            *float64 `gorm:"column:tax_rate; type:decimal(20,4)"`  // 税率
	Memo               *string  `gorm:"column:memo;size:1024;"`               // 备注
}

func (a TaxCalculation) String() string {
	return toString(a)
}

// TableName 表名
func (a TaxCalculation) TableName() string {
	return a.CostModel.TableName("tax_calculation")
}

// ToSchemaTaxCalculation 转换为税目计算表对象
func (a TaxCalculation) ToSchemaTaxCalculation() *schema.TaxCalculation {
	item := &schema.TaxCalculation{
		RecordID:           *a.RecordID,
		Category:           *a.Category,
		Name:               *a.Name,
		CalculationFormula: *a.CalculationFormula,
		Type:               *a.Type,
		TaxRate:            *a.TaxRate,
		Memo:               *a.Memo,
	}
	return item
}

// TaxCalculations 税目计算表列表
type TaxCalculations []*TaxCalculation

// ToSchemaTaxCalculations 转换为税目计算表对象列表
func (a TaxCalculations) ToSchemaTaxCalculations() []*schema.TaxCalculation {
	list := make([]*schema.TaxCalculation, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaTaxCalculation()
	}
	return list
}
