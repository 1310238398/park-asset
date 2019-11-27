package schema

// LandAppreciationTax 土地增值税
type LandAppreciationTax struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`           // 记录ID
	ProjectID      string  `json:"project_id" swaggo:"false,项目ID"`          //项目ID
	Income         float64 `json:"income" swaggo:"false,不含税销售收入"`           // 不含税销售收入
	Cost           float64 `json:"cost" swaggo:"false,扣除项金额"`               // 扣除项金额
	AdditionalTax  float64 `json:"additional_tax" swaggo:"false,附加税"`       // 附加税
	FinanceAddRate float64 `json:"finance_add_rate" swaggo:"false,财务费用附加率"` // 财务费用附加率
	ManageAddRate  float64 `json:"manage_add_rate" swaggo:"false,管理费用附加率"`  //管理费用附加率
	CostAddRate    float64 `json:"cost_add_rate" swaggo:"false,成本附加率"`      // 成本附加率
	Rate           float64 `json:"rate" swaggo:"false,适用税率"`                // 适用税率
	Tax            float64 `json:"tax" swaggo:"false,土地增值税"`                // 土地增值税
}

// LandAppreciationTaxQueryParam 查询条件
type LandAppreciationTaxQueryParam struct {
}

// LandAppreciationTaxQueryOptions 查询可选参数项
type LandAppreciationTaxQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// LandAppreciationTaxQueryResult 查询结果
type LandAppreciationTaxQueryResult struct {
	Data       LandAppreciationTaxes
	PageResult *PaginationResult
}

// LandAppreciationTaxes 土地增值税列表
type LandAppreciationTaxes []*LandAppreciationTax
