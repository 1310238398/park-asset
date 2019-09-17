package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetSystemParameterDB 系统参数管理
func GetSystemParameterDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, SystemParameter{})
}

// SchemaSystemParameter 系统参数管理
type SchemaSystemParameter schema.SystemParameter

// ToSystemParameter 转换为系统参数管理实体
func (a SchemaSystemParameter) ToSystemParameter() *SystemParameter {
	item := &SystemParameter{
		RecordID: &a.RecordID,
		Code:     &a.Code,
		Name:     &a.Name,
		Value:    &a.Value,
		Status:   &a.Status,
		Memo:     &a.Memo,
		Creator:  &a.Creator,
	}
	return item
}

// SystemParameter 系统参数管理实体
type SystemParameter struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Code     *string `gorm:"column:code;size:50;index;"`      // 参数编号
	Name     *string `gorm:"column:name;size:100;index;"`     // 参数名称
	Value    *string `gorm:"column:value;size:1024;"`         // 参数值
	Status   *int    `gorm:"column:status;index;"`            // 状态(1:启用 2:停用)
	Memo     *string `gorm:"column:memo;size:1024;"`          // 备注
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a SystemParameter) String() string {
	return toString(a)
}

// TableName 表名
func (a SystemParameter) TableName() string {
	return a.Model.TableName("system_parameter")
}

// ToSchemaSystemParameter 转换为系统参数管理对象
func (a SystemParameter) ToSchemaSystemParameter() *schema.SystemParameter {
	item := &schema.SystemParameter{
		RecordID: *a.RecordID,
		Code:     *a.Code,
		Name:     *a.Name,
		Value:    *a.Value,
		Status:   *a.Status,
		Memo:     *a.Memo,
		Creator:  *a.Creator,
	}
	return item
}

// SystemParameters 系统参数管理列表
type SystemParameters []*SystemParameter

// ToSchemaSystemParameters 转换为系统参数管理对象列表
func (a SystemParameters) ToSchemaSystemParameters() []*schema.SystemParameter {
	list := make([]*schema.SystemParameter, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaSystemParameter()
	}
	return list
}
