package schema

// Hotel 酒店管理
type Hotel struct {
	RecordID     string `json:"record_id" swaggo:"false,记录ID"`
	ProjectID    string `json:"project_id" binding:"required" swaggo:"true,项目ID"`
	Name         string `json:"name" binding:"required" swaggo:"true,建筑名称"`
	BuildingType int    `json:"building_type" binding:"required" swaggo:"true,建筑类型: 1:楼栋 2:单元 3:楼层 4:门牌"`
	BuildingArea int    `json:"building_area" swaggo:"false,建筑面积"`
	RentArea     int    `json:"rent_area" swaggo:"false,计租面积"`
	RentStatus   int    `json:"rent_status" swaggo:"false,出租状态:1未租 2锁定 3已租"`
	ParentID     string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath   string `json:"parent_path" swaggo:"false,父级路径"`
	Creator      string `json:"creator" swaggo:"false,创建者"`
}

// HotelQueryParam 查询条件
type HotelQueryParam struct {
}

// HotelQueryOptions 查询可选参数项
type HotelQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// HotelQueryResult 查询结果
type HotelQueryResult struct {
	Data       Hotels
	PageResult *PaginationResult
}

// Hotels 酒店管理列表
type Hotels []*Hotel