package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"time"

	"github.com/jinzhu/gorm"
)

// GetProjExpenditureDB 项目支出节点
func GetProjExpenditureDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ProjExpenditure{})
}

// SchemaProjExpenditure 项目支出节点
type SchemaProjExpenditure schema.ProjExpenditure

// ToProjExpenditure 转换为项目支出节点实体
func (a SchemaProjExpenditure) ToProjExpenditure() *ProjExpenditure {
	item := &ProjExpenditure{
		RecordID:            &a.RecordID,
		Name:                &a.Name,
		ProjectID:           &a.ProjectID,
		StartTime:           a.StartTime,
		EndTime:             a.EndTime,
		ExpenditureTimeType: &a.ExpenditureTimeType,
		ExpendRate:          &a.ExpendRate,
		ParentID:            &a.ParentID,
		ParentPath:          &a.ParentPath,
		TotalCost:           &a.TotalCost,
		Category:            &a.Category,
		Sequence:            &a.Sequence,
	}
	return item
}

// ProjExpenditure 项目支出节点实体
type ProjExpenditure struct {
	CostModel
	RecordID            *string    `gorm:"column:record_id;size:36;index;"`           // 记录ID
	Name                *string    `gorm:"column:name;size:200;index;"`               // 项目支出节点名称
	ProjectID           *string    `gorm:"column:project_id;size:36;index;"`          // 成本项目ID
	StartTime           *time.Time `gorm:"column:start_time;type:date;index;"`        // 开始时间
	EndTime             *time.Time `gorm:"column:end_time;type:date;"`                // 结束时间
	ExpenditureTimeType *int       `gorm:"column:expenditure_time_type;index;"`       // 资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	ExpendRate          *float64   `gorm:"column:expend_rate;type:decimal(20,4);"`    // 累计支出比例
	ParentID            *string    `gorm:"column:parent_id;size:36;index;"`           // 父级ID
	ParentPath          *string    `gorm:"column:parent_path;size:518;index;"`        // 父级路经
	TotalCost           *float64   `gorm:"column:total_cost;type:decimal(20,4);"`     // 支出总额
	Category            *string    `gorm:"column:category;size:100;index;"`           // 类别
	Sequence            *float64   `gorm:"column:sequence;type:decimal(20,4);index;"` // 排序值

}

func (a ProjExpenditure) String() string {
	return toString(a)
}

// TableName 表名
func (a ProjExpenditure) TableName() string {
	return a.CostModel.TableName("proj_expenditure")
}

// ToSchemaProjExpenditure 转换为项目支出节点对象
func (a ProjExpenditure) ToSchemaProjExpenditure() *schema.ProjExpenditure {
	item := &schema.ProjExpenditure{
		RecordID:            *a.RecordID,
		Name:                *a.Name,
		ProjectID:           *a.ProjectID,
		StartTime:           a.StartTime,
		EndTime:             a.EndTime,
		ExpenditureTimeType: *a.ExpenditureTimeType,
		ExpendRate:          *a.ExpendRate,
		ParentID:            *a.ParentID,
		ParentPath:          *a.ParentPath,
		TotalCost:           *a.TotalCost,
		Category:            *a.Category,
		Sequence:            *a.Sequence,
	}
	return item
}

// ProjExpenditures 项目支出节点列表
type ProjExpenditures []*ProjExpenditure

// ToSchemaProjExpenditures 转换为项目支出节点对象列表
func (a ProjExpenditures) ToSchemaProjExpenditures() []*schema.ProjExpenditure {
	list := make([]*schema.ProjExpenditure, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaProjExpenditure()
	}
	return list
}
