package schema

// Project 项目管理
type Project struct {
	RecordID      string `json:"record_id" swaggo:"false,记录ID"`
	Name          string `json:"name" binding:"required" swaggo:"true,项目名称"`
	Location      string `json:"location" swaggo:"false,项目位置(经纬度)"`
	Address       string `json:"address" swaggo:"false,项目地址"`
	Nature        string `json:"nature" swaggo:"false,资产性质"`
	Photo         string `json:"photo" swaggo:"false,项目照片"`
	AssetType     string `json:"asset_type" swaggo:"false,资产类型"`
	Peripheral    string `json:"peripheral" swaggo:"false,周边配套"`
	BasicServices string `json:"basic_services" swaggo:"false,基础服务"`
	Tag           string `json:"tag" swaggo:"false,特色标签"`
	HasModel      int    `json:"has_model" swaggo:"false,是否包含3D模型(1:包含 2:不包含)"`
	ParentID      string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath    string `json:"parent_path" swaggo:"false,父级路径"`
	Memo          string `json:"memo" swaggo:"false,备注"`
	Creator       string `json:"creator" swaggo:"false,创建者"`
	OrgID         string `json:"org_id" swaggo:"false,所属子公司"`
}

// ProjectQueryParam 查询条件
type ProjectQueryParam struct {
	LikeName string
	Nature   string
	Name     string
	OrgID    string
}

// ProjectQueryOptions 查询可选参数项
type ProjectQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjectQueryResult 查询结果
type ProjectQueryResult struct {
	Data       []*Project
	PageResult *PaginationResult
}
