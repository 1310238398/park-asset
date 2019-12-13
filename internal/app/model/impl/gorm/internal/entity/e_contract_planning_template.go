package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetContractPlanningTemplateDB 合约规划模板
func GetContractPlanningTemplateDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ContractPlanningTemplate{})
}

// SchemaContractPlanningTemplate 合约规划模板
type SchemaContractPlanningTemplate schema.ContractPlanningTemplate

// ToContractPlanningTemplate 转换为合约规划模板实体
func (a SchemaContractPlanningTemplate) ToContractPlanningTemplate() *ContractPlanningTemplate {
	item := &ContractPlanningTemplate{
		RecordID:     &a.RecordID,
		Name:         &a.Name,
		CostID:       &a.CostID,
		ContractType: &a.ContractType,
		Information:  &a.Information,
	}
	return item
}

// ContractPlanningTemplate 合约规划模板实体
type ContractPlanningTemplate struct {
	CostModel
	RecordID     *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name         *string `gorm:"column:name;size:100;index;"`     // 合同名称
	CostID       *string `gorm:"column:cost_id;size:36;index;"`   // 成本项ID
	ContractType *int    `gorm:"column:contract_type;index;"`     // 合同类型
	Information  *string `gorm:"column:information;size:200;"`    // 合同内容
}

func (a ContractPlanningTemplate) String() string {
	return toString(a)
}

// TableName 表名
func (a ContractPlanningTemplate) TableName() string {
	return a.CostModel.TableName("contract_planning_template")
}

// ToSchemaContractPlanningTemplate 转换为合约规划模板对象
func (a ContractPlanningTemplate) ToSchemaContractPlanningTemplate() *schema.ContractPlanningTemplate {
	item := &schema.ContractPlanningTemplate{
		RecordID:     *a.RecordID,
		Name:         *a.Name,
		CostID:       *a.CostID,
		ContractType: *a.ContractType,
		Information:  *a.Information,
	}
	return item
}

// ContractPlanningTemplates 合约规划模板列表
type ContractPlanningTemplates []*ContractPlanningTemplate

// ToSchemaContractPlanningTemplates 转换为合约规划模板对象列表
func (a ContractPlanningTemplates) ToSchemaContractPlanningTemplates() []*schema.ContractPlanningTemplate {
	list := make([]*schema.ContractPlanningTemplate, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaContractPlanningTemplate()
	}
	return list
}
