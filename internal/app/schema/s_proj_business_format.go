package schema

// ProjBusinessFormat 项目业态
type ProjBusinessFormat struct {
	RecordID         string  `json:"record_id" swaggo:"false,记录ID"`          // 记录ID
	ProjectID        string  `json:"project_id" swaggo:"false,成本项目ID"`       // 成本项目ID
	BusinessFormatID string  `json:"business_format_id" swaggo:"false,业态ID"` // 业态ID
	FloorArea        float64 `json:"floor_area" swaggo:"false,建筑面积"`         // 建筑面积
}

// ProjBusinessFormatQueryParam 查询条件
type ProjBusinessFormatQueryParam struct {
	ProjectID        string // 成本项目ID
	BusinessFormatID string // 业态ID
}

// ProjBusinessFormatQueryOptions 查询可选参数项
type ProjBusinessFormatQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjBusinessFormatQueryResult 查询结果
type ProjBusinessFormatQueryResult struct {
	Data       ProjBusinessFormats
	PageResult *PaginationResult
}

// ProjBusinessFormats 项目业态列表
type ProjBusinessFormats []*ProjBusinessFormat
