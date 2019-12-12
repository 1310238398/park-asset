package schema

// ProjCostHis 项目成本项历史
type ProjCostHis struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	CostID         string  `json:"cost_id" swaggo:"false,成本项ID"`           // 成本项ID
	CostName       string  `json:"cost_name"`                              //成本项名称
	CostParentID   string  `json:"cost_parent_id" swaggo:"false,父级ID"`     // 父级ID
	CostParentPath string  `json:"cost_parent_path" swaggo:"false,父级路径"`   // 父级路经
	ProjectID      string  `json:"cost_project_id" swaggo:"false,项目ID"`    // 项目ID
	TaxID          string  `json:"tax_id" swaggo:"false,税目ID"`             //税目ID
	TaxRate        float64 `json:"tax_rate" swaggo:"false,税率"`             // 税率
	TaxPrice       float64 `json:"tax_price" swaggo:"false,缴税税额"`          // 缴税税额
	Price          float64 `json:"price" swaggo:"false,价格"`                // 价格
	Memo           string  `json:"memo" swaggo:"false,备注"`                 // 备注
	Principal      string  `json:"principal" swaggo:"false,负责人"`           // 负责人
	ProjIncomeID   string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"` // 项目收益测算ID
	Label          int     `json:"label" swaggo:"false,标签"`                // 标签(1:成本科目 2:测算科目)
	BusinessData   string  `json:"business_data" swaggo:"false,业态数据"`      // 业态数据
}

// ProjCostHisQueryParam 查询条件
type ProjCostHisQueryParam struct {
	CostID       string  // 成本项ID
	Name         string  // 成本项名称
	ProjectID    string  // 项目ID
	ProjIncomeID string  // 项目收益测算ID
	CostParentID *string // 成本模板上级ID
	Label        int     //科目类型1.成本科目，2.测算科目
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
