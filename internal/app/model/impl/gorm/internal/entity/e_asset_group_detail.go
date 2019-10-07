package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetAssetGroupDetailDB 资产组明细管理
func GetAssetGroupDetailDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, AssetGroupDetail{})
}

// SchemaAssetGroupDetail 资产组明细管理
type SchemaAssetGroupDetail schema.AssetGroupDetail

// ToAssetGroupDetail 转换为资产组明细管理实体
func (a SchemaAssetGroupDetail) ToAssetGroupDetail() *AssetGroupDetail {
	item := &AssetGroupDetail{
		GroupID: &a.GroupID,
		AssetID: &a.AssetID,
		Creator: &a.Creator,
	}
	return item
}

// AssetGroupDetail 资产组明细管理实体
type AssetGroupDetail struct {
	Model
	GroupID *string `gorm:"column:group_id;size:36;index;"` // 资产组ID
	AssetID *string `gorm:"column:asset_id;size:36;index;"` // 资产ID
	Creator *string `gorm:"column:creator;size:36;index;"`  // 创建者
}

func (a AssetGroupDetail) String() string {
	return toString(a)
}

// TableName 表名
func (a AssetGroupDetail) TableName() string {
	return a.Model.TableName("asset_group_detail")
}

// ToSchemaAssetGroupDetail 转换为资产组明细管理对象
func (a AssetGroupDetail) ToSchemaAssetGroupDetail() *schema.AssetGroupDetail {
	item := &schema.AssetGroupDetail{
		GroupID: *a.GroupID,
		AssetID: *a.AssetID,
		Creator: *a.Creator,
	}
	return item
}

// AssetGroupDetails 资产组明细管理列表
type AssetGroupDetails []*AssetGroupDetail

// ToSchemaAssetGroupDetails 转换为资产组明细管理对象列表
func (a AssetGroupDetails) ToSchemaAssetGroupDetails() []*schema.AssetGroupDetail {
	list := make([]*schema.AssetGroupDetail, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAssetGroupDetail()
	}
	return list
}
