package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetOrganizationDB 组织机构管理
func GetOrganizationDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, Organization{})
}

// SchemaOrganization 组织机构管理
type SchemaOrganization schema.Organization

// ToOrganization 转换为组织机构管理实体
func (a SchemaOrganization) ToOrganization() *Organization {
	item := &Organization{
		RecordID:   &a.RecordID,
		Name:       &a.Name,
		OrgType:    &a.OrgType,
		Sequence:   &a.Sequence,
		ParentID:   &a.ParentID,
		ParentPath: &a.ParentPath,
		Memo:       &a.Memo,
		Creator:    &a.Creator,
	}
	return item
}

// Organization 组织机构管理实体
type Organization struct {
	Model
	RecordID   *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name       *string `gorm:"column:name;size:100;index;"`     // 机构名称
	OrgType    *int    `gorm:"column:org_type;index;"`          // 机构类型
	Sequence   *int    `gorm:"column:sequence;index;"`          // 排序值（降序）
	ParentID   *string `gorm:"column:parent_id;36;index;"`      // 父级ID
	ParentPath *string `gorm:"column:parent_path;518;index;"`   // 父级路径
	Memo       *string `gorm:"column:memo;size:1024;"`          // 备注
	Creator    *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a Organization) String() string {
	return toString(a)
}

// TableName 表名
func (a Organization) TableName() string {
	return a.Model.TableName("organization")
}

// ToSchemaOrganization 转换为组织机构管理对象
func (a Organization) ToSchemaOrganization() *schema.Organization {
	item := &schema.Organization{
		RecordID:   *a.RecordID,
		Name:       *a.Name,
		OrgType:    *a.OrgType,
		Sequence:   *a.Sequence,
		ParentID:   *a.ParentID,
		ParentPath: *a.ParentPath,
		Memo:       *a.Memo,
		Creator:    *a.Creator,
	}
	return item
}

// Organizations 组织机构管理列表
type Organizations []*Organization

// ToSchemaOrganizations 转换为组织机构管理对象列表
func (a Organizations) ToSchemaOrganizations() []*schema.Organization {
	list := make([]*schema.Organization, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaOrganization()
	}
	return list
}
