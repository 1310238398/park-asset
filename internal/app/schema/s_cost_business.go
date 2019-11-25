package schema

// CostBusiness 成本项业态
type CostBusiness struct {
	RecordID   string  `json:"record_id" swaggo:"false,记录ID"`   // 记录ID
	CostID     string  `json:"cost_id" swaggo:"false,成本项ID"`    // 成本项ID
	BusinessID string  `json:"business_id" swaggo:"false,业态ID"` // 业态ID
	UnitPrice  float64 `json:"unit_price" swaggo:"false,单价"`    // 单价
	Name       string  `json:"name" swaggo:"false,业态名"`         // 业态名
}

// CostBusinessQueryParam 查询条件
type CostBusinessQueryParam struct {
	CostID     string // 成本项ID
	BusinessID string // 业态ID
}

// CostBusinessQueryOptions 查询可选参数项
type CostBusinessQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// CostBusinessQueryResult 查询结果
type CostBusinessQueryResult struct {
	Data       CostBusinesses
	PageResult *PaginationResult
}

// CostBusinesses 成本项业态列表
type CostBusinesses []*CostBusiness
