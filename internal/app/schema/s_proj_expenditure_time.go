package schema

// ProjExpenditureTime 项目支出节点时间表
type ProjExpenditureTime struct {
	RecordID          string  `json:"record_id" swaggo:"false,记录ID"`               // 记录ID
	Year              int     `json:"year" swaggo:"false,年度"`                      // 年度
	Quarter           int     `json:"quarter" swaggo:"false,季度"`                   // 季度
	Month             int     `json:"month" swaggo:"false,月份"`                     // 月份
	Day               int     `json:"day" swaggo:"false,天"`                        // 天
	ExpenditureAmount float64 `json:"expenditure_amount" swaggo:"false,支出金额"`      // 支出金额
	ProjExpenditureID string  `json:"proj_expenditure_id" swaggo:"false,项目支出节点ID"` // 项目支出节点ID
}

// ProjExpenditureTimeQueryParam 查询条件
type ProjExpenditureTimeQueryParam struct {
	Year              int    // 年度
	Quarter           int    // 季度
	Month             int    // 月份
	Day               int    // 天
	ProjExpenditureID string // 项目支出节点ID
	ProjectID         string // 项目ID
}

// ProjExpenditureTimeQueryOptions 查询可选参数项
type ProjExpenditureTimeQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjExpenditureTimeQueryResult 查询结果
type ProjExpenditureTimeQueryResult struct {
	Data       ProjExpenditureTimes
	PageResult *PaginationResult
}

// ProjExpenditureTimes 项目支出节点时间表列表
type ProjExpenditureTimes []*ProjExpenditureTime
