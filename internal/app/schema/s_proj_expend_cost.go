package schema

// ProjExpendCost 项目支出节点成本项
type ProjExpendCost struct {
	RecordID          string `json:"record_id" swaggo:"false,记录ID"`               // 记录ID
	ProjCostID        string `json:"proj_cost_id" swaggo:"false,项目成本项ID"`         // 项目成本项ID
	ProjExpenditureID string `json:"proj_expenditure_id" swaggo:"false,项目支出节点ID"` // 项目支出节点ID
}

// ProjExpendCostQueryParam 查询条件
type ProjExpendCostQueryParam struct {
	ProjCostID        string // 项目成本项ID
	ProjExpenditureID string // 项目支出节点ID
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
