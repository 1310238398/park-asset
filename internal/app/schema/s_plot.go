package schema

// Plot 地块管理
type Plot struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`
	Name     string `json:"name" binding:"required" swaggo:"true,地块名称"`
	Location string `json:"location" swaggo:"false,位置(经纬度以逗号分隔)"`
	Address  string `json:"address" swaggo:"false,地址"`
	Photo    string `json:"photo" swaggo:"false,照片(JSON)"`
	Memo     string `json:"memo" swaggo:"false,备注"`
	Creator  string `json:"creator" swaggo:"false,创建者"`
}

// PlotQueryParam 查询条件
type PlotQueryParam struct {
	LikeName  string
	Name      string
	RecordIDs []string
}

// PlotQueryOptions 查询可选参数项
type PlotQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// PlotQueryResult 查询结果
type PlotQueryResult struct {
	Data       Plots
	PageResult *PaginationResult
}

// Plots 地块管理列表
type Plots []*Plot

// ToMap 转换为map对象
func (a Plots) ToMap() map[string]*Plot {
	m := make(map[string]*Plot)
	for _, item := range a {
		m[item.RecordID] = item
	}

	return m
}
