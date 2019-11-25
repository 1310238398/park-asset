package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetProjExpenditureTimeDB 项目支出节点时间表
func GetProjExpenditureTimeDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjExpenditureTime{})
}

// SchemaProjExpenditureTime 项目支出节点时间表
type SchemaProjExpenditureTime schema.ProjExpenditureTime

// ToProjExpenditureTime 转换为项目支出节点时间表实体
func (a SchemaProjExpenditureTime) ToProjExpenditureTime() *ProjExpenditureTime {
	item := &ProjExpenditureTime{
		RecordID:          &a.RecordID,
		Year:              &a.Year,
		Quarter:           &a.Quarter,
		Month:             &a.Month,
		Day:               &a.Day,
		ExpenditureAmount: &a.ExpenditureAmount,
		ProjExpenditureID: &a.ProjExpenditureID,
	}
	return item
}

// ProjExpenditureTime 项目支出节点时间表实体
type ProjExpenditureTime struct {
	CostModel
	RecordID          *string  `gorm:"column:record_id;size:36;index;"`              // 记录ID
	Year              *int     `gorm:"column:year;index;"`                           // 年度
	Quarter           *int     `gorm:"column:quarter;index;"`                        // 季度
	Month             *int     `gorm:"column:month;index;"`                          // 月份
	Day               *int     `gorm:"column:day;index;"`                            // 天
	ExpenditureAmount *float64 `gorm:"column:expenditure_amount;type:decimal(20,4)"` // 支出比例
	ProjExpenditureID *string  `gorm:"column:proj_expenditure_id;size:36;index;"`    // 项目支出节点ID
}

func (a ProjExpenditureTime) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjExpenditureTime) TableName() string {
	return a.CostModel.TableName("proj_expenditure_time")
}

// ToSchemaProjExpenditureTime 转换为项目支出节点时间表对象
func (a ProjExpenditureTime) ToSchemaProjExpenditureTime() *schema.ProjExpenditureTime {
	item := &schema.ProjExpenditureTime{
		RecordID:          *a.RecordID,
		Year:              *a.Year,
		Quarter:           *a.Quarter,
		Month:             *a.Month,
		Day:               *a.Day,
		ExpenditureAmount: *a.ExpenditureAmount,
		ProjExpenditureID: *a.ProjExpenditureID,
	}
	return item
}

// ProjExpenditureTimes 项目支出节点时间表列表
type ProjExpenditureTimes []*ProjExpenditureTime

// ToSchemaProjExpenditureTimes 转换为项目支出节点时间表对象列表
func (a ProjExpenditureTimes) ToSchemaProjExpenditureTimes() []*schema.ProjExpenditureTime {
	list := make([]*schema.ProjExpenditureTime, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjExpenditureTime()
	}
	return list
}
