package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetStatisticDB 统计查询
func GetStatisticDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Statistic{})
}

// SchemaStatistic 统计查询
type SchemaStatistic schema.Statistic

// ToStatistic 转换为统计查询实体
func (a SchemaStatistic) ToStatistic() *Statistic {
	item := &Statistic{
		RecordID: &a.RecordID,
		Creator:  &a.Creator,
	}
	return item
}

// Statistic 统计查询实体
type Statistic struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a Statistic) String() string {
	return toString(a)
}

// TableName 表名
func (a Statistic) TableName() string {
	return a.Model.TableName("statistic")
}

// ToSchemaStatistic 转换为统计查询对象
func (a Statistic) ToSchemaStatistic() *schema.Statistic {
	item := &schema.Statistic{
		RecordID: *a.RecordID,
		Creator:  *a.Creator,
	}
	return item
}

// Statistics 统计查询列表
type Statistics []*Statistic

// ToSchemaStatistics 转换为统计查询对象列表
func (a Statistics) ToSchemaStatistics() []*schema.Statistic {
	list := make([]*schema.Statistic, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaStatistic()
	}
	return list
}
