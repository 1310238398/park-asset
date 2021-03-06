package schema

import (
	"time"
)

// PcProject 成本项目管理
type PcProject struct {
	RecordID              string    `json:"record_id" swaggo:"false,记录ID"`                                 // 记录ID
	Name                  string    `json:"name" binding:"required" swaggo:"false,项目名称"`                   // 项目名称
	Creator               string    `json:"creator" swaggo:"false,创建人"`                                    // 创建人
	Memo                  string    `json:"memo" swaggo:"false,备注"`                                        // 备注
	ParentID              string    `json:"parent_id" swaggo:"false,父级ID"`                                 // 父级ID
	ParentPath            string    `json:"parent_path" swaggo:"false,父级路经"`                               // 父级路经
	BuildingCoverage      float64   `json:"building_coverage" swaggo:"false,建筑密度"`                         // 建筑密度
	SlagVolume            float64   `json:"slag_volume" swaggo:"false,渣土工程量"`                              // 渣土工程量
	FloorArea             float64   `json:"floor_area" swaggo:"false,建筑面积"`                                // 建筑面积
	CivilAirDefenseArea   float64   `json:"civil_air_defense_area" swaggo:"false,人防面积"`                    // 人防面积
	Type                  int       `json:"type" swaggo:"false,项目类型(1:住宅 2:写字楼)"`                          // 项目类型(1:住宅 2:写字楼)
	CoverArea             float64   `json:"cover_area" swaggo:"false,占地面积"`                                // 占地面积
	Address               string    `json:"address" swaggo:"false,项目地址"`                                   // 项目地址
	UndergroundFloorArea  float64   `json:"underground_floor_area" swaggo:"false,地下建筑面积"`                  // 地下建筑面积
	GroundFloorArea       float64   `json:"ground_floor_area" swaggo:"false,地上建筑面积"`                       // 地上建筑面积
	UndergroundVolumeRate float64   `json:"underground_volume_rate" swaggo:"false,地下容积率"`                  // 地下容积率
	GroundVolumeRate      float64   `json:"ground_volume_rate" swaggo:"false,地上容积率"`                       // 地上容积率
	SaleArea              float64   `json:"sale_area" swaggo:"false,可售面积"`                                 // 可售面积
	StartTime             time.Time `json:"start_time" swaggo:"false,项目开始时间"`                              // 项目开始时间
	EndTime               time.Time `json:"end_time" swaggo:"false,项目结束时间"`                                // 项目结束时间
	TotalUsingArea        float64   `json:"total_using_area" swaggo:"false,总用地面积"`                         // 总用地面积
	ConstructionArea      float64   `json:"construction_area" swaggo:"false,建设用地面积"`                       // 建设用地面积
	OrgID                 string    `json:"org_id" binding:"required" swaggo:"false,项目所属子公司"`              // 项目所属子公司
	OrgName               string    `json:"org_name" swaggo:"false,项目所属子公司名称"`                             // 项目所属子公司名称
	PlotID                string    `json:"plot_id" swaggo:"false,所属地块"`                                   // 所属地块
	PlotName              string    `json:"plot_name" swaggo:"false,所属地块名称"`                               // 所属地块名称
	Location              string    `json:"location" swaggo:"false,项目地址(经纬度)"`                             // 项目地址(经纬度)
	IdentiArea            float64   `json:"identi_area" swaggo:"false,可确权面积"`                              // 可确权面积
	Files                 ProjFiles `json:"files"  swaggo:"false,文件列表"`                                    // 文件列表
	Stage                 int       `json:"stage" swaggo:"false,阶段(1:成本核算 2:成本审核 3:合约规划 4:合约规划审核 5:合同执行)"` // 阶段(1:成本核算 2:成本审核 3:合约规划 4:合约规划审核 5:合同执行)

}

// PcProjectQueryParam 查询条件
type PcProjectQueryParam struct {
	Name     string   // 项目名称
	LikeName string   // 项目名称(模糊查询)
	Type     int      // 项目类型(1:住宅 2:写字楼)
	OrgID    string   // 项目所属子公司
	PlotID   string   // 所属地块
	OrgIDs   []string // 项目所属子公司

}

// PcProjectQueryOptions 查询可选参数项
type PcProjectQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// PcProjectQueryResult 查询结果
type PcProjectQueryResult struct {
	Data       PcProjects
	PageResult *PaginationResult
}

// PcProjects 成本项目管理列表
type PcProjects []*PcProject

// ToOrgIDs 转换为组织机构ID列表
func (a PcProjects) ToOrgIDs() []string {
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
func (a PcProjects) FillOrgData(m map[string]*Organization) PcProjects {
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
func (a PcProjects) FillPlotData(m map[string]*Plot) PcProjects {
	for i, item := range a {
		if v, ok := m[item.PlotID]; ok {
			a[i].PlotName = v.Name
		}
	}
	return a
}

// PcProjectTree 项目树
type PcProjectTree struct {
	RecordID             string         `json:"record_id" swaggo:"false,记录ID"`                // 记录ID
	Name                 string         `json:"name" swaggo:"false,组织或项目名称"`                  // 组织或项目名称
	Creator              string         `json:"creator" swaggo:"false,创建人"`                   // 创建人
	Memo                 string         `json:"memo" swaggo:"false,备注"`                       // 备注
	ParentID             string         `json:"parent_id" swaggo:"false,父级ID"`                // 父级ID
	ParentPath           string         `json:"parent_path" swaggo:"false,父级路经"`              // 父级路经
	OrgID                string         `json:"org_id" swaggo:"false,项目所属子公司"`                // 项目所属子公司
	Children             PcProjectTrees `json:"children" swaggo:"false, 子级树"`                 // 子级树
	Type                 int            `json:"type" swaggo:"false,项目类型(1:住宅 2:写字楼)"`         // 项目类型(1:住宅 2:写字楼)
	UndergroundFloorArea float64        `json:"underground_floor_area" swaggo:"false,地下建筑面积"` // 地下建筑面积
	GroundFloorArea      float64        `json:"ground_floor_area" swaggo:"false,地上建筑面积"`      // 地上建筑面积

}

// PcProjectTrees 组织机构树列表
type PcProjectTrees []*PcProjectTree

// ToTree 转换为树形结构
func (a PcProjectTrees) ToTree(items PcProjectTrees) PcProjectTrees {
	mi := make(map[string]*PcProjectTree, len(a))
	for _, item := range a {
		mi[item.RecordID] = item
	}

	mp := make(map[string]*PcProjectTree, len(items))
	for _, item := range items {
		mp[item.OrgID] = item
	}

	var list PcProjectTrees
	for _, item := range a {
		if pitem, ok := mi[item.ParentID]; ok {
			if pitem.Children == nil {
				var children PcProjectTrees
				children = append(children, item)
				pitem.Children = children
				continue
			}

			pitem.Children = append(pitem.Children, item)
			continue
		}

		list = append(list, item)
	}
	// 把项目作为子树填充
	for _, item := range a {
		for _, projItem := range items {
			if item.RecordID == projItem.OrgID {
				if item.Children == nil {
					var children PcProjectTrees
					children = append(children, projItem)
					item.Children = children

					continue
				}
				item.Children = append(item.Children, projItem)
				continue

			}

		}
	}

	return list
}

// ToProjectTrees 转换为组织机构项目
func (a Organizations) ToProjectTrees() PcProjectTrees {
	list := make(PcProjectTrees, len(a))
	for i, item := range a {
		list[i] = &PcProjectTree{
			RecordID:   item.RecordID,
			Name:       item.Name,
			ParentID:   item.ParentID,
			ParentPath: item.ParentPath,
		}
	}
	return list
}

// ToProjectTrees 转换为项目
func (a PcProjects) ToProjectTrees() PcProjectTrees {
	list := make(PcProjectTrees, len(a))
	for i, item := range a {
		list[i] = &PcProjectTree{
			RecordID:             item.RecordID,
			Name:                 item.Name,
			ParentID:             item.ParentID,
			ParentPath:           item.ParentPath,
			OrgID:                item.OrgID,
			Type:                 item.Type,
			GroundFloorArea:      item.GroundFloorArea,
			UndergroundFloorArea: item.UndergroundFloorArea,
		}
	}
	return list
}

// FillFiles 填充项目文件
func (a PcProjects) FillFiles(fitems ProjFiles) {
	for _, item := range a {
		for _, fitem := range fitems {
			if item.RecordID == fitem.ProjectID {
				item.Files = append(item.Files, fitem)
			}
		}
	}
}

type ProjectNode struct {
	Title      string       `json:"title"`
	Value      string       `json:"value"`
	Key        string       `json:"key"`
	Selectable bool         `json:"selectable"`
	Children   ProjectNodes `json:"children"`
}

type ProjectNodes []*ProjectNode

// ToProjectNodes 转化为节点树
func (a PcProjectTrees) ToProjectNodes() ProjectNodes {
	result := ProjectNodes{}
	for _, v := range a {
		item := new(ProjectNode)
		item.Title = v.Name
		item.Key = v.RecordID
		if v.OrgID != "" {
			item.Selectable = true
		}
		item.Value = v.RecordID
		item.Children = v.Children.ToProjectNodes()
		result = append(result, item)
	}
	return result
}
