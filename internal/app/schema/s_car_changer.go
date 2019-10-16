package schema

// CarChanger 车改商管理
type CarChanger struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID    string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	Name         string `json:"name" binding:"required" swaggo:"true,车位号"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	ParentID     string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath   string `json:"parent_path" swaggo:"false,父级路径"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
}

// CarChangerQueryParam 查询条件
type CarChangerQueryParam struct {
	ProjectID  string
	Name       string
	LikeName   string
	RentStatus int
}

// CarChangerQueryOptions 查询可选参数项
type CarChangerQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// CarChangerQueryResult 查询结果
type CarChangerQueryResult struct {
	Data       CarChangers
	PageResult *PaginationResult
}

// CarChangers 车改商管理列表
type CarChangers []*CarChanger
