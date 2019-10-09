package schema

// AssetGroupDetail 资产组明细管理
type AssetGroupDetail struct {
	GroupID string `json:"group_id" swaggo:"false,资产组ID"`
	AssetID string `json:"asset_id" swaggo:"false,资产ID"`
	Creator string `json:"creator" swaggo:"false,创建者"`
}

// AssetGroupDetailQueryParam 查询条件
type AssetGroupDetailQueryParam struct {
}

// AssetGroupDetailQueryOptions 查询可选参数项
type AssetGroupDetailQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AssetGroupDetailQueryResult 查询结果
type AssetGroupDetailQueryResult struct {
	Data       AssetGroupDetails
	PageResult *PaginationResult
}

// AssetGroupDetails 资产组明细管理列表
type AssetGroupDetails []*AssetGroupDetail
