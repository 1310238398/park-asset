package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"time"

	"github.com/jinzhu/gorm"
)

// GetProjIncomeCalculationDB 项目收益测算
func GetProjIncomeCalculationDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjIncomeCalculation{})
}

// SchemaProjIncomeCalculation 项目收益测算
type SchemaProjIncomeCalculation schema.ProjIncomeCalculation

// ToProjIncomeCalculation 转换为项目收益测算实体
func (a SchemaProjIncomeCalculation) ToProjIncomeCalculation() *ProjIncomeCalculation {
	item := &ProjIncomeCalculation{
		RecordID:             &a.RecordID,
		VersionName:          &a.VersionName,
		Sequence:             &a.Sequence,
		TotalSale:            &a.TotalSale,
		SaledTax:             &a.SaledTax,
		TotalCost:            &a.TotalCost,
		LandTransferFee:      &a.LandTransferFee,
		NetProfit:            &a.NetProfit,
		PaybackRate:          &a.PaybackRate,
		Principal:            &a.Principal,
		DoneTime:             &a.DoneTime,
		ProjectID:            &a.ProjectID,
		DeedLandTax:          &a.DeedLandTax,
		CapitalizedInterest:  &a.CapitalizedInterest,
		Flag:                 &a.Flag,
		InputTax:             &a.InputTax,
		ValueAddTax:          &a.ValueAddTax,
		ValueAddTaxSurcharge: &a.ValueAddTaxSurcharge,
		LandValueAddedTax:    &a.LandValueAddedTax,
		CorporateIncomeTax:   &a.CorporateIncomeTax,
		ProfitBeforeTax:      &a.ProfitBeforeTax,
		ProfitBeforeTaxRate:  &a.ProfitBeforeTaxRate,
		NetProfitRate:        &a.NetProfitRate,
	}
	return item
}

// ProjIncomeCalculation 项目收益测算实体
type ProjIncomeCalculation struct {
	CostModel
	RecordID             *string    `gorm:"column:record_id;size:36;index;"`                    // 记录ID
	VersionName          *string    `gorm:"column:version_name;size:200;index;"`                // 版本名称
	Memo                 *string    `gorm:"column:memo;size:1024;"`                             // 备注
	Sequence             *int       `gorm:"column:sequence;index;"`                             // 排序值
	TotalSale            *float64   `gorm:"column:total_sale;type:decimal(20,4);"`              // 总销售收入
	SaledTax             *float64   `gorm:"column:saled_tax;type:decimal(20,4);"`               // 销售税税额
	TotalCost            *float64   `gorm:"column:total_cost;type:decimal(20,4);"`              // 开发总成本
	LandTransferFee      *float64   `gorm:"column:land_transfer_fee;type:decimal(20,4);"`       // 土地出让金
	NetProfit            *float64   `gorm:"column:net_profit;type:decimal(20,4);"`              // 项目净利润
	PaybackRate          *float64   `gorm:"column:payback_rate;type:decimal(20,4);"`            // 投资回报率
	Principal            *string    `gorm:"column:principal;size:200;index;"`                   // 负责人
	DoneTime             *time.Time `gorm:"column:done_time;size:200;index;"`                   // 生成时间
	ProjectID            *string    `gorm:"column:project_id;size:36;index;"`                   // 成本项目ID
	DeedLandTax          *float64   `gorm:"column:deed_land_tax;type:decimal(20,4);"`           // 契税及土地增值税
	CapitalizedInterest  *float64   `gorm:"column:capitalized_interest;type:decimal(20,4);"`    // 资本化利息
	Flag                 *int       `gorm:"column:flag;index;"`                                 // 标记(1:当前版本 2:历史版本 3:最终版本 4:目标成本 领导审核后 不得轻易修改)
	InputTax             *float64   `gorm:"column:input_tax;type:decimal(20,4);"`               // 进项税税额
	ValueAddTax          *float64   `gorm:"column:value_add_tax;type:decimal(20,4);"`           // 增值税额
	ValueAddTaxSurcharge *float64   `gorm:"column:value_add_tax_surcharge;type:decimal(20,4);"` // 增值税附加
	LandValueAddedTax    *float64   `gorm:"column:land_value_added_tax;type:decimal(20,4);"`    // 土地增值税
	CorporateIncomeTax   *float64   `gorm:"column:corporate_income_tax;type:decimal(20,4);"`    // 企业所得税
	ProfitBeforeTax      *float64   `gorm:"column:profit_before_tax;type:decimal(20,4);"`       // 税前利润
	ProfitBeforeTaxRate  *float64   `gorm:"column:profit_before_tax_rate;type:decimal(20,4);"`  // 税前利润率
	NetProfitRate        *float64   `gorm:"column:net_profit_rate;type:decimal(20,4);"`         // 净利润率
}

func (a ProjIncomeCalculation) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjIncomeCalculation) TableName() string {
	return a.CostModel.TableName("proj_income_calculation")
}

// ToSchemaProjIncomeCalculation 转换为项目收益测算对象
func (a ProjIncomeCalculation) ToSchemaProjIncomeCalculation() *schema.ProjIncomeCalculation {
	item := &schema.ProjIncomeCalculation{
		RecordID:             *a.RecordID,
		VersionName:          *a.VersionName,
		Sequence:             *a.Sequence,
		TotalSale:            *a.TotalSale,
		SaledTax:             *a.SaledTax,
		TotalCost:            *a.TotalCost,
		LandTransferFee:      *a.LandTransferFee,
		NetProfit:            *a.NetProfit,
		PaybackRate:          *a.PaybackRate,
		Principal:            *a.Principal,
		DoneTime:             *a.DoneTime,
		ProjectID:            *a.ProjectID,
		DeedLandTax:          *a.DeedLandTax,
		CapitalizedInterest:  *a.CapitalizedInterest,
		Flag:                 *a.Flag,
		InputTax:             *a.InputTax,
		ValueAddTax:          *a.ValueAddTax,
		ValueAddTaxSurcharge: *a.ValueAddTaxSurcharge,
		LandValueAddedTax:    *a.LandValueAddedTax,
		CorporateIncomeTax:   *a.CorporateIncomeTax,
		ProfitBeforeTax:      *a.ProfitBeforeTax,
		ProfitBeforeTaxRate:  *a.ProfitBeforeTaxRate,
		NetProfitRate:        *a.NetProfitRate,
	}
	return item
}

// ProjIncomeCalculations 项目收益测算列表
type ProjIncomeCalculations []*ProjIncomeCalculation

// ToSchemaProjIncomeCalculations 转换为项目收益测算对象列表
func (a ProjIncomeCalculations) ToSchemaProjIncomeCalculations() []*schema.ProjIncomeCalculation {
	list := make([]*schema.ProjIncomeCalculation, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjIncomeCalculation()
	}
	return list
}
