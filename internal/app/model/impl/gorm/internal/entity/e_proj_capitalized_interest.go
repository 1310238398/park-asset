package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjCapitalizedInterestDB 项目资本化利息测算
func GetProjCapitalizedInterestDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjCapitalizedInterest{})
}

// SchemaProjCapitalizedInterest 项目资本化利息测算
type SchemaProjCapitalizedInterest schema.ProjCapitalizedInterest

// ToProjCapitalizedInterest 转换为项目资本化利息测算实体
func (a SchemaProjCapitalizedInterest) ToProjCapitalizedInterest() *ProjCapitalizedInterest {
	item := &ProjCapitalizedInterest{
		RecordID:                   &a.RecordID,
		ProjectID:                  &a.ProjectID,
		Year:                       &a.Year,
		Quarter:                    &a.Quarter,
		SalesPayback:               &a.SalesPayback,
		CostExpenditure:            &a.CostExpenditure,
		TaxPayment:                 &a.TaxPayment,
		FundsOccupiedAmount:        &a.FundsOccupiedAmount,
		AccumulativeOccupancyFunds: &a.AccumulativeOccupancyFunds,
		FundPossessionCost:         &a.FundPossessionCost,
		Memo:                       &a.Memo,
		Principal:                  &a.Principal,
		ProjIncomeID:               &a.ProjIncomeID,
	}
	return item
}

// ProjCapitalizedInterest 项目资本化利息测算实体
type ProjCapitalizedInterest struct {
	CostModel
	RecordID                   *string  `gorm:"column:record_id;size:36;index;"`                         // 记录ID
	ProjectID                  *string  `gorm:"column:project_id;size:36;index;"`                        // 成本项目ID
	Year                       *int     `gorm:"column:year;index;"`                                      // 年度
	Quarter                    *int     `gorm:"column:quarter;index;"`                                   // 季度
	SalesPayback               *float64 `gorm:"column:sales_payback;type:decimal(20,4);"`                // 销售回款
	CostExpenditure            *float64 `gorm:"column:cost_expenditure;type:decimal(20,4);"`             // 成本支出
	TaxPayment                 *float64 `gorm:"column:tax_payment;type:decimal(20,4);"`                  // 税金缴纳
	FundsOccupiedAmount        *float64 `gorm:"column:funds_occupied_amount;type:decimal(20,4);"`        // 资本占用金额
	AccumulativeOccupancyFunds *float64 `gorm:"column:accumulative_occupancy_funds;type:decimal(20,4);"` // 累计占用金额
	FundPossessionCost         *float64 `gorm:"column:fund_possession_cost;type:decimal(20,4);"`         // 资金占用费
	Memo                       *string  `gorm:"column:memo;size:1024;"`                                  // 备注
	Principal                  *string  `gorm:"column:principal;size:200;index;"`                        // 负责人
	ProjIncomeID               *string  `gorm:"column:proj_income_id;size:36;index;"`                    // 项目收益测算ID
	TaxID                      *string  `gorm:"column:tax_id;size:36;index;"`                            // 税目ID
}

func (a ProjCapitalizedInterest) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjCapitalizedInterest) TableName() string {
	return a.CostModel.TableName("proj_capitalized_interest")
}

// ToSchemaProjCapitalizedInterest 转换为项目资本化利息测算对象
func (a ProjCapitalizedInterest) ToSchemaProjCapitalizedInterest() *schema.ProjCapitalizedInterest {
	item := &schema.ProjCapitalizedInterest{
		RecordID:                   *a.RecordID,
		ProjectID:                  *a.ProjectID,
		Year:                       *a.Year,
		Quarter:                    *a.Quarter,
		SalesPayback:               *a.SalesPayback,
		CostExpenditure:            *a.CostExpenditure,
		TaxPayment:                 *a.TaxPayment,
		FundsOccupiedAmount:        *a.FundsOccupiedAmount,
		AccumulativeOccupancyFunds: *a.AccumulativeOccupancyFunds,
		FundPossessionCost:         *a.FundPossessionCost,
		Memo:                       *a.Memo,
		Principal:                  *a.Principal,
		ProjIncomeID:               *a.ProjIncomeID,
	}
	return item
}

// ProjCapitalizedInterests 项目资本化利息测算列表
type ProjCapitalizedInterests []*ProjCapitalizedInterest

// ToSchemaProjCapitalizedInterests 转换为项目资本化利息测算对象列表
func (a ProjCapitalizedInterests) ToSchemaProjCapitalizedInterests() []*schema.ProjCapitalizedInterest {
	list := make([]*schema.ProjCapitalizedInterest, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjCapitalizedInterest()
	}
	return list
}
