package schema

import "time"

// ProjExpenditure 项目支出节点
type ProjExpenditure struct {
	RecordID            string    `json:"record_id" swaggo:"false,记录ID"`                                                                                                  // 记录ID
	Name                string    `json:"name" swaggo:"false,项目支出节点名称"`                                                                                                   // 项目支出节点名称
	ProjectID           string    `json:"project_id" swaggo:"false,成本项目ID"`                                                                                               // 成本项目ID
	StartTime           time.Time `json:"start_time" swaggo:"false,开始时间"`                                                                                                 // 开始时间
	EndTime             time.Time `json:"end_time" swaggo:"false,结束时间"`                                                                                                   // 结束时间
	ExpenditureTimeType int       `json:"expenditure_time_type" swaggo:"false,资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)"` // 资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	AccExpendRate       int       `json:"acc_expend_rate" swaggo:"false,累计支出比例"`                                                                                          // 累计支出比例
	ParentID            string    `json:"parent_id" swaggo:"false,父级ID"`                                                                                                  // 父级ID
	ParentPath          string    `json:"parent_path" swaggo:"false,父级路经"`                                                                                                // 父级路经
	TotalCost           float64   `json:"total_cost" swaggo:"false,支出总额"`                                                                                                 // 支出总额
}

// ProjExpenditureQueryParam 查询条件
type ProjExpenditureQueryParam struct {
	LikeName            string // 项目支出节点名称(模糊查询)
	ProjectID           string // 项目ID
	ExpenditureTimeType int    // 资金支出时间方式 (1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)
	ParentID            string // 父级ID
	ParentPath          string // 父级路经
}

// ProjExpenditureQueryOptions 查询可选参数项
type ProjExpenditureQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjExpenditureQueryResult 查询结果
type ProjExpenditureQueryResult struct {
	Data       ProjExpenditures
	PageResult *PaginationResult
}

// ProjExpenditures 项目支出节点列表
type ProjExpenditures []*ProjExpenditure
