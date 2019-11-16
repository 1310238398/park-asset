package schema

// Expenditure 支出节点
type Expenditure struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`              // 记录ID
	Name     string `json:"name" swaggo:"false,支出节点名称"`                 // 支出节点名称
	Category string `json:"category" swaggo:"false,工作类别(大纲 里程碑 一级 二级)"` // 工作类别(大纲 里程碑 一级 二级)
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
