package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
	"time"
)

// GetAssetHistoryDB 资产历史管理
func GetAssetHistoryDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, AssetHistory{})
}

// SchemaAssetHistory 资产历史管理
type SchemaAssetHistory schema.AssetHistory

// ToAssetHistory 转换为资产历史管理实体
func (a SchemaAssetHistory) ToAssetHistory() *AssetHistory {
	item := &AssetHistory{
		RecordID:    &a.RecordID,
		GroupID:     &a.GroupID,
		Status:      &a.Status,
		ChangeDate:  &a.ChangeDate,
		Reason:      &a.Reason,
		Source:      &a.Source,
		Operator:    &a.Operator,
		OperatorTel: &a.OperatorTel,
		Creator:     &a.Creator,
	}
	return item
}

// AssetHistory 资产历史管理实体
type AssetHistory struct {
	Model
	RecordID    *string    `gorm:"column:record_id;size:36;index;"` // 记录ID
	GroupID     *string    `gorm:"column:group_id;size:36;index;"`  // 资产组ID
	Status      *int       `gorm:"column:status;index;"`            // 状态：1:未租 2:锁定 3:已租 4:退租 5:作废 6:续签
	ChangeDate  *time.Time `gorm:"column:change_date;index;"`       // 状态变更日期
	Reason      *string    `gorm:"column:reason;size:1024;"`        // 原因
	Source      *int       `gorm:"column:source;index;"`            // 数据来源：1录入 2导入
	Operator    *string    `gorm:"column:operator;size:50"`         // 操作人
	OperatorTel *string    `gorm:"column:operator_tel;size:50"`     // 操作人手机号
	Creator     *string    `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a AssetHistory) String() string {
	return toString(a)
}

// TableName 表名
func (a AssetHistory) TableName() string {
	return a.Model.TableName("asset_history")
}

// ToSchemaAssetHistory 转换为资产历史管理对象
func (a AssetHistory) ToSchemaAssetHistory() *schema.AssetHistory {
	item := &schema.AssetHistory{
		RecordID:    *a.RecordID,
		GroupID:     *a.GroupID,
		Status:      *a.Status,
		ChangeDate:  *a.ChangeDate,
		Reason:      *a.Reason,
		Source:      *a.Source,
		Operator:    *a.Operator,
		OperatorTel: *a.OperatorTel,
		Creator:     *a.Creator,
	}
	return item
}

// AssetHistories 资产历史管理列表
type AssetHistories []*AssetHistory

// ToSchemaAssetHistories 转换为资产历史管理对象列表
func (a AssetHistories) ToSchemaAssetHistories() []*schema.AssetHistory {
	list := make([]*schema.AssetHistory, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAssetHistory()
	}
	return list
}
