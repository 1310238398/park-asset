package schema

// Shop 商铺管理
type Shop struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID    string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	Name         string `json:"name" binding:"required" swaggo:"true,商铺号"`
	Business     string `json:"business" binding:"required" swaggo:"true,业态"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	ParentID     string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath   string `json:"parent_path" swaggo:"false,父级路径"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
}

// ShopQueryParam 查询条件
type ShopQueryParam struct {
	ProjectID  string
	Name       string
	LikeName   string
	RentStatus int
}

// ShopQueryOptions 查询可选参数项
type ShopQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ShopQueryResult 查询结果
type ShopQueryResult struct {
	Data       Shops
	PageResult *PaginationResult
}

// Shops 商铺管理列表
type Shops []*Shop
