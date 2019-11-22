package schema

// ProjDeliveryStandard 成本项目交付标准
type ProjDeliveryStandard struct {
	RecordID   string                  `json:"record_id" swaggo:"false,记录ID"`    // 记录ID
	ProjectID  string                  `json:"project_id" swaggo:"false,成本项目ID"` // 成本项目ID
	Content    string                  `json:"content" swaggo:"false,交付标准内容"`    // 交付标准内容
	Part       string                  `json:"part" swaggo:"false,建筑部位"`         // 建筑部位
	ParentID   string                  `json:"parent_id" swaggo:"false,父级ID"`    // 父级ID
	ParentPath string                  `json:"parent_path" swaggo:"false,父级路经"`  // 父级路经
	Children   []*ProjDeliveryStandard `json:"children" swaggo:"false,下级列表"`     //下级列表
}

// ProjDeliveryStandardQueryParam 查询条件
type ProjDeliveryStandardQueryParam struct {
	ProjectID  string // 项目ID
	ParentID   string // 父级ID
	ParentPath string // 父级路经
}

// ProjDeliveryStandardQueryOptions 查询可选参数项
type ProjDeliveryStandardQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjDeliveryStandardQueryResult 查询结果
type ProjDeliveryStandardQueryResult struct {
	Data       ProjDeliveryStandards
	PageResult *PaginationResult
}

// ProjDeliveryStandards 成本项目交付标准列表
type ProjDeliveryStandards []*ProjDeliveryStandard
