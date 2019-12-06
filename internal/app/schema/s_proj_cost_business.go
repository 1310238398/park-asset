package schema

// ProjCostBusiness 项目成本项业态
type ProjCostBusiness struct {
	RecordID       string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjBusinessID string  `json:"proj_business_id" swaggo:"false,项目业态ID"` // 项目业态ID
	ProjCostID     string  `json:"proj_cost_id" swaggo:"false,项目成本项ID"`    // 项目成本项ID
	UnitPrice      float64 `json:"unit_price" swaggo:"false,单价"`           // 单价
	Price          float64 `json:"price" swaggo:"false,总价"`                //总价
}

// ProjCostBusinessQueryParam 查询条件
type ProjCostBusinessQueryParam struct {
	ProjBusinessID string // 项目业态ID
	ProjCostID     string // 项目成本项ID
}

// ProjCostBusinessQueryOptions 查询可选参数项
type ProjCostBusinessQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjCostBusinessQueryResult 查询结果
type ProjCostBusinessQueryResult struct {
	Data       ProjCostBusinesses
	PageResult *PaginationResult
}

// ProjCostBusinesses 项目成本项业态列表
type ProjCostBusinesses []*ProjCostBusiness

// ToProjBusinIDs 转化为项目业态ID列表
func (a ProjCostBusinesses) ToProjBusinIDs() []string {
	list := make([]string, 0, len(a))
	temp := map[string]struct{}{}
	for _, item := range a {
		// 去重
		if _, ok := temp[item.ProjBusinessID]; !ok {
			temp[item.ProjBusinessID] = struct{}{}
			list = append(list, item.ProjBusinessID)
		}
	}

	return list
}

// FillPrice 填充价格
func (a ProjCostBusinesses) FillPrice(m map[string]*ProjBusinessFormat) ProjCostBusinesses {
	for _, item := range a {
		if pBusinItem, ok := m[item.ProjBusinessID]; ok {
			item.Price = item.UnitPrice * pBusinItem.FloorArea
		}
	}

	return a
}
