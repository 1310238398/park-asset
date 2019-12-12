package schema

import (
	"fmt"
)

// ProjCostItem 项目成本项
type ProjCostItem struct {
	RecordID     string             `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	ProjectID    string             `json:"project_id" binding:"required" swaggo:"false,成本项目ID"` // 成本项目ID
	CostID       string             `json:"cost_id" swaggo:"false,成本项ID"`                        // 成本项ID
	TaxRate      float64            `json:"tax_rate" swaggo:"false,税率"`                          // 税率
	TaxPrice     float64            `json:"tax_price" swaggo:"false,缴税税额"`                       // 缴税税额
	Name         string             `json:"name" swaggo:"false,项目成本项名称"`                         // 名称
	Price        float64            `json:"price" swaggo:"false,成本项价格"`                          // 成本项价格
	Memo         string             `json:"memo" swaggo:"false,备注"`                              // 备注
	Principal    string             `json:"principal" swaggo:"false,负责人"`                        // 负责人
	ProjIncomeID string             `json:"proj_income_id" swaggo:"false,项目收益测算ID"`              // 项目收益测算ID
	BusinessList ProjCostBusinesses `json:"business_list" swaggo:"false,成本下业态列表"`                // 成本下业态列表
}

// ProjCostItem 项目成本项展示
type ProjCostItemShow struct {
	RecordID       string              `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	Level          int                 `json:"level" swaggo:"false,级别"`                             //级别
	ProjectID      string              `json:"project_id" swaggo:"false,成本项目ID"`                    // 成本项目ID
	CostID         string              `json:"cost_id" swaggo:"false,成本项ID"`                        // 成本项ID
	CostParentID   string              `json:"cost_parent_id" swaggo:"false,成本项父级ID"`               //父级成本项ID
	CostParentPath string              `json:"cost_parent_path" swaggo:"false,成本项父级路经"`             //成本项父级路经
	Name           string              `json:"name" swaggo:"false,业态名称"`                            // 名称
	TaxID          string              `json:"tax_id" swaggo:"false,税目ID"`                          // 税目ID
	Label          int                 `json:"label" swaggo:"false,标签(1:成本科目 2:测算科目)"`              // 标签(1:成本科目 2:测算科目)
	CalculateType  int                 `json:"calculate_type" swaggo:"false,计算方式(1.单价算总价,2.总价算单价)"` //计算方式(1.单价算总价,2.总价算单价)
	TaxRate        float64             `json:"tax_rate" swaggo:"false,税率"`                          // 税率
	TaxPrice       float64             `json:"tax_price" swaggo:"false,缴税税额"`                       // 缴税税额
	Price          float64             `json:"price" swaggo:"false,成本项价格"`                          // 成本项价格
	Memo           string              `json:"memo" swaggo:"false,备注"`                              // 备注
	Principal      string              `json:"principal" swaggo:"false,负责人"`                        // 负责人
	ProjIncomeID   string              `json:"proj_income_id" swaggo:"false,项目收益测算ID"`              // 项目收益测算ID
	BusinessList   []*ProjCostBusiness `json:"business_list" swaggo:"false,成本下业态列表"`                // 成本下业态列表
	Children       ProjCostItemShows   `json:"children,omitempty" swaggo:"fasle,下级成本项"`             //下级成本项
	Editable       bool                `json:"editable" swaggo:"false,可编辑"`
}

// ProjCostItemQueryParam 查询条件
type ProjCostItemQueryParam struct {
	CostID       string   // 成本项ID
	ProjectID    string   // 项目ID
	Name         string   // 成本项名称
	Label        int      // 标签
	ProjIncomeID string   // 项目收益测算ID
	RecordIDs    []string // 项目成本项ID列表
	InLandTax    int      // 是否计入土增
	CostParentID *string  // 成本模板上级ID
}

// ProjCostItemQueryOptions 查询可选参数项
type ProjCostItemQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCostItemQueryResult 查询结果
type ProjCostItemQueryResult struct {
	Data       ProjCostItems
	PageResult *PaginationResult
}

// ProjCostItems 项目成本项列表
type ProjCostItems []*ProjCostItem

// ToProjCostIDs 转换为项目成本项ID列表
func (a ProjCostItems) ToProjCostIDs() []string {
	l := make([]string, len(a))
	for _, item := range a {
		l = append(l, item.RecordID)
	}

	return l
}

// ToMap 转换为键值映射
func (a ProjCostItems) ToMap() map[string]*ProjCostItem {
	m := make(map[string]*ProjCostItem)
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}

// ProjCostItemShows 项目成本项展示列表
type ProjCostItemShows []*ProjCostItemShow

func (a *ProjCostItemShow) ToMap() map[string]interface{} {
	result := map[string]interface{}{}
	result["record_id"] = a.RecordID
	result["project_id"] = a.ProjectID
	result["cost_id"] = a.CostID
	result["cost_parent_id"] = a.CostParentID
	result["cost_parent_path"] = a.CostParentPath
	result["name"] = a.Name
	result["tax_id"] = a.TaxID
	result["label"] = a.Label
	result["level"] = a.Level
	result["calculate_type"] = a.CalculateType
	result["tax_rate"] = a.TaxRate
	result["tax_price"] = a.TaxPrice
	result["price"] = a.Price
	result["memo"] = a.Memo
	result["principal"] = a.Principal
	result["proj_income_id"] = a.ProjIncomeID
	result["editable"] = a.Editable
	for _, v := range a.BusinessList {
		result[fmt.Sprintf("%s_unit", v.ProjBusinessID)] = v.UnitPrice
		result[fmt.Sprintf("%s_total", v.ProjBusinessID)] = v.Price
	}

	children := []map[string]interface{}{}
	for _, v := range a.Children {
		children = append(children, v.ToMap())
	}
	if len(children) > 0 {
		result["children"] = children
	}

	return result
}

// ToMap 转成map键值映射
func (a *ProjCostItem) ToMap() map[string]interface{} {
	result := map[string]interface{}{}
	result["tax_rate"] = a.TaxRate
	result["tax_price"] = a.TaxPrice
	result["record_id"] = a.RecordID
	result["project_id"] = a.ProjectID
	result["proj_income_id"] = a.ProjIncomeID
	result["principal"] = a.Principal
	result["price"] = a.Price
	result["name"] = a.Name
	result["memo"] = a.Memo
	result["cost_id"] = a.CostID
	for _, v := range a.BusinessList {
		result[fmt.Sprintf("%s_unit", v.ProjBusinessID)] = v.UnitPrice
		result[fmt.Sprintf("%s_total", v.ProjBusinessID)] = v.Price
	}
	return result
}

// ProjCostItemTree 项目成本项(树结构)
type ProjCostItemTree struct {
	Value    string              `json:"value" swaggo:"false,记录ID"`               // 记录ID
	Key      string              `json:"key"  swaggo:"false,记录ID"`                // 记录ID
	Title    string              `json:"title" swaggo:"false,业态名称"`               // 名称
	Children []*ProjCostItemTree `json:"children,omitempty" swaggo:"fasle,下级成本项"` //下级成本项
}

// ToTree 转换为项目支出节点成本项
func (a *ProjCostItemShow) ToTree() ProjCostItemTree {
	return ProjCostItemTree{
		Value: a.RecordID,
		Key:   a.RecordID,
		Title: a.Name,
	}
}

// ToNodeTrees 转换为项目支出节点成本项树
func (a ProjCostItemShows) ToNodeTrees() []*ProjCostItemTree {
	var list []*ProjCostItemTree
	for _, item := range a {
		if item.RecordID == "" || item.ProjectID == "" {
			continue
		}

		var tempTree ProjCostItemTree
		var children []*ProjCostItemTree

		tempTree = item.ToTree()
		if len(item.Children) == 0 {
			list = append(list, &tempTree)
			continue
		}

		children = item.Children.ToNodeTrees()
		tempTree.Children = children

		list = append(list, &tempTree)

	}

	return list
}

// ProjContractCostTree 项目合约规划成本项树结构
type ProjContractCostTree struct {
	RecordID       string                 `json:"record_id" swaggo:"false,记录ID"`           // 记录ID
	Name           string                 `json:"name" swaggo:"false,成本项名称"`               // 成本项名称
	ProjectID      string                 `json:"project_id" swaggo:"false,成本项目ID"`        // 成本项目ID
	CostID         string                 `json:"cost_id" swaggo:"false,成本项ID"`            // 成本项ID
	CostParentID   string                 `json:"cost_parent_id" swaggo:"false,成本项父级ID"`   // 父级成本项ID
	CostParentPath string                 `json:"cost_parent_path" swaggo:"false,成本项父级路经"` // 成本项父级路经
	Level          int                    `json:"level" swaggo:"false,层级"`                 // 层级
	Children       *ProjContractCostTrees `json:"children,omitempty" swaggo:"fasle,下级成本项"` // 下级成本项

}

// ProjContractCostTrees 项目合约规划成本项列表
type ProjContractCostTrees []*ProjContractCostTree

// ToContractTrees 转换为项目合约规划成本项列表
func (a ProjCostItemShows) ToContractTrees() ProjContractCostTrees {
	list := make(ProjContractCostTrees, len(a))
	for i, item := range a {
		list[i] = &ProjContractCostTree{
			RecordID:       item.RecordID,
			Name:           item.Name,
			CostParentID:   item.CostParentID,
			CostParentPath: item.CostParentPath,
			ProjectID:      item.ProjectID,
		}
	}
	return list

}

// ToTree 转换为树形结构
func (a ProjContractCostTrees) ToTree() []*ProjContractCostTree {
	mi := make(map[string]*ProjContractCostTree)
	for _, item := range a {
		mi[item.RecordID] = item
	}

	var list []*ProjContractCostTree
	for _, item := range a {
		if pitem, ok := mi[item.CostParentID]; ok {
			if pitem.Children == nil {
				var children ProjContractCostTrees
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
