package schema

// ProjSalesHis 项目销售计划历史
type ProjSalesHis struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjectID      string  `json:"project_id" swaggo:"false,成本项目ID"`       // 成本项目ID
	Memo           string  `json:"memo" swaggo:"false,备注"`                 // 备注
	Year           int     `json:"year" swaggo:"false,年度"`                 // 年度
	Quarter        int     `json:"quarter" swaggo:"false,季度"`              // 季度
	SaleArea       float64 `json:"sale_area" swaggo:"false,销售面积"`          // 销售面积
	ContractAmount float64 `json:"contract_amount" swaggo:"false,合同额度"`    // 合同额度
	Payback        float64 `json:"payback" swaggo:"false,销售回款"`            // 销售回款
	TaxPrice       float64 `json:"tax_price" swaggo:"false,销售税额"`          // 销售税额
	AveragePrice   float64 `json:"average_price" swaggo:"false,均价"`        // 均价
	Principal      string  `json:"principal" swaggo:"false,负责人"`           // 负责人
	ProjIncomeID   string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"` // 项目收益测算ID
	ProjBusinessID string  `json:"proj_business_id" swaggo:"false,项目业态ID"` // 项目业态ID
}

// ProjSalesHisQueryParam 查询条件
type ProjSalesHisQueryParam struct {
	ProjectID      string // 项目ID
	Year           int    // 年度
	Quarter        int    // 季度
	ProjIncomeID   string // 项目收益测算ID
	ProjBusinessID string // 项目业态ID
}

// ProjSalesHisQueryOptions 查询可选参数项
type ProjSalesHisQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjSalesHisQueryResult 查询结果
type ProjSalesHisQueryResult struct {
	Data       ProjSalesHises
	PageResult *PaginationResult
}

// ProjSalesHises 项目销售计划历史列表
type ProjSalesHises []*ProjSalesHis
