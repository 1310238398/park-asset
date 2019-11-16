package schema

// ProjFile 成本项目文件管理
type ProjFile struct {
	RecordID  string `json:"record_id" swaggo:"false,记录ID"`    // 记录ID
	Name      string `json:"name" swaggo:"false,文件名称"`         // 文件名称
	Path      string `json:"path" swaggo:"false,文件路经"`         // 文件路经
	Memo      string `json:"memo" swaggo:"false,备注"`           // 备注
	ProjectID string `json:"project_id" swaggo:"false,成本项目ID"` // 成本项目ID
	Size      int    `json:"size" swaggo:"false,大小(单位:字节)"`    // 大小(单位:字节)
	Type      string `json:"type" swaggo:"false,类型"`           // 类型
}

// ProjFileQueryParam 查询条件
type ProjFileQueryParam struct {
	LikeName  string // 文件名称(模糊查询)
	ProjectID string // 成本项目ID
}

// ProjFileQueryOptions 查询可选参数项
type ProjFileQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjFileQueryResult 查询结果
type ProjFileQueryResult struct {
	Data       ProjFiles
	PageResult *PaginationResult
}

// ProjFiles 成本项目文件管理列表
type ProjFiles []*ProjFile
