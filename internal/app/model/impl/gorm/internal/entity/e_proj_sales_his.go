package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjSalesHisDB 项目销售计划历史
func GetProjSalesHisDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjSalesHis{})
}

// SchemaProjSalesHis 项目销售计划历史
type SchemaProjSalesHis schema.ProjSalesHis

// ToProjSalesHis 转换为项目销售计划历史实体
func (a SchemaProjSalesHis) ToProjSalesHis() *ProjSalesHis {
	item := &ProjSalesHis{
		RecordID:       &a.RecordID,
		ProjectID:      &a.ProjectID,
		Memo:           &a.Memo,
		Year:           &a.Year,
		Quarter:        &a.Quarter,
		SaleArea:       &a.SaleArea,
		ContractAmount: &a.ContractAmount,
		Payback:        &a.Payback,
		TaxPrise:       &a.TaxPrise,
		AveragePrise:   &a.AveragePrise,
		Principal:      &a.Principal,
		ProjIncomeID:   &a.ProjIncomeID,
		ProjBusinessID: &a.ProjBusinessID,
	}
	return item
}

// ProjSalesHis 项目销售计划历史实体
type ProjSalesHis struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`            // 记录ID
	ProjectID      *string  `gorm:"column:project_id;size:36;index;"`           // 成本项目ID
	Memo           *string  `gorm:"column:memo;size:1024;"`                     // 备注
	Year           *int     `gorm:"column:year;index;"`                         // 年度
	Quarter        *int     `gorm:"column:quarter;index;"`                      // 季度
	SaleArea       *float64 `gorm:"column:sale_area;type:decimal(20,4);"`       // 销售面积
	ContractAmount *float64 `gorm:"column:contract_amount;type:decimal(20,4);"` // 合同额度
	Payback        *float64 `gorm:"column:payback;type:decimal(20,4);"`         // 销售回款
	TaxPrise       *float64 `gorm:"column:tax_prise;type:decimal(20,4);"`       // 销售税额
	AveragePrise   *float64 `gorm:"column:average_prise;type:decimal(20,4);"`   // 均价
	Principal      *string  `gorm:"column:principal;size:200;index;"`           // 负责人
	ProjIncomeID   *string  `gorm:"column:proj_income_id;size:36;index;"`       // 项目收益测算ID
	ProjBusinessID *string  `gorm:"column:proj_business_id;size:36;index;"`     // 项目业态ID
}

func (a ProjSalesHis) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjSalesHis) TableName() string {
	return a.CostModel.TableName("proj_sales_his")
}

// ToSchemaProjSalesHis 转换为项目销售计划历史对象
func (a ProjSalesHis) ToSchemaProjSalesHis() *schema.ProjSalesHis {
	item := &schema.ProjSalesHis{
		RecordID:       *a.RecordID,
		ProjectID:      *a.ProjectID,
		Memo:           *a.Memo,
		Year:           *a.Year,
		Quarter:        *a.Quarter,
		SaleArea:       *a.SaleArea,
		ContractAmount: *a.ContractAmount,
		Payback:        *a.Payback,
		TaxPrise:       *a.TaxPrise,
		AveragePrise:   *a.AveragePrise,
		Principal:      *a.Principal,
		ProjIncomeID:   *a.ProjIncomeID,
		ProjBusinessID: *a.ProjBusinessID,
	}
	return item
}

// ProjSalesHises 项目销售计划历史列表
type ProjSalesHises []*ProjSalesHis

// ToSchemaProjSalesHises 转换为项目销售计划历史对象列表
func (a ProjSalesHises) ToSchemaProjSalesHises() []*schema.ProjSalesHis {
	list := make([]*schema.ProjSalesHis, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjSalesHis()
	}
	return list
}
