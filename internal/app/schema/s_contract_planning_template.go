package schema

// ContractPlanningTemplate 合约规划模板
type ContractPlanningTemplate struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`                   // 记录ID
	Name         string `json:"name" binding:"required" swaggo:"false,合同名称"`     // 合同名称
	CostID       string `json:"cost_id" binding:"required" swaggo:"false,成本项ID"` // 成本项ID
	ContractType int    `json:"contract_type" swaggo:"false,合同类型"`               // 合同类型
	Information  string `json:"information" swaggo:"false,合同内容"`                 // 合同内容
}

// ContractPlanningTemplateQueryParam 查询条件
type ContractPlanningTemplateQueryParam struct {
	LikeName     string   // 合同名称(模糊查询)
	CostID       string   // 成本项ID
	ContractType int      // 合同类型
	CostIDs      []string // 成本项ID列表
}

// ContractPlanningTemplateQueryOptions 查询可选参数项
type ContractPlanningTemplateQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ContractPlanningTemplateQueryResult 查询结果
type ContractPlanningTemplateQueryResult struct {
	Data       ContractPlanningTemplates
	PageResult *PaginationResult
}

// ContractPlanningTemplates 合约规划模板列表
type ContractPlanningTemplates []*ContractPlanningTemplate
