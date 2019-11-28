package schema

// ProjSalesPlan 项目销售计划
type ProjSalesPlan struct {
	RecordID         string  `json:"record_id" swaggo:"false,记录ID"`            // 记录ID
	ProjectID        string  `json:"project_id" swaggo:"false,成本项目ID"`         // 成本项目ID
	Memo             string  `json:"memo" swaggo:"false,备注"`                   // 备注
	Year             int     `json:"year" swaggo:"false,年度"`                   // 年度
	Quarter          int     `json:"quarter" swaggo:"false,季度"`                // 季度
	SaleArea         float64 `json:"sale_area" swaggo:"false,销售面积"`            // 销售面积
	ContractAmount   float64 `json:"contract_amount" swaggo:"false,合同额度"`      // 合同额度
	Payback          float64 `json:"payback" swaggo:"false,销售回款"`              // 销售回款
	TaxPrice         float64 `json:"tax_price" swaggo:"false,销售税额"`            // 销售税额
	AveragePrice     float64 `json:"average_price" swaggo:"false,均价"`          // 均价
	Principal        string  `json:"principal" swaggo:"false,负责人"`             // 负责人
	ProjIncomeID     string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"`   // 项目收益测算ID
	ProjBusinessID   string  `json:"proj_business_id" swaggo:"false,项目业态ID"`   // 项目业态ID
	ProjBusinessName string  `json:"proj_business_name" swaggo:"false,项目业态名称"` // 项目业态名称
	TaxID            string  `json:"tax_id" swaggo:"false, 税目ID"`              // 税目ID
}

// ProjSalesPlanQueryParam 查询条件
type ProjSalesPlanQueryParam struct {
	ProjectID      string // 项目ID
	Year           int    // 年度
	Quarter        int    // 季度
	ProjIncomeID   string // 项目收益测算ID
	ProjBusinessID string // 项目业态ID
}

// ProjSalesPlanQueryOptions 查询可选参数项
type ProjSalesPlanQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjSalesPlanQueryResult 查询结果
type ProjSalesPlanQueryResult struct {
	Data       ProjSalesPlans
	PageResult *PaginationResult
}

// ProjSalesPlans 项目销售计划列表
type ProjSalesPlans []*ProjSalesPlan

// ToProjBusinFormatIDs 转换为项目业态列表
func (a ProjSalesPlans) ToProjBusinFormatIDs() []string {
	list := make([]string, len(a))
	for _, item := range a {
		list = append(list, item.ProjBusinessID)
	}
	return list
}

// // FillData 填充业态名称
// func (a ProjSalesPlans) FillData(m map[string]*ProjBusinessFormat) {
// 	for _, item := range a {
// 		if projBusinItem, ok := m[item.ProjBusinessID]; ok {
// 			item.ProjBusinessName = projBusinItem.Name

// 		}
// 	}
// }

// FillData 填充业态名称
func (a ProjSalesPlans) FillData(list ProjBusinessFormats) {
	for _, item := range a {
		for _, projBusin := range list {
			if item.ProjBusinessID == projBusin.RecordID {
				item.ProjBusinessName = projBusin.Name
			}
			break
		}
	}
}
