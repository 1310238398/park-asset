package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjCostBusinessDB 项目成本项业态
func GetProjCostBusinessDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjCostBusiness{})
}

// SchemaProjCostBusiness 项目成本项业态
type SchemaProjCostBusiness schema.ProjCostBusiness

// ToProjCostBusiness 转换为项目成本项业态实体
func (a SchemaProjCostBusiness) ToProjCostBusiness() *ProjCostBusiness {
	item := &ProjCostBusiness{
		RecordID:       &a.RecordID,
		ProjBusinessID: &a.ProjBusinessID,
		ProjCostID:     &a.ProjCostID,
		UnitPrice:      &a.UnitPrice,
	}
	return item
}

// ProjCostBusiness 项目成本项业态实体
type ProjCostBusiness struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`        // 记录ID
	ProjBusinessID *string  `gorm:"column:proj_business_id;size:36;index;"` // 项目业态ID
	ProjCostID     *string  `gorm:"column:proj_cost_id;size:36;index;"`     // 项目成本项ID
	UnitPrice      *float64 `gorm:"column:unit_price;type:decimal(20,4);"`  // 单价
}

func (a ProjCostBusiness) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjCostBusiness) TableName() string {
	return a.CostModel.TableName("proj_cost_business")
}

// ToSchemaProjCostBusiness 转换为项目成本项业态对象
func (a ProjCostBusiness) ToSchemaProjCostBusiness() *schema.ProjCostBusiness {
	item := &schema.ProjCostBusiness{
		RecordID:       *a.RecordID,
		ProjBusinessID: *a.ProjBusinessID,
		ProjCostID:     *a.ProjCostID,
		UnitPrice:      *a.UnitPrice,
	}
	return item
}

// ProjCostBusinesses 项目成本项业态列表
type ProjCostBusinesses []*ProjCostBusiness

// ToSchemaProjCostBusinesses 转换为项目成本项业态对象列表
func (a ProjCostBusinesses) ToSchemaProjCostBusinesses() []*schema.ProjCostBusiness {
	list := make([]*schema.ProjCostBusiness, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjCostBusiness()
	}
	return list
}
