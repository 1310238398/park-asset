package schema

// CostItem 成本项
type CostItem struct {
	RecordID      string      `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	ParentID      string      `json:"parent_id" swaggo:"false,父级ID"`                       // 父级ID
	ParentPath    string      `json:"parent_path" swaggo:"false,父级路经"`                     // 父级路经
	Level         int         `json:"level" swaggo:"false,层级"`                             // 层级
	Name          string      `json:"name" swaggo:"false,业态名称"`                            // 名称
	TaxID         string      `json:"tax_id" swaggo:"false,税目ID"`                          // 税目ID
	Status        int         `json:"status" swaggo:"false,状态(1:启用2:停用)"`                  // 状态(1:启用2:停用)
	Label         int         `json:"label" swaggo:"false,标签(1:成本科目 2:测算科目)"`              // 标签(1:成本科目 2:测算科目)
	CalculateType int         `json:"calculate_type" swaggo:"false,计算方式(1.单价算总价,2.总价算单价)"` //计算方式(1.单价算总价,2.总价算单价)
	InLandTax     int         `json:"in_land_tax" swaggo:"false,是否计入土地增值税(1.计入,2.不计入)"`    //是否计入土地增值税(1.计入,2.不计入)
	Children      []*CostItem `json:"cost_item" swaggo:"false,下级列表"`                       //下级列表
}

// CostItemQueryParam 查询条件
type CostItemQueryParam struct {
	ParentID   string // 父级ID
	ParentPath string // 父级路经
	Level      int    // 层级
	LikeName   string // 成本项名称(模糊查询)
	Name       string // 成本项名称
}

// CostItemQueryOptions 查询可选参数项
type CostItemQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// CostItemQueryResult 查询结果
type CostItemQueryResult struct {
	Data       CostItems
	PageResult *PaginationResult
}

// CostItems 成本项列表
type CostItems []*CostItem
