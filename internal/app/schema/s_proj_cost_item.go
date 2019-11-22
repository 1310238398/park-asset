package schema

// ProjCostItem 项目成本项
type ProjCostItem struct {
	RecordID     string              `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjectID    string              `json:"project_id" swaggo:"false,成本项目ID"`       // 成本项目ID
	CostID       string              `json:"cost_id" swaggo:"false,成本项ID"`           // 成本项ID
	TaxRate      float64             `json:"tax_rate" swaggo:"false,税率"`             // 税率
	TaxPrice     float64             `json:"tax_price" swaggo:"false,缴税税额"`          // 缴税税额
	Price        float64             `json:"price" swaggo:"false,成本项价格"`             // 成本项价格
	Memo         string              `json:"memo" swaggo:"false,备注"`                 // 备注
	Principal    string              `json:"principal" swaggo:"false,负责人"`           // 负责人
	ProjIncomeID string              `json:"proj_income_id" swaggo:"false,项目收益测算ID"` // 项目收益测算ID
	BusinessList []*ProjCostBusiness `json:"business_list" swaggo:"false,成本下业态列表"`   // 成本下业态列表
}

// ProjCostItem 项目成本项展示
type ProjCostItemShow struct {
	RecordID       string              `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	ProjectID      string              `json:"project_id" swaggo:"false,成本项目ID"`                    // 成本项目ID
	CostID         string              `json:"cost_id" swaggo:"false,成本项ID"`                        // 成本项ID
	CostParentID   string              `json:"cost_parent_id" swaggo:"false,成本项父级ID"`               //父级成本项ID
	CostParentPath string              `json:"cost_parent_path" swaggo:"false,成本项父级路经"`             //成本项父级路经
	Name           string              `json:"name" swaggo:"false,业态名称"`                            // 名称
	TaxID          string              `json:"tax_id" swaggo:"false,税目ID"`                          // 税目ID
	Label          int                 `json:"label" swaggo:"false,标签(1:成本科目 2:测算科目)"`              // 标签(1:成本科目 2:测算科目)
	CalculateType  int                 `json:"calculate_type" swaggo:"false,计算方式(1.单价算总价,2.总价算单价)"` //计算方式(1.单价算总价,2.总价算单价)
	TaxRate        float64             `json:"tax_rate" swaggo:"false,税率"`                          // 税率
	TaxPrice       float64             `json:"tax_price" swaggo:"false,缴税税额"`                       // 缴税税额
	Price          float64             `json:"price" swaggo:"false,成本项价格"`                          // 成本项价格
	Memo           string              `json:"memo" swaggo:"false,备注"`                              // 备注
	Principal      string              `json:"principal" swaggo:"false,负责人"`                        // 负责人
	ProjIncomeID   string              `json:"proj_income_id" swaggo:"false,项目收益测算ID"`              // 项目收益测算ID
	BusinessList   []*ProjCostBusiness `json:"business_list" swaggo:"false,成本下业态列表"`                // 成本下业态列表
	Children       []*ProjCostItemShow `json:"children,omitempty" swaggo:"fasle,下级成本项"`             //下级成本项
	Editable       bool                `json:"editable" swaggo:"false,可编辑"`
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

// ProjCostItemShows 项目成本项展示列表
type ProjCostItemShows []*ProjCostItemShow
