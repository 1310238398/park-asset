package schema

// Asset 资产管理
type Asset struct {
	RecordID  string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	AssetType int    `json:"asset_type" binding:"required" swaggo:"true,资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"`
	HistoryID string `json:"history_id" swaggo:"false,历史记录ID"`
	Creator   string `json:"creator" swaggo:"false,创建者"`
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
