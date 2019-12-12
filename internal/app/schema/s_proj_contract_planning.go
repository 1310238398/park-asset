package schema

// ProjContractPlanning 项目合约规划
type ProjContractPlanning struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`                     // 记录ID
	Name           string  `json:"name" binding:"required" swaggo:"false,合同名称"`       // 合同名称
	ProjectID      string  `json:"project_id" binding:"required" swaggo:"false,项目ID"` // 项目ID
	CostID         string  `json:"cost_id" binding:"required" swaggo:"false,成本项ID"`   // 成本项ID
	ContractType   int     `json:"contract_type" swaggo:"false,合同类型"`                 // 合同类型
	Information    string  `json:"information" swaggo:"false,合同包内容"`                  // 合同包内容
	PlanningPrice  float64 `json:"planning_price" swaggo:"false,规划金额"`                // 规划金额
	PlanningChange float64 `json:"planning_change" swaggo:"false,预计变更金额"`             // 预计变更金额
	Memo           string  `json:"memo" swaggo:"false,备注"`                            // 备注
}

// ProjContractPlanningQueryParam 查询条件
type ProjContractPlanningQueryParam struct {
	LikeName     string   // 合同名称(模糊查询)
	ProjectID    string   // 项目ID
	CostID       string   // 成本项ID
	ContractType int      // 合同类型
	CostIDs      []string // 成本项ID列表
}

// ProjContractPlanningQueryOptions 查询可选参数项
type ProjContractPlanningQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjContractPlanningQueryResult 查询结果
type ProjContractPlanningQueryResult struct {
	Data       ProjContractPlannings
	PageResult *PaginationResult
}

// ProjContractPlannings 项目合约规划列表
type ProjContractPlannings []*ProjContractPlanning
