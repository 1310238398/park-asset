package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/jinzhu/gorm"
)

// GetProjSalesPlanDB 项目销售计划
func GetProjSalesPlanDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjSalesPlan{})
}

// SchemaProjSalesPlan 项目销售计划
type SchemaProjSalesPlan schema.ProjSalesPlan

// ToProjSalesPlan 转换为项目销售计划实体
func (a SchemaProjSalesPlan) ToProjSalesPlan() *ProjSalesPlan {
	item := &ProjSalesPlan{
		RecordID:       &a.RecordID,
		ProjectID:      &a.ProjectID,
		Memo:           &a.Memo,
		Year:           &a.Year,
		Quarter:        &a.Quarter,
		SaleArea:       &a.SaleArea,
		ContractAmount: &a.ContractAmount,
		Payback:        &a.Payback,
		TaxPrice:       &a.TaxPrice,
		AveragePrice:   &a.AveragePrice,
		Principal:      &a.Principal,
		ProjIncomeID:   &a.ProjIncomeID,
		ProjBusinessID: &a.ProjBusinessID,
	}
	return item
}

// ProjSalesPlan 项目销售计划实体
type ProjSalesPlan struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`            // 记录ID
	ProjectID      *string  `gorm:"column:project_id;size:36;index;"`           // 成本项目ID
	Memo           *string  `gorm:"column:memo;size:1024;"`                     // 备注
	Year           *int     `gorm:"column:year;index;"`                         // 年度
	Quarter        *int     `gorm:"column:quarter;index;"`                      // 季度
	SaleArea       *float64 `gorm:"column:sale_area;type:decimal(20,4);"`       // 销售面积
	ContractAmount *float64 `gorm:"column:contract_amount;type:decimal(20,4);"` // 合同额度
	Payback        *float64 `gorm:"column:payback;type:decimal(20,4);"`         // 销售回款
	TaxPrice       *float64 `gorm:"column:tax_price;type:decimal(20,4);"`       // 销售税额
	AveragePrice   *float64 `gorm:"column:average_price;type:decimal(20,4);"`   // 均价
	Principal      *string  `gorm:"column:principal;size:200;index;"`           // 负责人
	ProjIncomeID   *string  `gorm:"column:proj_income_id;size:36;index;"`       // 项目收益测算ID
	ProjBusinessID *string  `gorm:"column:proj_business_id;size:36;index;"`     // 项目业态ID
}

func (a ProjSalesPlan) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjSalesPlan) TableName() string {
	return a.CostModel.TableName("proj_sales_plan")
}

// ToSchemaProjSalesPlan 转换为项目销售计划对象
func (a ProjSalesPlan) ToSchemaProjSalesPlan() *schema.ProjSalesPlan {
	item := &schema.ProjSalesPlan{
		RecordID:       *a.RecordID,
		ProjectID:      *a.ProjectID,
		Memo:           *a.Memo,
		Year:           *a.Year,
		Quarter:        *a.Quarter,
		SaleArea:       *a.SaleArea,
		ContractAmount: util.DecimalFloat64(*a.ContractAmount),
		Payback:        *a.Payback,
		TaxPrice:       util.DecimalFloat64(*a.TaxPrice),
		AveragePrice:   util.DecimalFloat64(*a.AveragePrice),
		Principal:      *a.Principal,
		ProjIncomeID:   *a.ProjIncomeID,
		ProjBusinessID: *a.ProjBusinessID,
	}
	return item
}

// ProjSalesPlans 项目销售计划列表
type ProjSalesPlans []*ProjSalesPlan

// ToSchemaProjSalesPlans 转换为项目销售计划对象列表
func (a ProjSalesPlans) ToSchemaProjSalesPlans() []*schema.ProjSalesPlan {
	list := make([]*schema.ProjSalesPlan, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjSalesPlan()
	}
	return list
}
