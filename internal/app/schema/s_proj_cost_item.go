package schema

// ProjCostItem 项目成本项
type ProjCostItem struct {
	RecordID     string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjectID    string  `json:"project_id" swaggo:"false,成本项目ID"`       // 成本项目ID
	CostID       string  `json:"cost_id" swaggo:"false,成本项ID"`           // 成本项ID
	TaxRate      float64 `json:"tax_rate" swaggo:"false,税率"`             // 税率
	TaxPrise     float64 `json:"tax_prise" swaggo:"false,缴税税额"`          // 缴税税额
	Prise        float64 `json:"prise" swaggo:"false,成本项价格"`             // 成本项价格
	Memo         string  `json:"memo" swaggo:"false,备注"`                 // 备注
	Principal    string  `json:"principal" swaggo:"false,负责人"`           // 负责人
	ProjIncomeID string  `json:"proj_income_id" swaggo:"false,项目收益测算ID"` // 项目收益测算ID
}

// ProjCostItemQueryParam 查询条件
type ProjCostItemQueryParam struct {
	CostID       string // 成本项ID
	ProjectID    string // 项目ID
	ProjIncomeID string // 项目收益测算ID
}

// ProjCostItemQueryOptions 查询可选参数项
type ProjCostItemQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCostItemQueryResult 查询结果
type ProjCostItemQueryResult struct {
	Data       ProjCostItems
	PageResult *PaginationResult
}

// ProjCostItems 项目成本项列表
type ProjCostItems []*ProjCostItem

// ToProjCostIDs 转换为项目成本项ID列表
func (a ProjCostItems) ToProjCostIDs() []string {
	l := make([]string, len(a))
	for _, item := range a {
		l = append(l, item.RecordID)
	}

	return l
}

// ToMap 转换为键值映射
func (a ProjCostItems) ToMap() map[string]*ProjCostItem {
	m := make(map[string]*ProjCostItem)
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}
