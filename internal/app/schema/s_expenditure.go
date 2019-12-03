package schema

import (
	"gxt-park-assets/pkg/util"
)

// Expenditure 支出节点
type Expenditure struct {
	RecordID   string `json:"record_id" swaggo:"false,记录ID"`              // 记录ID
	Name       string `json:"name" swaggo:"false,支出节点名称"`                 // 支出节点名称
	ParentID   string `json:"parent_id" swaggo:"false,父级ID"`              // 父级ID
	ParentPath string `json:"parent_path" swaggo:"false,父级路经"`            // 父级路经
	Category   string `json:"category" swaggo:"false,工作类别(大纲 里程碑 一级 二级)"` // 工作类别(大纲 里程碑 一级 二级)
}

// ExpenditureQueryParam 查询条件
type ExpenditureQueryParam struct {
	LikeName string // 支出节点名称(模糊查询)
	Category string // 工作类别(大纲 里程碑 一级 二级)
}

// ExpenditureQueryOptions 查询可选参数项
type ExpenditureQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ExpenditureQueryResult 查询结果
type ExpenditureQueryResult struct {
	Data       Expenditures
	PageResult *PaginationResult
}

// Expenditures 支出节点列表
type Expenditures []*Expenditure

// ToMap 转化为键值映射
func (a Expenditures) ToMap() map[string]*Expenditure {
	m := make(map[string]*Expenditure, len(a))
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}

// ExpenditureTree 支出节点树
type ExpenditureTree struct {
	RecordID   string            `json:"record_id" swaggo:"false,记录ID"`              // 记录ID
	Name       string            `json:"name" swaggo:"false,支出节点名称"`                 // 支出节点名称
	ParentID   string            `json:"parent_id" swaggo:"false,父级ID"`              // 父级ID
	ParentPath string            `json:"parent_path" swaggo:"false,父级路经"`            // 父级路经
	Category   string            `json:"category" swaggo:"false,工作类别(大纲 里程碑 一级 二级)"` // 工作类别(大纲 里程碑 一级 二级)
	Children   *ExpenditureTrees `json:"children" swaggo:"false,子级树"`                // 子级树
}

// ExpenditureTrees 支出节点树列表
type ExpenditureTrees []*ExpenditureTree

// ToTrees 转换为支出节点列表
func (a Expenditures) ToTrees() ExpenditureTrees {
	list := make(ExpenditureTrees, len(a))
	for i, item := range a {
		list[i] = &ExpenditureTree{
			RecordID:   item.RecordID,
			Name:       item.Name,
			ParentID:   item.ParentID,
			ParentPath: item.ParentPath,
			Category:   item.Category,
		}
	}
	return list
}

// ToTree 转换为树形结构
func (a ExpenditureTrees) ToTree() ExpenditureTrees {
	mi := make(map[string]*ExpenditureTree)
	for _, item := range a {
		mi[item.RecordID] = item
	}

	var list ExpenditureTrees
	for _, item := range a {
		if pitem, ok := mi[item.ParentID]; ok {
			if pitem.Children == nil {
				var children ExpenditureTrees
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

// ToProjExpendList 转为项目支出节点创建时间列表
func (a ExpenditureTrees) ToProjExpendList(projExpendList *ProjExpenditures, pitem ...*ProjExpenditure) *ProjExpenditures {
	if projExpendList == nil {
		return projExpendList
	}

	for _, treeItem := range a {
		recordID := util.MustUUID()
		parentID := ""
		parentPath := ""
		if len(pitem) > 0 {
			parentID = pitem[0].RecordID

			if pitem[0].ParentPath != "" {
				parentPath = pitem[0].ParentPath + "/" + parentID
			} else {
				parentPath = parentID
			}
		}

		temp := &ProjExpenditure{
			RecordID:   recordID,
			ParentID:   parentID,
			ParentPath: parentPath,
			Category:   treeItem.Category,
			Name:       treeItem.Name,
		}
		*projExpendList = append(*projExpendList, temp)
		if treeItem.Children == nil {
			continue
		}

		treeItem.Children.ToProjExpendList(projExpendList, temp)

	}

	return projExpendList
}
