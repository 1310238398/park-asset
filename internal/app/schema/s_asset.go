package schema

// Asset 资产管理
type Asset struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID    string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	AssetType    int    `json:"asset_type" binding:"required" swaggo:"true,资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"`
	Name         string `json:"name" binding:"required" swaggo:"true,资产名称"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
	GroupID      string `json:"group_id" swaggo:"false,资产组ID"`
}

// AssetQueryParam 查询条件
type AssetQueryParam struct {
}

// AssetQueryOptions 查询可选参数项
type AssetQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AssetQueryResult 查询结果
type AssetQueryResult struct {
	Data       Assets
	PageResult *PaginationResult
}

// Assets 资产管理列表
type Assets []*Asset
