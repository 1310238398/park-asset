package schema

// Statistic 统计查询
type Statistic struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`
	Creator  string `json:"creator" swaggo:"false,创建者"`
}

// StatisticQueryParam 查询条件
type StatisticQueryParam struct {
}

// StatisticQueryOptions 查询可选参数项
type StatisticQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// StatisticQueryResult 查询结果
type StatisticQueryResult struct {
	Data       Statistics
	PageResult *PaginationResult
}

// Statistics 统计查询列表
type Statistics []*Statistic
