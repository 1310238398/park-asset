package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetAssetDB 资产管理
func GetAssetDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Asset{})
}

// SchemaAsset 资产管理
type SchemaAsset schema.Asset

// ToAsset 转换为资产管理实体
func (a SchemaAsset) ToAsset() *Asset {
	item := &Asset{
		RecordID:     &a.RecordID,
		ProjectID:    &a.ProjectID,
		AssetType:    &a.AssetType,
		Creator:      &a.Creator,
		Name:         &a.Name,
		BuildingArea: &a.BuildingArea,
		RentArea:     &a.RentArea,
		RentStatus:   &a.RentStatus,
		ParentID:     &a.ParentID,
		ParentPath:   &a.ParentPath,
	}
	return item
}

// Asset 资产管理实体
type Asset struct {
	Model
	RecordID     *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	ProjectID    *string `gorm:"column:project_id;size:36;index;"` // 项目ID
	AssetType    *int    `gorm:"column:asset_type;index;"`         // 资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商
	Name         *string `gorm:"column:name;size:200;index;"`      // 资产名称
	BuildingArea *int    `gorm:"column:building_area;"`            // 建筑面积
	RentArea     *int    `gorm:"column:rent_area;"`                // 计租面积
	RentStatus   *int    `gorm:"column:rent_status;index;"`        // 出租状态:1未租 2锁定 3已租
	ParentID     *string `gorm:"column:parent_id;36;index;"`       // 父级ID
	ParentPath   *string `gorm:"column:parent_path;518;index;"`    // 父级路径
	Creator      *string `gorm:"column:creator;size:36;index;"`    // 创建者
}

func (a Asset) String() string {
	return toString(a)
}

// TableName 表名
func (a Asset) TableName() string {
	return a.Model.TableName("asset")
}

// ToSchemaAsset 转换为资产管理对象
func (a Asset) ToSchemaAsset() *schema.Asset {
	item := &schema.Asset{
		RecordID:     *a.RecordID,
		ProjectID:    *a.ProjectID,
		AssetType:    *a.AssetType,
		Creator:      *a.Creator,
		Name:         *a.Name,
		BuildingArea: *a.BuildingArea,
		RentArea:     *a.RentArea,
		RentStatus:   *a.RentStatus,
		ParentID:     *a.ParentID,
		ParentPath:   *a.ParentPath,
	}
	return item
}

// Assets 资产管理列表
type Assets []*Asset

// ToSchemaAssets 转换为资产管理对象列表
func (a Assets) ToSchemaAssets() []*schema.Asset {
	list := make([]*schema.Asset, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAsset()
	}
	return list
}
