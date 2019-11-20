package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetCostBusinessDB 成本项业态
func GetCostBusinessDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, CostBusiness{})
}

// SchemaCostBusiness 成本项业态
type SchemaCostBusiness schema.CostBusiness

// ToCostBusiness 转换为成本项业态实体
func (a SchemaCostBusiness) ToCostBusiness() *CostBusiness {
	item := &CostBusiness{
		RecordID:   &a.RecordID,
		CostID:     &a.CostID,
		BusinessID: &a.BusinessID,
		UnitPrise:  &a.UnitPrise,
	}
	return item
}

// CostBusiness 成本项业态实体
type CostBusiness struct {
	CostModel
	RecordID   *string  `gorm:"column:record_id;size:36;index;"`       // 记录ID
	CostID     *string  `gorm:"column:cost_id;size:36;index;"`         // 成本项ID
	BusinessID *string  `gorm:"column:business_id;size:36;index;"`     // 业态ID
	UnitPrise  *float64 `gorm:"column:unit_prise;type:decimal(20,4);"` // 单价
}

func (a CostBusiness) String() string {
	return toString(a)
}

// TableName 表名
func (a CostBusiness) TableName() string {
	return a.CostModel.TableName("cost_business")
}

// ToSchemaCostBusiness 转换为成本项业态对象
func (a CostBusiness) ToSchemaCostBusiness() *schema.CostBusiness {
	item := &schema.CostBusiness{
		RecordID:   *a.RecordID,
		CostID:     *a.CostID,
		BusinessID: *a.BusinessID,
		UnitPrise:  *a.UnitPrise,
	}
	return item
}

// CostBusinesses 成本项业态列表
type CostBusinesses []*CostBusiness

// ToSchemaCostBusinesses 转换为成本项业态对象列表
func (a CostBusinesses) ToSchemaCostBusinesses() []*schema.CostBusiness {
	list := make([]*schema.CostBusiness, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaCostBusiness()
	}
	return list
}
