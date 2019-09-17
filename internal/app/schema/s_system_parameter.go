package schema

// SystemParameter 系统参数管理
type SystemParameter struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`
	Code     string `json:"code" binding:"required" swaggo:"true,参数编号"`
	Name     string `json:"name" binding:"required" swaggo:"true,参数名称"`
	Value    string `json:"value" swaggo:"false,参数值"`
	Status   int    `json:"status" binding:"required" swaggo:"true,状态(1:启用 2:停用)"`
	Memo     string `json:"memo" swaggo:"false,备注"`
	Creator  string `json:"creator" swaggo:"false,创建者"`
}

// SystemParameterQueryParam 查询条件
type SystemParameterQueryParam struct {
	LikeCode string
	LikeName string
	Code     string
	Status   int
}

// SystemParameterQueryOptions 查询可选参数项
type SystemParameterQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// SystemParameterQueryResult 查询结果
type SystemParameterQueryResult struct {
	Data       []*SystemParameter
	PageResult *PaginationResult
}
