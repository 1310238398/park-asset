package schema

// ProjCostBusiness 项目成本项业态
type ProjCostBusiness struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjBusinessID string  `json:"proj_business_id" swaggo:"false,项目业态ID"` // 项目业态ID
	ProjCostID     string  `json:"proj_cost_id" swaggo:"false,项目成本项ID"`    // 项目成本项ID
	UnitPrice      float64 `json:"unit_price" swaggo:"false,单价"`           // 单价
}

// ProjCostBusinessQueryParam 查询条件
type ProjCostBusinessQueryParam struct {
	ProjBusinessID string // 项目业态ID
	ProjCostID     string // 项目成本项ID
}

// ProjCostBusinessQueryOptions 查询可选参数项
type ProjCostBusinessQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCostBusinessQueryResult 查询结果
type ProjCostBusinessQueryResult struct {
	Data       ProjCostBusinesses
	PageResult *PaginationResult
}

// ProjCostBusinesses 项目成本项业态列表
type ProjCostBusinesses []*ProjCostBusiness
