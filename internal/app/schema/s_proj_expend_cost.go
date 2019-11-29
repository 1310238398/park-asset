package schema

// ProjExpendCost 项目支出节点成本项
type ProjExpendCost struct {
	RecordID          string  `json:"record_id" swaggo:"false,记录ID"`               // 记录ID
	ProjCostID        string  `json:"proj_cost_id" swaggo:"false,项目成本项ID"`         // 项目成本项ID
	ProjExpenditureID string  `json:"proj_expenditure_id" swaggo:"false,项目支出节点ID"` // 项目支出节点ID
	Amount            float64 `json:"amount" swaggo:"false,成本项支出金额"`               // 成本项支出金额
}

// ProjExpendCostQueryParam 查询条件
type ProjExpendCostQueryParam struct {
	ProjCostID            string   // 项目成本项ID
	ProjCostIDs           []string // 项目成本项ID列表
	ProjExpenditureID     string   // 项目支出节点ID
	ProjExpenditureIDs    []string // 项目支出节点ID列表
	NotProjCostIDs        []string // 去除的成本项ID列表
	NotProjExpenditureIDs []string // 去除的项目支出节点ID列表
	ProjectID             string   // 项目ID
}

// ProjExpendCostQueryOptions 查询可选参数项
type ProjExpendCostQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjExpendCostQueryResult 查询结果
type ProjExpendCostQueryResult struct {
	Data       ProjExpendCosts
	PageResult *PaginationResult
}

// ProjExpendCosts 项目支出节点成本项列表
type ProjExpendCosts []*ProjExpendCost

// ToProjExpendCostsMap 转化支出节点项目成本项列表Map key:ProjCostID value: []*ProjExpendCost
func (a ProjExpendCosts) ToProjExpendCostsMap() map[string]ProjExpendCosts {
	m := make(map[string]ProjExpendCosts)
	for _, item := range a {
		var list []*ProjExpendCost
		for _, projExpCostItem := range a {
			m[item.ProjCostID] = list
			if item.ProjCostID == projExpCostItem.ProjCostID {
				list = append(list, projExpCostItem)
			}

		}
	}

	return m

}

// ToProjCostIDs 转换位项目成本项ID
func (a ProjExpendCosts) ToProjCostIDs() []string {
	list := make([]string, len(a))
	for i, item := range a {
		list[i] = item.RecordID
	}
	return list
}
