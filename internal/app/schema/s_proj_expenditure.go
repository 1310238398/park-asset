package schema

import (
	"time"
)

// ProjExpenditure 项目支出节点
type ProjExpenditure struct {
	RecordID            string        `json:"record_id" swaggo:"false,记录ID"`                                                                                                  // 记录ID
	Name                string        `json:"name" swaggo:"false,项目支出节点名称"`                                                                                                   // 项目支出节点名称
	ProjectID           string        `json:"project_id" swaggo:"false,成本项目ID"`                                                                                               // 成本项目ID
	StartTime           time.Time     `json:"start_time" swaggo:"false,开始时间"`                                                                                                 // 开始时间
	EndTime             time.Time     `json:"end_time" swaggo:"false,结束时间"`                                                                                                   // 结束时间
	ExpenditureTimeType int           `json:"expenditure_time_type" swaggo:"false,资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)"` // 资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	ExpendRate          float64       `json:"expend_rate" swaggo:"false,累计支出比例"`                                                                                              // 累计支出比例
	ParentID            string        `json:"parent_id" swaggo:"false,父级ID"`                                                                                                  // 父级ID
	ParentPath          string        `json:"parent_path" swaggo:"false,父级路经"`                                                                                                // 父级路经
	TotalCost           float64       `json:"total_cost" swaggo:"false,支出总额"`                                                                                                 // 支出总额
	ProjCostItems       ProjCostItems `json:"proj_cost_items" swaggo:"false, 项目支出节点成本项列表"`                                                                                    // 项目支出节点成本项列表
	Category            string        `json:"category" swaggo:"false,工作类别(大纲 里程碑 一级 二级)"`                                                                                     // 工作类别(大纲 里程碑 一级 二级)

}

// ProjExpenditureQueryParam 查询条件
type ProjExpenditureQueryParam struct {
	LikeName            string    // 项目支出节点名称(模糊查询)
	ProjectID           string    // 项目ID
	ExpenditureTimeType int       // 资金支出时间方式 (1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	ParentID            string    // 父级ID
	ParentPath          string    // 父级路经
	BeforeStartTime     time.Time // 开始时间之前
}

// ProjExpenditureQueryOptions 查询可选参数项
type ProjExpenditureQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjExpenditureQueryResult 查询结果
type ProjExpenditureQueryResult struct {
	Data       ProjExpenditures
	PageResult *PaginationResult
}

// ProjExpenditures 项目支出节点列表
type ProjExpenditures []*ProjExpenditure

// ToProjExpendIDs 转化为项目支出节点ID列表
func (a ProjExpenditures) ToProjExpendIDs() []string {
	l := make([]string, len(a))
	for _, item := range a {
		l = append(l, item.RecordID)
	}

	return l
}

// FillProjCostItem 填充对应项目成本项
func (a ProjExpenditures) FillProjCostItem(m map[string]*ProjCostItem, projExpendCostList ProjExpendCosts) {
	for _, item := range a {
		for _, projExpCostItem := range projExpendCostList {
			if item.RecordID == projExpCostItem.ProjExpenditureID {
				if projCostItem, ok := m[projExpCostItem.ProjCostID]; ok {
					item.ProjCostItems = append(item.ProjCostItems, projCostItem)
				}

			}
		}
	}
}

// func (a ProjExpenditures) FillCategory(m map[string]*Expenditure) {
// 	for _, item := range a {

// 	}
// }

// ProjExpenditureTree 项目支出节点
type ProjExpenditureTree struct {
	RecordID            string                  `json:"record_id" swaggo:"false,记录ID"`                                                                                                  // 记录ID
	Name                string                  `json:"name" swaggo:"false,项目支出节点名称"`                                                                                                   // 项目支出节点名称
	ProjectID           string                  `json:"project_id" swaggo:"false,成本项目ID"`                                                                                               // 成本项目ID
	StartTime           time.Time               `json:"start_time" swaggo:"false,开始时间"`                                                                                                 // 开始时间
	EndTime             time.Time               `json:"end_time" swaggo:"false,结束时间"`                                                                                                   // 结束时间
	ExpenditureTimeType int                     `json:"expenditure_time_type" swaggo:"false,资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)"` // 资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	ExpendRate          float64                 `json:"expend_rate" swaggo:"false,累计支出比例"`                                                                                              // 支出比例
	ParentID            string                  `json:"parent_id" swaggo:"false,父级ID"`                                                                                                  // 父级ID
	ParentPath          string                  `json:"parent_path" swaggo:"false,父级路经"`                                                                                                // 父级路经
	TotalCost           float64                 `json:"total_cost" swaggo:"false,支出总额"`                                                                                                 // 支出总额
	ProjCostItems       ProjCostItems           `json:"proj_cost_items" swaggo:"false, 项目支出节点成本项列表"`                                                                                    // 项目支出节点成本项列表
	Children            *[]*ProjExpenditureTree `json:"children,omitempty" swaggo:"false,子级树"`                                                                                          // 子级树
}

// ProjExpenditureTrees 项目支出节点树列表
type ProjExpenditureTrees []*ProjExpenditureTree

// ToTrees 转换为组织机构列表
func (a ProjExpenditures) ToTrees() ProjExpenditureTrees {
	list := make(ProjExpenditureTrees, len(a))
	for i, item := range a {
		list[i] = &ProjExpenditureTree{
			RecordID:            item.RecordID,
			Name:                item.Name,
			ParentID:            item.ParentID,
			ParentPath:          item.ParentPath,
			ProjectID:           item.ProjectID,
			StartTime:           item.StartTime,
			EndTime:             item.EndTime,
			ExpenditureTimeType: item.ExpenditureTimeType,
			ExpendRate:          item.ExpendRate,
			ProjCostItems:       item.ProjCostItems,
		}
	}
	return list
}

// ToTree 转换为树形结构
func (a ProjExpenditureTrees) ToTree() []*ProjExpenditureTree {
	mi := make(map[string]*ProjExpenditureTree)
	for _, item := range a {
		mi[item.RecordID] = item
	}

	var list []*ProjExpenditureTree
	for _, item := range a {
		if pitem, ok := mi[item.ParentID]; ok {
			if pitem.Children == nil {
				var children []*ProjExpenditureTree
				children = append(children, item)
				pitem.Children = &children
				continue
			}
			*pitem.Children = append(*pitem.Children, item)
			continue
		}
		list = append(list, item)
	}
	return list
}
