package schema

import (
	"fmt"
	"time"
)

// ProjIncomeCalculation 项目收益测算
type ProjIncomeCalculation struct {
	RecordID    string    `json:"record_id" swaggo:"false,记录ID"`                                         // 记录ID
	VersionName string    `json:"version_name" swaggo:"false,版本名称"`                                      // 版本名称
	Sequence    int       `json:"sequence" swaggo:"false,排序值"`                                           // 排序值
	Principal   string    `json:"principal" swaggo:"false,负责人"`                                          // 负责人
	DoneTime    time.Time `json:"done_time" swaggo:"false,生成时间"`                                         // 生成时间
	ProjectID   string    `json:"project_id" swaggo:"false,成本项目ID"`                                      // 成本项目ID
	Flag        int       `json:"flag" swaggo:"false,标记(1:当前版本 2:历史版本 3:审核中 4:最终版本(目标成本) 领导审核后 不得轻易修改)"` // 标记(1:当前版本 2:历史版本 3:最终版本 4:目标成本 领导审核后 不得轻易修改)

	TotalSale            float64 `json:"total_sale" swaggo:"false,总销售收入"`              // 总销售收入
	TotalSaleMemo        string  `json:"total_sale_memo" swaggo:"false,总销售收入备注"`       // 总销售收入备注
	SaledTax             float64 `json:"saled_tax" swaggo:"false,销售税税额"`               // 销售税税额
	SaledTaxMemo         string  `json:"saled_tax_memo" swaggo:"false,销售税税额备注"`        // 销售税税额备注
	TotalCost            float64 `json:"total_cost" swaggo:"false,开发总成本"`              // 开发总成本
	TotalCostMemo        string  `json:"total_cost_memo" swaggo:"false,开发总成本备注"`       // 开发总成本备注
	LandTransferFee      float64 `json:"land_transfer_fee" swaggo:"false,土地出让金"`       // 土地出让金
	DeedLandTax          float64 `json:"deed_land_tax" swaggo:"false,契税及土地使用税"`        // 契税及土地使用税
	CapitalizedInterest  float64 `json:"capitalized_interest" swaggo:"false,资本化利息"`    // 资本化利息
	InputTax             float64 `json:"input_tax" swaggo:"false,进项税税额"`               // 进项税税额
	ValueAddTax          float64 `json:"value_add_tax" swaggo:"false,增值税额"`            // 增值税额
	ValueAddTaxSurcharge float64 `json:"value_add_tax_surcharge" swaggo:"false,增值税附加"` // 增值税附加
	LandValueAddedTax    float64 `json:"land_value_added_tax" swaggo:"false,土地增值税"`    // 土地增值税
	ProfitBeforeTax      float64 `json:"profit_before_tax" swaggo:"false,税前利润"`        // 税前利润
	ProfitBeforeTaxRate  float64 `json:"profit_before_tax_rate" swaggo:"false,税前利润率"`  // 税前利润率
	CorporateIncomeTax   float64 `json:"corporate_income_tax" swaggo:"false,企业所得税"`    // 企业所得税
	NetProfit            float64 `json:"net_profit" swaggo:"false,项目净利润"`              // 项目净利润
	NetProfitRate        float64 `json:"net_profit_rate" swaggo:"false,净利润率"`          // 净利润率
	PaybackRate          float64 `json:"payback_rate" swaggo:"false,投资回报率"`            // 投资回报率
}

type ProjIncomeItem struct {
	Index string `json:"index" binding:"required" swaggo:"false,序号"`
	Name  string `json:"name" swaggo:"false,项目名称"`
	Value string `json:"value" swaggo:"false,值"`
	Memo  string `json:"memo" swaggo:"false,备注"`
}

type ProjIncomeCalculationResult struct {
	Info *ProjIncomeCalculation `json:"info"`
	List []*ProjIncomeItem      `json:"list"`
}

func (a *ProjIncomeCalculation) ToProjIncomeCalculationResult() *ProjIncomeCalculationResult {
	result := new(ProjIncomeCalculationResult)
	result.Info = a
	result.List = []*ProjIncomeItem{
		&ProjIncomeItem{
			Index: "1",
			Name:  "销售收入",
			Value: fmt.Sprintf("%.2f", a.TotalSale),
			Memo:  a.TotalSaleMemo,
		},
		&ProjIncomeItem{
			Index: "1.1",
			Name:  "销售税税额",
			Value: fmt.Sprintf("%.2f", a.SaledTax),
			Memo:  a.SaledTaxMemo,
		}, &ProjIncomeItem{
			Index: "2",
			Name:  "开发成本",
			Value: fmt.Sprintf("%.2f", a.TotalCost),
			Memo:  a.TotalCostMemo,
		},
		&ProjIncomeItem{
			Index: "2.1",
			Name:  "土地出让金",
			Value: fmt.Sprintf("%.2f", a.LandTransferFee),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "2.2",
			Name:  "契税及土地使用税",
			Value: fmt.Sprintf("%.2f", a.DeedLandTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "2.3",
			Name:  "资本化利息",
			Value: fmt.Sprintf("%.2f", a.CapitalizedInterest),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "2.4",
			Name:  "进项税税额",
			Value: fmt.Sprintf("%.2f", a.InputTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "3",
			Name:  "增值税额",
			Value: fmt.Sprintf("%.2f", a.ValueAddTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "4",
			Name:  "增值税附加",
			Value: fmt.Sprintf("%.2f", a.ValueAddTaxSurcharge),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "5",
			Name:  "土地增值税",
			Value: fmt.Sprintf("%.2f", a.LandValueAddedTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "6",
			Name:  "项目税前利润",
			Value: fmt.Sprintf("%.2f", a.ProfitBeforeTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "7",
			Name:  "税前利润率",
			Value: fmt.Sprintf("%.2f%%", a.ProfitBeforeTaxRate*100),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "8",
			Name:  "企业所得税",
			Value: fmt.Sprintf("%.2f", a.CorporateIncomeTax),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "9",
			Name:  "项目净利润",
			Value: fmt.Sprintf("%.2f", a.NetProfit),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "10",
			Name:  "项目净利率",
			Value: fmt.Sprintf("%.2f%%", a.NetProfitRate*100),
			Memo:  "",
		},
		&ProjIncomeItem{
			Index: "11",
			Name:  "总投资回报率",
			Value: fmt.Sprintf("%.2f", a.PaybackRate),
			Memo:  "",
		},
	}
	return result
}

// ProjIncomeCalculationQueryParam 查询条件
type ProjIncomeCalculationQueryParam struct {
	LikeVersionName string // 版本名称(模糊查询)
	Sequence        int    // 排序值
	ProjectID       string // 项目ID
	Flag            int    // 标记(1:当前版本 2:历史版本 3:最终版本 领导审核后 不得轻易修改)
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

// ProjVersionValue 成本核算版本值
type ProjVersionValue struct {
	VersionID string `json:"version_id"` //版本ID
	Version   string `json:"version"`    //版本名
	Value     string `json:"value"`      //版本值
}

// ProjCompareItem 成本核算对比项
type ProjCompareItem struct {
	RecordID string              `json:"record_id"` //项目ID
	Type     int                 `json:"type"`      //项目类型(1.收益测算，2.成本测算，3.销售计划，4.资本化利息)
	Name     string              `json:"name"`      //项目名
	Versions []*ProjVersionValue `json:"versions"`  //版本信息
	Memo     string              `json:"memo"`      //版本注释
	Children []*ProjCompareItem  `json:"children"`  //下级目录
}

// HasChange 对比项是否有变化
func (a *ProjCompareItem) HasChange() bool {
	if len(a.Versions) == 0 {
		return false
	}
	value := a.Versions[0].Value

	for _, v := range a.Versions {
		if v.Value != value {
			return true
		}
	}
	return false
}

// VersionRequest 版本请求
type VersionRequest struct {
	Name   string             `json:"name"`
	Change []*ProjCompareItem `json:"change"`
}
