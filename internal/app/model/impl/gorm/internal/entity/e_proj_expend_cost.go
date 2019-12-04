package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjExpendCostDB 项目支出节点成本项
func GetProjExpendCostDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjExpendCost{})
}

// SchemaProjExpendCost 项目支出节点成本项
type SchemaProjExpendCost schema.ProjExpendCost

// ToProjExpendCost 转换为项目支出节点成本项实体
func (a SchemaProjExpendCost) ToProjExpendCost() *ProjExpendCost {
	item := &ProjExpendCost{
		RecordID:          &a.RecordID,
		ProjCostID:        &a.ProjCostID,
		ProjExpenditureID: &a.ProjExpenditureID,
		Amount:            &a.Amount,
		CostPrice:         &a.CostPrice,
	}
	return item
}

// ProjExpendCost 项目支出节点成本项实体
type ProjExpendCost struct {
	CostModel
	RecordID          *string  `gorm:"column:record_id;size:36;index;"`           // 记录ID
	ProjCostID        *string  `gorm:"column:proj_cost_id;size:36;index;"`        // 项目成本项ID
	ProjExpenditureID *string  `gorm:"column:proj_expenditure_id;size:36;index;"` // 项目支出节点ID
	Amount            *float64 `gorm:"column:amount;type:decimal(20.4)" `         // 成本项支出金额
	CostPrice         *float64 `gorm:"column:cost_price;type:decimal(20.4)"`      // 成本项价格

}

func (a ProjExpendCost) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjExpendCost) TableName() string {
	return a.CostModel.TableName("proj_expend_cost")
}

// ToSchemaProjExpendCost 转换为项目支出节点成本项对象
func (a ProjExpendCost) ToSchemaProjExpendCost() *schema.ProjExpendCost {
	item := &schema.ProjExpendCost{
		RecordID:          *a.RecordID,
		ProjCostID:        *a.ProjCostID,
		ProjExpenditureID: *a.ProjExpenditureID,
		Amount:            *a.Amount,
		CostPrice:         *a.CostPrice,
	}
	return item
}

// ProjExpendCosts 项目支出节点成本项列表
type ProjExpendCosts []*ProjExpendCost

// ToSchemaProjExpendCosts 转换为项目支出节点成本项对象列表
func (a ProjExpendCosts) ToSchemaProjExpendCosts() []*schema.ProjExpendCost {
	list := make([]*schema.ProjExpendCost, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjExpendCost()
	}
	return list
}
