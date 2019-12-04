package schema

// ProjExpendCost 项目支出节点成本项
type ProjExpendCost struct {
	RecordID          string  `json:"record_id" swaggo:"false,记录ID"`               // 记录ID
	ProjCostID        string  `json:"proj_cost_id" swaggo:"false,项目成本项ID"`         // 项目成本项ID
	ProjExpenditureID string  `json:"proj_expenditure_id" swaggo:"false,项目支出节点ID"` // 项目支出节点ID
	Amount            float64 `json:"amount" swaggo:"false,成本项支出金额"`               // 成本项支出金额
	CostPrice         float64 `json:"cost_price" swaggo:"false,成本项价格"`             // 成本项价格
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

// ToProjCostIDs 转化为项目成本项ID
func (a ProjExpendCosts) ToProjCostIDs() []string {
	list := make([]string, 0, len(a))
	temp := map[string]struct{}{}
	for _, item := range a {
		// 去重
		if _, ok := temp[item.ProjCostID]; !ok {
			temp[item.ProjCostID] = struct{}{}
			list = append(list, item.ProjCostID)
		}
	}

	return list
}

// ToProjExpendIDsByProjCost 转化为项目成本项对应的项目支出节点
func (a ProjExpendCosts) ToProjExpendIDsByProjCost(projCostIDs []string) []string {
	result := make([]string, 0, len(a))
	temp := map[string]struct{}{}

	for _, item := range a {
		for _, projCostID := range projCostIDs {
			if item.ProjCostID == projCostID {
				// 去重
				if _, ok := temp[item.ProjExpenditureID]; !ok {
					temp[item.ProjExpenditureID] = struct{}{}
					result = append(result, item.ProjExpenditureID)
				}
			}
		}
	}

	return result
}

// ToProjCostIDMap 转化为键值映射 key:ProjCostID  value:Price
func (a ProjExpendCosts) ToProjCostIDMap() map[string]float64 {
	result := make(map[string]float64, len(a))
	for _, item := range a {
		if _, ok := result[item.ProjCostID]; !ok {
			result[item.ProjCostID] = item.CostPrice
		}
	}
	return result
}
