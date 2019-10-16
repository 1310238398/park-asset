package schema

// AgriculturalMarket 农贸市场管理
type AgriculturalMarket struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID    string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	Name         string `json:"name" binding:"required" swaggo:"true,摊位号"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	ParentID     string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath   string `json:"parent_path" swaggo:"false,父级路径"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
}

// AgriculturalMarketQueryParam 查询条件
type AgriculturalMarketQueryParam struct {
	ProjectID  string
	Name       string
	LikeName   string
	RentStatus int
}

// AgriculturalMarketQueryOptions 查询可选参数项
type AgriculturalMarketQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AgriculturalMarketQueryResult 查询结果
type AgriculturalMarketQueryResult struct {
	Data       AgriculturalMarkets
	PageResult *PaginationResult
}

// AgriculturalMarkets 农贸市场管理列表
type AgriculturalMarkets []*AgriculturalMarket
