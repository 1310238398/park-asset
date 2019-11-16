package schema

// TaxCalculation 税目计算表
type TaxCalculation struct {
	RecordID           string `json:"record_id" swaggo:"false,记录ID"`            // 记录ID
	Category           string `json:"category" swaggo:"false,类别"`               // 类别
	Name               string `json:"name" swaggo:"false,税目名称"`                 // 税目名称
	CalculationFormula string `json:"calculation_formula" swaggo:"false,计算公式"`  // 计算公式
	Type               int    `json:"type" swaggo:"false,税率类型(1:含税计算 2:不含税计算)"` // 税率类型(1:含税计算 2:不含税计算)
	TaxRate            int    `json:"tax_rate" swaggo:"false,税率"`               // 税率
	Memo               string `json:"memo" swaggo:"false,备注"`                   // 备注
}

// TaxCalculationQueryParam 查询条件
type TaxCalculationQueryParam struct {
	Category string // 类别
	Name     string // 税目名称
	Type     int    // 税率类型(1:含税计算 2:不含税计算)
}

// TaxCalculationQueryOptions 查询可选参数项
type TaxCalculationQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// TaxCalculationQueryResult 查询结果
type TaxCalculationQueryResult struct {
	Data       TaxCalculations
	PageResult *PaginationResult
}

// TaxCalculations 税目计算表列表
type TaxCalculations []*TaxCalculation
