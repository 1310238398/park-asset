package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetDictionaryDB 字典管理
func GetDictionaryDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Dictionary{})
}

// SchemaDictionary 字典管理
type SchemaDictionary schema.Dictionary

// ToDictionary 转换为字典管理实体
func (a SchemaDictionary) ToDictionary() *Dictionary {
	item := &Dictionary{
		RecordID:   &a.RecordID,
		Code:       &a.Code,
		Name:       &a.Name,
		Sequence:   &a.Sequence,
		ParentID:   &a.ParentID,
		ParentPath: &a.ParentPath,
		Memo:       &a.Memo,
		Creator:    &a.Creator,
	}
	return item
}

// Dictionary 字典管理实体
type Dictionary struct {
	Model
	RecordID   *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Code       *string `gorm:"column:code;size:50;index;"`      // 字典编号
	Name       *string `gorm:"column:name;size:100;index;"`     // 字典名称
	Sequence   *int    `gorm:"column:sequence;index;"`          // 排序值（降序）
	ParentID   *string `gorm:"column:parent_id;36;index;"`      // 父级ID
	ParentPath *string `gorm:"column:parent_path;518;index;"`   // 父级路径
	Memo       *string `gorm:"column:memo;size:1024;"`          // 备注
	Creator    *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a Dictionary) String() string {
	return toString(a)
}

// TableName 表名
func (a Dictionary) TableName() string {
	return a.Model.TableName("dictionary")
}

// ToSchemaDictionary 转换为字典管理对象
func (a Dictionary) ToSchemaDictionary() *schema.Dictionary {
	item := &schema.Dictionary{
		RecordID:   *a.RecordID,
		Code:       *a.Code,
		Name:       *a.Name,
		Sequence:   *a.Sequence,
		ParentID:   *a.ParentID,
		ParentPath: *a.ParentPath,
		Memo:       *a.Memo,
		Creator:    *a.Creator,
	}
	return item
}

// Dictionaries 字典管理列表
type Dictionaries []*Dictionary

// ToSchemaDictionaries 转换为字典管理对象列表
func (a Dictionaries) ToSchemaDictionaries() []*schema.Dictionary {
	list := make([]*schema.Dictionary, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaDictionary()
	}
	return list
}
