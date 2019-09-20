package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
	"gxt-park-assets/pkg/util"
)

// GetProjectDB 项目管理
func GetProjectDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Project{})
}

// SchemaProject 项目管理
type SchemaProject schema.Project

// ToProject 转换为项目管理实体
func (a SchemaProject) ToProject() *Project {
	item := &Project{
		RecordID:          &a.RecordID,
		Name:              &a.Name,
		Location:          &a.Location,
		Address:           &a.Address,
		Nature:            &a.Nature,
		Photo:             &a.Photo,
		AssetType:         &a.AssetType,
		AssetTypeCalc:     util.CalcBitValueByString(a.AssetType),
		Peripheral:        &a.Peripheral,
		PeripheralCalc:    util.CalcBitValueByString(a.Peripheral),
		BasicServices:     &a.BasicServices,
		BasicServicesCalc: util.CalcBitValueByString(a.BasicServices),
		Tag:               &a.Tag,
		TagCalc:           util.CalcBitValueByString(a.Tag),
		HasModel:          &a.HasModel,
		ParentID:          &a.ParentID,
		ParentPath:        &a.ParentPath,
		Memo:              &a.Memo,
		Creator:           &a.Creator,
		OrgID:             &a.OrgID,
	}

	return item
}

// Project 项目管理实体
type Project struct {
	Model
	RecordID          *string `gorm:"column:record_id;size:36;index;"`   // 记录ID
	Name              *string `gorm:"column:name;size:200;index;"`       // 项目名称
	Location          *string `gorm:"column:location;size:1024;"`        // 项目位置(经纬度)
	Address           *string `gorm:"column:address;size:1024;"`         // 项目地址
	Nature            *string `gorm:"column:nature;size:100;index;"`     // 资产性质
	Photo             *string `gorm:"column:photo;size:1024;"`           // 项目照片
	AssetType         *string `gorm:"column:asset_type;size:100;"`       // 资产类型
	AssetTypeCalc     *int    `gorm:"column:asset_type_calc;index;"`     // 资产类型计算值
	Peripheral        *string `gorm:"column:peripheral;size:100;"`       // 周边配套
	PeripheralCalc    *int    `gorm:"column:peripheral_calc;index;"`     // 周边配套计算值
	BasicServices     *string `gorm:"column:basic_services;size:100;"`   // 基础服务
	BasicServicesCalc *int    `gorm:"column:basic_services_calc;index;"` // 基础服务计算值
	Tag               *string `gorm:"column:tag;size:100;"`              // 特色标签
	TagCalc           *int    `gorm:"column:tag_calc;index;"`            // 特色标签计算值
	HasModel          *int    `gorm:"column:has_model;"`                 // 是否包含3D模型(1:包含 2:不包含)
	ParentID          *string `gorm:"column:parent_id;36;index;"`        // 父级ID
	ParentPath        *string `gorm:"column:parent_path;518;index;"`     // 父级路径
	Memo              *string `gorm:"column:memo;size:1024;"`            // 备注
	Creator           *string `gorm:"column:creator;size:36;index;"`     // 创建者
	OrgID             *string `gorm:"column:org_id;size:36;index;"`      // 所属子公司
}

func (a Project) String() string {
	return toString(a)
}

// TableName 表名
func (a Project) TableName() string {
	return a.Model.TableName("project")
}

// ToSchemaProject 转换为项目管理对象
func (a Project) ToSchemaProject() *schema.Project {
	item := &schema.Project{
		RecordID:      *a.RecordID,
		Name:          *a.Name,
		Location:      *a.Location,
		Address:       *a.Address,
		Nature:        *a.Nature,
		Photo:         *a.Photo,
		AssetType:     *a.AssetType,
		Peripheral:    *a.Peripheral,
		BasicServices: *a.BasicServices,
		Tag:           *a.Tag,
		HasModel:      *a.HasModel,
		ParentID:      *a.ParentID,
		ParentPath:    *a.ParentPath,
		Memo:          *a.Memo,
		Creator:       *a.Creator,
		OrgID:         *a.OrgID,
	}
	return item
}

// Projects 项目管理列表
type Projects []*Project

// ToSchemaProjects 转换为项目管理对象列表
func (a Projects) ToSchemaProjects() []*schema.Project {
	list := make([]*schema.Project, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProject()
	}
	return list
}
