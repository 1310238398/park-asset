package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjCostHisDB 项目成本项历史
func GetProjCostHisDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjCostHis{})
}

// SchemaProjCostHis 项目成本项历史
type SchemaProjCostHis schema.ProjCostHis

// ToProjCostHis 转换为项目成本项历史实体
func (a SchemaProjCostHis) ToProjCostHis() *ProjCostHis {
	item := &ProjCostHis{
		RecordID:       &a.RecordID,
		CostID:         &a.CostID,
		ProjectID:      &a.ProjectID,
		TaxRate:        &a.TaxRate,
		TaxPrice:       &a.TaxPrice,
		Price:          &a.Price,
		Memo:           &a.Memo,
		Principal:      &a.Principal,
		ProjIncomeID:   &a.ProjIncomeID,
		CostParentID:   &a.CostParentID,
		CostParentPath: &a.CostParentPath,
	}
	return item
}

// ProjCostHis 项目成本项历史实体
type ProjCostHis struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`      // 记录ID
	CostID         *string  `gorm:"column:cost_id;size:36;index;"`        // 成本项ID
	ProjectID      *string  `gorm:"column:project_id;size:36;index;"`     // 项目ID
	TaxID          *string  `gorm:"column:tax_id;size:36"`                // 税目ID
	TaxRate        *float64 `gorm:"column:tax_rate;index;"`               // 税率
	TaxPrice       *float64 `gorm:"column:tax_price;type:decimal(20,4);"` // 缴税税额
	Price          *float64 `gorm:"column:price;type:decimal(20,4);"`     // 价格
	Memo           *string  `gorm:"column:memo;size:1024;"`               // 备注
	Principal      *string  `gorm:"column:principal;size:200;index;"`     // 负责人
	ProjIncomeID   *string  `gorm:"column:proj_income_id;size:36;index;"` // 项目收益测算ID
	CostParentID   *string  `gorm:"column:parent_id;size:36;index;"`      // 父级ID
	CostParentPath *string  `gorm:"column:parent_path;size:518;index;"`   // 父级路径
	Label          *int     `gorm:"column:label"`                         // 标签(1:成本科目 2:测算科目)
	BusinessData   *string  `gorm:"column:business_data;size:1024"`       //业态数据
}

func (a ProjCostHis) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjCostHis) TableName() string {
	return a.CostModel.TableName("proj_cost_his")
}

// ToSchemaProjCostHis 转换为项目成本项历史对象
func (a ProjCostHis) ToSchemaProjCostHis() *schema.ProjCostHis {
	item := &schema.ProjCostHis{
		RecordID:       *a.RecordID,
		CostID:         *a.CostID,
		ProjectID:      *a.ProjectID,
		TaxRate:        *a.TaxRate,
		TaxPrice:       *a.TaxPrice,
		Price:          *a.Price,
		Memo:           *a.Memo,
		Principal:      *a.Principal,
		ProjIncomeID:   *a.ProjIncomeID,
		CostParentID:   *a.CostParentID,
		CostParentPath: *a.CostParentPath,
	}
	return item
}

// ProjCostHises 项目成本项历史列表
type ProjCostHises []*ProjCostHis

// ToSchemaProjCostHises 转换为项目成本项历史对象列表
func (a ProjCostHises) ToSchemaProjCostHises() []*schema.ProjCostHis {
	list := make([]*schema.ProjCostHis, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjCostHis()
	}
	return list
}

// ToSchemaProjCostItem 转换为项目成本项对象
func (a ProjCostHis) ToSchemaProjCostItemShow() *schema.ProjCostItemShow {
	item := new(schema.ProjCostItemShow)
	item.RecordID = *a.RecordID
	item.ProjectID = *a.ProjectID
	item.ProjIncomeID = *a.ProjIncomeID
	item.CostID = *a.CostID
	item.CostParentID = *a.CostParentID
	item.CostParentPath = *a.CostParentPath
	item.Label = *a.Label
	item.TaxID = *a.TaxID
	item.Price = *a.Price
	item.TaxPrice = *a.TaxPrice
	item.TaxRate = *a.TaxRate

	return item
}

// ToSchemaProjCostItemShows 转换为项目成本项对象列表
func (a ProjCostHises) ToSchemaProjCostItemShows() schema.ProjCostItemShows {
	list := make([]*schema.ProjCostItemShow, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjCostItemShow()
	}
	return list
}
