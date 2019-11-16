package schema

import "time"

// ProjIncomeCalculation 项目收益测算
type ProjIncomeCalculation struct {
	RecordID             string    `json:"record_id" swaggo:"false,记录ID"`                                    // 记录ID
	VersionName          string    `json:"version_name" swaggo:"false,版本名称"`                                 // 版本名称
	Memo                 string    `json:"memo" swaggo:"false,备注"`                                           // 备注
	Sequence             int       `json:"sequence" swaggo:"false,排序值"`                                      // 排序值
	TotalSale            float64   `json:"total_sale" swaggo:"false,总销售收入"`                                  // 总销售收入
	SaledTax             float64   `json:"saled_tax" swaggo:"false,销售税税额"`                                   // 销售税税额
	TotalCost            float64   `json:"total_cost" swaggo:"false,开发总成本"`                                  // 开发总成本
	LandTransferFee      float64   `json:"land_transfer_fee" swaggo:"false,土地出让金"`                           // 土地出让金
	NetProfit            float64   `json:"net_profit" swaggo:"false,项目净利润"`                                  // 项目净利润
	PaybackRate          float64   `json:"payback_rate" swaggo:"false,投资回报率"`                                // 投资回报率
	Principal            string    `json:"principal" swaggo:"false,负责人"`                                     // 负责人
	DoneTime             time.Time `json:"done_time" swaggo:"false,生成时间"`                                    // 生成时间
	ProjectID            string    `json:"project_id" swaggo:"false,成本项目ID"`                                 // 成本项目ID
	DeedTax              float64   `json:"deed_tax" swaggo:"false,契税"`                                       // 契税
	LandUseTax           float64   `json:"land_use_tax" swaggo:"false,土地使用税"`                                // 土地使用税
	CapitalizedInterest  float64   `json:"capitalized_interest" swaggo:"false,资本化利息"`                        // 资本化利息
	Flag                 int       `json:"flag" swaggo:"false,标记(1:当前版本 2:历史版本 3:最终版本 4:目标成本 领导审核后 不得轻易修改)"` // 标记(1:当前版本 2:历史版本 3:最终版本 4:目标成本 领导审核后 不得轻易修改)
	InputTax             float64   `json:"input_tax" swaggo:"false,进项税税额"`                                   // 进项税税额
	ValueAddTax          float64   `json:"value_add_tax" swaggo:"false,增值税额"`                                // 增值税额
	ValueAddTaxSurcharge float64   `json:"value_add_tax_surcharge" swaggo:"false,增值税附加"`                     // 增值税附加
	LandValueAddedTax    float64   `json:"land_value_added_tax" swaggo:"false,土地增值税"`                        // 土地增值税
	CorporateIncomeTax   float64   `json:"corporate_income_tax" swaggo:"false,企业所得税"`                        // 企业所得税
	ProfitBeforeTax      float64   `json:"profit_before_tax" swaggo:"false,税前利润"`                            // 税前利润
	ProfitBeforeTaxRate  float64   `json:"profit_before_tax_rate" swaggo:"false,税前利润率"`                      // 税前利润率
	NetProfitRate        float64   `json:"net_profit_rate" swaggo:"false,净利润率"`                              // 净利润率
}

// ProjIncomeCalculationQueryParam 查询条件
type ProjIncomeCalculationQueryParam struct {
	LikeVersionName string // 版本名称(模糊查询)
	Sequence        int    // 排序值
	ProjectID       string // 项目ID
	Flag            int    //  标记(1:当前版本 2:历史版本 3:最终版本 4:目标成本 领导审核后 不得轻易修改)
}

// ProjIncomeCalculationQueryOptions 查询可选参数项
type ProjIncomeCalculationQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjIncomeCalculationQueryResult 查询结果
type ProjIncomeCalculationQueryResult struct {
	Data       ProjIncomeCalculations
	PageResult *PaginationResult
}

// ProjIncomeCalculations 项目收益测算列表
type ProjIncomeCalculations []*ProjIncomeCalculation
