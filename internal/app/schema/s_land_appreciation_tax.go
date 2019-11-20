package schema

// LandAppreciationTax 土地增值税
type LandAppreciationTax struct {
	RecordID        string  `json:"record_id" swaggo:"false,记录ID"`            // 记录ID
	SaledArea       float64 `json:"saled_area" swaggo:"false,销售面积"`           // 销售面积
	ValueAdded      float64 `json:"value_added" swaggo:"false,增值额"`           // 增值额
	ValueAddedRate  float64 `json:"value_added_rate" swaggo:"false,增值率"`      // 增值率
	Tax             float64 `json:"tax" swaggo:"false,土地增值税"`                 // 土地增值税
	SaledWithoutTax float64 `json:"saled_without_tax" swaggo:"false,不含税销售收入"` // 不含税销售收入
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
