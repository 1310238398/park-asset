package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetAssetGroupDB 资产组管理
func GetAssetGroupDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, AssetGroup{})
}

// SchemaAssetGroup 资产组管理
type SchemaAssetGroup schema.AssetGroup

// ToAssetGroup 转换为资产组管理实体
func (a SchemaAssetGroup) ToAssetGroup() *AssetGroup {
	item := &AssetGroup{
		RecordID: &a.RecordID,
		AssetID:  &a.AssetID,
		Creator:  &a.Creator,
	}
	return item
}

// AssetGroup 资产组管理实体
type AssetGroup struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	AssetID  *string `gorm:"column:asset_id;size:36;index;"`  // 资产ID
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a AssetGroup) String() string {
	return toString(a)
}

// TableName 表名
func (a AssetGroup) TableName() string {
	return a.Model.TableName("asset_group")
}

// ToSchemaAssetGroup 转换为资产组管理对象
func (a AssetGroup) ToSchemaAssetGroup() *schema.AssetGroup {
	item := &schema.AssetGroup{
		RecordID: *a.RecordID,
		AssetID:  *a.AssetID,
		Creator:  *a.Creator,
	}
	return item
}

// AssetGroups 资产组管理列表
type AssetGroups []*AssetGroup

// ToSchemaAssetGroups 转换为资产组管理对象列表
func (a AssetGroups) ToSchemaAssetGroups() []*schema.AssetGroup {
	list := make([]*schema.AssetGroup, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAssetGroup()
	}
	return list
}
