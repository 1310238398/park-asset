package schema

// AssetGroup 资产组管理
type AssetGroup struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
}

// AssetGroupQueryParam 查询条件
type AssetGroupQueryParam struct {
}

// AssetGroupQueryOptions 查询可选参数项
type AssetGroupQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AssetGroupQueryResult 查询结果
type AssetGroupQueryResult struct {
	Data       AssetGroups
	PageResult *PaginationResult
}

// AssetGroups 资产组管理列表
type AssetGroups []*AssetGroup
