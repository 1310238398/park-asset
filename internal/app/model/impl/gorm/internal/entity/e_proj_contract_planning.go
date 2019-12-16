package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/jinzhu/gorm"
)

// GetProjContractPlanningDB 项目合约规划
func GetProjContractPlanningDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjContractPlanning{})
}

// SchemaProjContractPlanning 项目合约规划
type SchemaProjContractPlanning schema.ProjContractPlanning

// ToProjContractPlanning 转换为项目合约规划实体
func (a SchemaProjContractPlanning) ToProjContractPlanning() *ProjContractPlanning {
	item := &ProjContractPlanning{
		RecordID:       &a.RecordID,
		Name:           &a.Name,
		ProjectID:      &a.ProjectID,
		CostID:         &a.CostID,
		ContractType:   &a.ContractType,
		Information:    &a.Information,
		PlanningPrice:  &a.PlanningPrice,
		PlanningChange: &a.PlanningChange,
		Memo:           &a.Memo,
	}
	return item
}

// ProjContractPlanning 项目合约规划实体
type ProjContractPlanning struct {
	CostModel
	RecordID       *string  `gorm:"column:record_id;size:36;index;"`            // 记录ID
	Name           *string  `gorm:"column:name;size:100;index;"`                // 合同名称
	ProjectID      *string  `gorm:"column:project_id;size:36;index;"`           // 项目ID
	CostID         *string  `gorm:"column:cost_id;size:36;index;"`              // 成本项ID
	ContractType   *int     `gorm:"column:contract_type;index;"`                // 合同类型
	Information    *string  `gorm:"column:information;size:200;"`               // 合同包内容
	PlanningPrice  *float64 `gorm:"column:planning_price;type:decimal(20,4);"`  // 规划金额
	PlanningChange *float64 `gorm:"column:planning_change;type:decimal(20,4);"` // 预计变更金额
	Memo           *string  `gorm:"column:memo;size:200;"`                      // 备注
}

func (a ProjContractPlanning) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjContractPlanning) TableName() string {
	return a.CostModel.TableName("proj_contract_planning")
}

// ToSchemaProjContractPlanning 转换为项目合约规划对象
func (a ProjContractPlanning) ToSchemaProjContractPlanning() *schema.ProjContractPlanning {
	item := &schema.ProjContractPlanning{
		RecordID:       *a.RecordID,
		Name:           *a.Name,
		ProjectID:      *a.ProjectID,
		CostID:         *a.CostID,
		ContractType:   *a.ContractType,
		Information:    *a.Information,
		PlanningPrice:  util.DecimalFloat64(*a.PlanningPrice),
		PlanningChange: util.DecimalFloat64(*a.PlanningChange),
		Memo:           *a.Memo,
	}
	return item
}

// ProjContractPlannings 项目合约规划列表
type ProjContractPlannings []*ProjContractPlanning

// ToSchemaProjContractPlannings 转换为项目合约规划对象列表
func (a ProjContractPlannings) ToSchemaProjContractPlannings() []*schema.ProjContractPlanning {
	list := make([]*schema.ProjContractPlanning, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjContractPlanning()
	}
	return list
}
