package schema

// ProjCapitalizedInterest 项目资本化利息测算
type ProjCapitalizedInterest struct {
	RecordID                   string  `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	ProjectID                  string  `json:"project_id" binding:"required" swaggo:"false,成本项目ID"` // 成本项目ID
	Year                       int     `json:"year" swaggo:"false,年度"`                              // 年度
	Quarter                    int     `json:"quarter" swaggo:"false,季度"`                           // 季度
	SalesPayback               float64 `json:"sales_payback" swaggo:"false,销售回款"`                   // 销售回款
	CostExpenditure            float64 `json:"cost_expenditure" swaggo:"false,成本支出"`                // 成本支出
	MarginOut                  float64 `json:"margin_out" swaggo:"false,预售保证金支出"`                   // 预售保证金支出
	MarginBack                 float64 `json:"margin_back" swaggo:"false,预售保证金返还"`                  // 预售保证金返还
	TaxRate                    float64 `json:"tax_rate" swaggo:"false,纳税比例"`                        // 纳税比例
	TaxPayment                 float64 `json:"tax_payment" swaggo:"false,税金缴纳"`                     // 税金缴纳
	FundsOccupiedAmount        float64 `json:"funds_occupied_amount" swaggo:"false,资本占用金额"`         // 资本占用金额
	AccumulativeOccupancyFunds float64 `json:"accumulative_occupancy_funds" swaggo:"false,累计占用金额"`  // 累计占用金额
	InterestRate               float64 `json:"interest_rate" swaggo:"false,资金利率"`                   // 资金利率
	FundPossessionCost         float64 `json:"fund_possession_cost" swaggo:"false,资金占用费"`           // 资金占用费
	Memo                       string  `json:"memo" swaggo:"false,备注"`                              // 备注
	Principal                  string  `json:"principal" swaggo:"false,负责人"`                        // 负责人
	ProjIncomeID               string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"`              // 项目收益测算ID
	TaxID                      string  `json:"tax_id" swaggo:"false,税目ID"`                          // 税目ID
}

// ProjCapitalizedInterestQueryParam 查询条件
type ProjCapitalizedInterestQueryParam struct {
	ProjectID    string
	Year         int
	Quarter      int
	ProjIncomeID string // 收益测算ID
	TaxID        string // 税目ID
}

// ProjCapitalizedInterestQueryOptions 查询可选参数项
type ProjCapitalizedInterestQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCapitalizedInterestQueryResult 查询结果
type ProjCapitalizedInterestQueryResult struct {
	Data       ProjCapitalizedInterests
	PageResult *PaginationResult
}

// ProjCapitalizedInterests 项目资本化利息测算列表
type ProjCapitalizedInterests []*ProjCapitalizedInterest
