package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjFileDB 成本项目文件管理
func GetProjFileDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjFile{})
}

// SchemaProjFile 成本项目文件管理
type SchemaProjFile schema.ProjFile

// ToProjFile 转换为成本项目文件管理实体
func (a SchemaProjFile) ToProjFile() *ProjFile {
	item := &ProjFile{
		RecordID:  &a.RecordID,
		Name:      &a.Name,
		Path:      &a.Path,
		Memo:      &a.Memo,
		ProjectID: &a.ProjectID,
		Size:      &a.Size,
		Type:      &a.Type,
	}
	return item
}

// ProjFile 成本项目文件管理实体
type ProjFile struct {
	CostModel
	RecordID  *string `gorm:"column:record_id;size:36;index;"`  // 记录ID
	Name      *string `gorm:"column:name;size:200;index;"`      // 文件名称
	Path      *string `gorm:"column:path;size:512;index;"`      // 文件路经
	Memo      *string `gorm:"column:memo;size:1024;"`           // 备注
	ProjectID *string `gorm:"column:project_id;size:36;index;"` // 成本项目ID
	Size      *int    `gorm:"column:size;"`                     // 大小(单位:字节)
	Type      *string `gorm:"column:type;size:50;"`             // 类型
}

func (a ProjFile) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjFile) TableName() string {
	return a.CostModel.TableName("proj_file")
}

// ToSchemaProjFile 转换为成本项目文件管理对象
func (a ProjFile) ToSchemaProjFile() *schema.ProjFile {
	item := &schema.ProjFile{
		RecordID:  *a.RecordID,
		Name:      *a.Name,
		Path:      *a.Path,
		Memo:      *a.Memo,
		ProjectID: *a.ProjectID,
		Size:      *a.Size,
		Type:      *a.Type,
	}
	return item
}

// ProjFiles 成本项目文件管理列表
type ProjFiles []*ProjFile

// ToSchemaProjFiles 转换为成本项目文件管理对象列表
func (a ProjFiles) ToSchemaProjFiles() []*schema.ProjFile {
	list := make([]*schema.ProjFile, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjFile()
	}
	return list
}
