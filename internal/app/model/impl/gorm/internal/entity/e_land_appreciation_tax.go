package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetLandAppreciationTaxDB 土地增值税
func GetLandAppreciationTaxDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, LandAppreciationTax{})
}

// SchemaLandAppreciationTax 土地增值税
type SchemaLandAppreciationTax schema.LandAppreciationTax

// ToLandAppreciationTax 转换为土地增值税实体
func (a SchemaLandAppreciationTax) ToLandAppreciationTax() *LandAppreciationTax {
	item := &LandAppreciationTax{
		// RecordID:        &a.RecordID,
		// SaledArea:       &a.SaledArea,
		// ValueAdded:      &a.ValueAdded,
		// ValueAddedRate:  &a.ValueAddedRate,
		// Tax:             &a.Tax,
		// SaledWithoutTax: &a.SaledWithoutTax,
	}
	return item
}

// LandAppreciationTax 土地增值税实体
type LandAppreciationTax struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`             // 记录ID
	ProjectID      *string  `gorm:"column:project_id;size:36;index;"`            // 项目ID
	Income         *float64 `gorm:"column:"income;type:decimal(20,4);"`          // 不含税销售收入
	Cost           *float64 `gorm:"column:cost;type:decimal(20,4);"`             // 扣除项金额
	AdditionalTax  *float64 `gorm:"column:additional_tax;type:decimal(20,4);"`   // 附加税
	FinanceAddRate *float64 `gorm:"column:finance_add_rate;type:decimal(20,4);"` // 财务费用附加率
	ManageAddRate  *float64 `gorm:"column:manage_add_rate;type:decimal(20,4);"`  // 管理费用附加率
	CostAddRate    *float64 `gorm:"column:cost_add_rate;type:decimal(20,4);"`    // 成本附加率
	Rate           *float64 `gorm:"column:rate;type:decimal(20,4);"`             // 适用税率
	Tax            *float64 `gorm:"column:tax;type:decimal(20,4);"`              // 土地增值税
}

func (a LandAppreciationTax) String() string {
	return toString(a)
}

// TableName 表名
func (a LandAppreciationTax) TableName() string {
	return a.CostModel.TableName("land_appreciation_tax")
}

// ToSchemaLandAppreciationTax 转换为土地增值税对象
func (a LandAppreciationTax) ToSchemaLandAppreciationTax() *schema.LandAppreciationTax {
	item := &schema.LandAppreciationTax{
		// RecordID:        *a.RecordID,
		// SaledArea:       *a.SaledArea,
		// ValueAdded:      *a.ValueAdded,
		// ValueAddedRate:  *a.ValueAddedRate,
		// Tax:             *a.Tax,
		// SaledWithoutTax: *a.SaledWithoutTax,
	}
	return item
}

// LandAppreciationTaxes 土地增值税列表
type LandAppreciationTaxes []*LandAppreciationTax

// ToSchemaLandAppreciationTaxes 转换为土地增值税对象列表
func (a LandAppreciationTaxes) ToSchemaLandAppreciationTaxes() []*schema.LandAppreciationTax {
	list := make([]*schema.LandAppreciationTax, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaLandAppreciationTax()
	}
	return list
}
