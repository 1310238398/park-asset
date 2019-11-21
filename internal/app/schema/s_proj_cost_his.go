package schema

// ProjCostHis 项目成本项历史
type ProjCostHis struct {
	RecordID     string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	CostID       string  `json:"cost_id" swaggo:"false,成本项ID"`           // 成本项ID
	ProjectID    string  `json:"project_id" swaggo:"false,项目ID"`         // 项目ID
	TaxRate      int     `json:"tax_rate" swaggo:"false,税率"`             // 税率
	TaxPrise     float64 `json:"tax_prise" swaggo:"false,缴税税额"`          // 缴税税额
	Prise        float64 `json:"prise" swaggo:"false,价格"`                // 价格
	Memo         string  `json:"memo" swaggo:"false,备注"`                 // 备注
	Principal    string  `json:"principal" swaggo:"false,负责人"`           // 负责人
	ProjIncomeID string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"` // 项目收益测算ID
	ParentID     string  `json:"parent_id" swaggo:"false,父级ID"`          // 父级ID
	ParentPath   string  `json:"parent_path" swaggo:"false,父级路径"`        // 父级路经
}

// ProjCostHisQueryParam 查询条件
type ProjCostHisQueryParam struct {
	CostID       string // 成本项ID
	ProjectID    string // 项目ID
	ProjIncomeID string // 项目收益测算ID
}

// ProjCostHisQueryOptions 查询可选参数项
type ProjCostHisQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCostHisQueryResult 查询结果
type ProjCostHisQueryResult struct {
	Data       ProjCostHises
	PageResult *PaginationResult
}

// ProjCostHises 项目成本项历史列表
type ProjCostHises []*ProjCostHis
