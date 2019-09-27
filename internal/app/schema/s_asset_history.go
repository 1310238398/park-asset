package schema

// AssetHistory 资产历史管理
type AssetHistory struct {
	RecordID    string `json:"record_id" swaggo:"false,记录ID"`
	AssetID     string `json:"asset_id" swaggo:"false,资产ID"`
	Status      int    `json:"status" swaggo:"false,状态：1:未租 2:锁定 3:已租 4:退租 5:作废 6:续签"`
	Reason      string `json:"reason" swaggo:"false,原因"`
	Source      int    `json:"source" swaggo:"false,数据来源：1录入 2导入"`
	Operator    string `json:"operator" swaggo:"false,操作人"`
	OperatorTel string `json:"operator_tel" swaggo:"false,操作人手机号"`
	Creator     string `json:"creator" swaggo:"false,创建者"`
}

// AssetHistoryQueryParam 查询条件
type AssetHistoryQueryParam struct {
}

// AssetHistoryQueryOptions 查询可选参数项
type AssetHistoryQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AssetHistoryQueryResult 查询结果
type AssetHistoryQueryResult struct {
	Data       AssetHistories
	PageResult *PaginationResult
}

// AssetHistories 资产历史管理列表
type AssetHistories []*AssetHistory
