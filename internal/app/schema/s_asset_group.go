package schema

// AssetGroup 资产组管理
type AssetGroup struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`
	AssetID  string `json:"asset_id" swaggo:"false,资产ID"`
	Creator  string `json:"creator" swaggo:"false,创建者"`
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
