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
	OrgID         string `json:"org_id" binding:"required" swaggo:"false,所属子公司"`
	OrgName       string `json:"org_name" swaggo:"false,所属子公司名称"`
	PlotID        string `json:"plot_id" swaggo:"false,所属地块"`
	PlotName      string `json:"plot_name" swaggo:"false,所属地块名称"`
	IsAllRent     int    `json:"is_all_rent" binding:"required" swaggo:"true,是否整租:(1是 2否)"`
}

// ProjectQueryParam 查询条件
type ProjectQueryParam struct {
	LikeName   string   // 项目名称(模糊查询)
	Name       string   // 项目名称
	OrgIDs     []string // 子公司列表
	PlotID     string   // 所属地块
	AssetTypes []string // 资产类型列表
}

// ProjectQueryOptions 查询可选参数项
type ProjectQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjectQueryResult 查询结果
type ProjectQueryResult struct {
	Data       Projects
	PageResult *PaginationResult
}

// Projects 项目列表
type Projects []*Project

// ToOrgIDs 转换为组织机构ID列表
func (a Projects) ToOrgIDs() []string {
	var orgIDs []string

	for _, item := range a {
		exists := false
		for _, orgID := range orgIDs {
			if orgID == item.OrgID {
				exists = true
				break
			}
		}

		if !exists {
			orgIDs = append(orgIDs, item.OrgID)
		}
	}

	return orgIDs
}

// FillOrgData 填充组织机构数据
func (a Projects) FillOrgData(m map[string]*Organization) Projects {
	for i, item := range a {
		if v, ok := m[item.OrgID]; ok {
			a[i].OrgName = v.Name
		}
	}

	return a
}

// ToPlotIDs 转换为地块ID列表
func (a Projects) ToPlotIDs() []string {
	var plotIDs []string

	for _, item := range a {
		exists := false
		for _, plotID := range plotIDs {
			if plotID == item.PlotID {
				exists = true
				break
			}
		}

		if !exists {
			plotIDs = append(plotIDs, item.PlotID)
		}
	}

	return plotIDs
}

// FillPlotData 填充地块数据
func (a Projects) FillPlotData(m map[string]*Plot) Projects {
	for i, item := range a {
		if v, ok := m[item.PlotID]; ok {
			a[i].PlotName = v.Name
		}
	}

	return a
}
