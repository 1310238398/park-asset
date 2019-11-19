package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetBusinessFormatDB 业态
func GetBusinessFormatDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, BusinessFormat{})
}

// SchemaBusinessFormat 业态
type SchemaBusinessFormat schema.BusinessFormat

// ToBusinessFormat 转换为业态实体
func (a SchemaBusinessFormat) ToBusinessFormat() *BusinessFormat {
	item := &BusinessFormat{
		RecordID:       &a.RecordID,
		Name:           &a.Name,
		ISUnderground:  &a.ISUnderground,
		ISCivilDefense: &a.ISCivilDefense,
		Memo:           &a.Memo,
	}
	return item
}

// BusinessFormat 业态实体
type BusinessFormat struct {
	CostModel
	RecordID       *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name           *string `gorm:"column:name;size:200;index;"`     // 业态名称
	ISUnderground  *int    `gorm:"column:is_underground;index;"`    // 是否位于地下(1:是2:否)
	ISCivilDefense *int    `gorm:"column:is_civil_defense;index;"`  // 是否属于人防(1:是2:否)
	Memo           *string `gorm:"column:memo;size:1024;"`          // 备注
}

func (a BusinessFormat) String() string {
	return toString(a)
}

// TableName 表名
func (a BusinessFormat) TableName() string {
	return a.CostModel.TableName("business_format")
}

// ToSchemaBusinessFormat 转换为业态对象
func (a BusinessFormat) ToSchemaBusinessFormat() *schema.BusinessFormat {
	item := &schema.BusinessFormat{
		RecordID:       *a.RecordID,
		Name:           *a.Name,
		ISUnderground:  *a.ISUnderground,
		ISCivilDefense: *a.ISCivilDefense,
		Memo:           *a.Memo,
	}
	return item
}

// BusinessFormats 业态列表
type BusinessFormats []*BusinessFormat

// ToSchemaBusinessFormats 转换为业态对象列表
func (a BusinessFormats) ToSchemaBusinessFormats() []*schema.BusinessFormat {
	list := make([]*schema.BusinessFormat, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaBusinessFormat()
	}
	return list
}
