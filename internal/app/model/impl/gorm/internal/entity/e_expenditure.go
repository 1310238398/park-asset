package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetExpenditureDB 支出节点
func GetExpenditureDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, Expenditure{})
}

// SchemaExpenditure 支出节点
type SchemaExpenditure schema.Expenditure

// ToExpenditure 转换为支出节点实体
func (a SchemaExpenditure) ToExpenditure() *Expenditure {
	item := &Expenditure{
		RecordID: &a.RecordID,
		Name:     &a.Name,
		Category: &a.Category,
	}
	return item
}

// Expenditure 支出节点实体
type Expenditure struct {
	CostModel
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name     *string `gorm:"column:name;size:200;index;"`     // 支出节点名称
	Category *string `gorm:"column:category;size:200;index;"` // 工作类别(大纲 里程碑 一级 二级)
}

func (a Expenditure) String() string {
	return toString(a)
}

// TableName 表名
func (a Expenditure) TableName() string {
	return a.CostModel.TableName("expenditure")
}

// ToSchemaExpenditure 转换为支出节点对象
func (a Expenditure) ToSchemaExpenditure() *schema.Expenditure {
	item := &schema.Expenditure{
		RecordID: *a.RecordID,
		Name:     *a.Name,
		Category: *a.Category,
	}
	return item
}

// Expenditures 支出节点列表
type Expenditures []*Expenditure

// ToSchemaExpenditures 转换为支出节点对象列表
func (a Expenditures) ToSchemaExpenditures() []*schema.Expenditure {
	list := make([]*schema.Expenditure, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaExpenditure()
	}
	return list
}
