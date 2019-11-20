package schema

import "time"

// PcProject 成本项目管理
type PcProject struct {
	RecordID              string    `json:"record_id" swaggo:"false,记录ID"`                // 记录ID
	Name                  string    `json:"name" swaggo:"false,项目名称"`                     // 项目名称
	Creator               string    `json:"creator" swaggo:"false,创建人"`                   // 创建人
	Memo                  string    `json:"memo" swaggo:"false,备注"`                       // 备注
	ParentID              string    `json:"parent_id" swaggo:"false,父级ID"`                // 父级ID
	ParentPath            string    `json:"parent_path" swaggo:"false,父级路经"`              // 父级路经
	BuildingCoverage      float64   `json:"building_coverage" swaggo:"false,建筑密度"`        // 建筑密度
	SlagVolume            float64   `json:"slag_volume" swaggo:"false,渣土工程量"`             // 渣土工程量
	FloorArea             float64   `json:"floor_area" swaggo:"false,建筑面积"`               // 建筑面积
	CivilAirDefenseArea   float64   `json:"civil_air_defense_area" swaggo:"false,人防面积"`   // 人防面积
	Type                  int       `json:"type" swaggo:"false,项目类型(1:住宅 2:写字楼)"`         // 项目类型(1:住宅 2:写字楼)
	CoverArea             float64   `json:"cover_area" swaggo:"false,占地面积"`               // 占地面积
	Address               string    `json:"address" swaggo:"false,项目地址"`                  // 项目地址
	UndergroundFloorArea  float64   `json:"underground_floor_area" swaggo:"false,地下建筑面积"` // 地下建筑面积
	GroundFloorArea       float64   `json:"ground_floor_area" swaggo:"false,地上建筑面积"`      // 地上建筑面积
	UndergroundVolumeRate float64   `json:"underground_volume_rate" swaggo:"false,地下容积率"` // 地下容积率
	GroundVolumeRate      float64   `json:"ground_volume_rate" swaggo:"false,地上容积率"`      // 地上容积率
	SaleArea              float64   `json:"sale_area" swaggo:"false,可售面积"`                // 可售面积
	StartTime             time.Time `json:"start_time" swaggo:"false,项目开始时间"`             // 项目开始时间
	EndTime               time.Time `json:"end_time" swaggo:"false,项目结束时间"`               // 项目结束时间
	TotalUsingArea        float64   `json:"total_using_area" swaggo:"false,总用地面积"`        // 总用地面积
	ConstructionArea      float64   `json:"construction_area" swaggo:"false,建设用地面积"`      // 建设用地面积
	OrgID                 string    `json:"org_id" swaggo:"false,项目所属子公司"`                // 项目所属子公司
	PlotID                string    `json:"plot_id" swaggo:"false,所属地块"`                  // 所属地块
	Location              string    `json:"location" swaggo:"false,项目地址(经纬度)"`            // 项目地址(经纬度)
}

// PcProjectQueryParam 查询条件
type PcProjectQueryParam struct {
	LikeName string // 项目名称(模糊查询)
	Type     int    // 项目类型(1:住宅 2:写字楼)
	OrgID    string // 项目所属子公司
	PlotID   string // 所属地块
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
