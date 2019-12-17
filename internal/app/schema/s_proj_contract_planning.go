package schema

// ProjContractPlanning 项目合约规划
type ProjContractPlanning struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`                                 // 记录ID
	Name           string  `json:"name" binding:"required" swaggo:"false,合同名称"`                   // 合同名称
	ProjectID      string  `json:"project_id" binding:"required" swaggo:"false,项目ID"`             // 项目ID
	CostID         string  `json:"cost_id" binding:"required" swaggo:"false,成本项ID"`               // 成本项ID
	ContractType   int     `json:"contract_type" swaggo:"false,合同类型"`                             // 合同类型
	Information    string  `json:"information" swaggo:"false,合同包内容"`                              // 合同包内容
	PlanningPrice  float64 `json:"planning_price" swaggo:"false,规划金额"`                            // 规划金额
	PlanningChange float64 `json:"planning_change" swaggo:"false,预计变更金额"`                         // 预计变更金额
	Memo           string  `json:"memo" swaggo:"false,备注"`                                        // 备注
	CostNamePath   string  `json:"cost_name_path" swaggo:"false,成本名称路经"`                          // 成本名称路经
	SignedAmount   float64 `json:"signed_amount" swaggo:"false,合同签订金额"`                           // 合同签订金额
	ReferStatus    int     `json:"refer_status" swaggo:"false,合同签订引用合约规划状态:(1:已引用 2:未引用 3:部分引用)"` // 1:已引用 2:未引用 3:部分引用
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

// PContractStatistic 项目合约规划统计数据
type PContractStatistic struct {
	TargetCost   float64 `json:"target_cost" swaggo:"false,目标成本"`      // 目标成本
	PlanAmount   float64 `json:"plan_amount" swaggo:"false,规划金额"`      // 规划金额
	LeftAmount   float64 `json:"left_amount" swaggo:"false,规划余量"`      // 规划余量
	Count        int     `json:"count" swaggo:"false,合约规划数"`           // 合约规划数
	UnReferCount int     `json:"un_refer_count" swaggo:"false,未引用规划数"` // 未引用规划数
}
