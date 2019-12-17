package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"time"

	"github.com/jinzhu/gorm"
)

// GetPcProjectDB 成本项目管理
func GetPcProjectDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, PcProject{})
}

// SchemaPcProject 成本项目管理
type SchemaPcProject schema.PcProject

// ToPcProject 转换为成本项目管理实体
func (a SchemaPcProject) ToPcProject() *PcProject {
	item := &PcProject{
		RecordID:              &a.RecordID,
		Name:                  &a.Name,
		Creator:               &a.Creator,
		Memo:                  &a.Memo,
		ParentID:              &a.ParentID,
		ParentPath:            &a.ParentPath,
		BuildingCoverage:      &a.BuildingCoverage,
		SlagVolume:            &a.SlagVolume,
		FloorArea:             &a.FloorArea,
		CivilAirDefenseArea:   &a.CivilAirDefenseArea,
		Type:                  &a.Type,
		CoverArea:             &a.CoverArea,
		Address:               &a.Address,
		UndergroundFloorArea:  &a.UndergroundFloorArea,
		GroundFloorArea:       &a.GroundFloorArea,
		UndergroundVolumeRate: &a.UndergroundVolumeRate,
		GroundVolumeRate:      &a.GroundVolumeRate,
		SaleArea:              &a.SaleArea,
		StartTime:             &a.StartTime,
		EndTime:               &a.EndTime,
		TotalUsingArea:        &a.TotalUsingArea,
		ConstructionArea:      &a.ConstructionArea,
		OrgID:                 &a.OrgID,
		PlotID:                &a.PlotID,
		Location:              &a.Location,
		IdentiArea:            &a.IdentiArea,
		Stage:                 &a.Stage,
	}
	return item
}

// PcProject 成本项目管理实体
type PcProject struct {
	CostModel
	RecordID              *string    `gorm:"column:record_id;size:36;index;"`                    // 记录ID
	Name                  *string    `gorm:"column:name;size:200;index;"`                        // 项目名称
	Creator               *string    `gorm:"column:creator;size:100;index;"`                     // 创建人
	Memo                  *string    `gorm:"column:memo;size:1024;"`                             // 备注
	ParentID              *string    `gorm:"column:parent_id;size:36;index;"`                    // 父级ID
	ParentPath            *string    `gorm:"column:parent_path;size:518;index;"`                 // 父级路经
	BuildingCoverage      *float64   `gorm:"column:building_coverage;type:decimal(20,4);"`       // 建筑密度
	SlagVolume            *float64   `gorm:"column:slag_volume;type:decimal(20,4);"`             // 渣土工程量
	FloorArea             *float64   `gorm:"column:floor_area;type:decimal(20,4);"`              // 建筑面积
	CivilAirDefenseArea   *float64   `gorm:"column:civil_air_defense_area;type:decimal(20,4);"`  // 人防面积
	Type                  *int       `gorm:"column:type;index;"`                                 // 项目类型(1:住宅 2:写字楼)
	CoverArea             *float64   `gorm:"column:cover_area;type:decimal(20,4);"`              // 占地面积
	Address               *string    `gorm:"column:address;size:200;"`                           // 项目地址
	UndergroundFloorArea  *float64   `gorm:"column:underground_floor_area;type:decimal(20,4);"`  // 地下建筑面积
	GroundFloorArea       *float64   `gorm:"column:ground_floor_area;type:decimal(20,4);"`       // 地上建筑面积
	UndergroundVolumeRate *float64   `gorm:"column:underground_volume_rate;type:decimal(20,4);"` // 地下容积率
	GroundVolumeRate      *float64   `gorm:"column:ground_volume_rate;type:decimal(20,4);"`      // 地上容积率
	SaleArea              *float64   `gorm:"column:sale_area;type:decimal(20,4);"`               // 可售面积
	StartTime             *time.Time `gorm:"column:start_time;type:date;"`                       // 项目开始时间
	EndTime               *time.Time `gorm:"column:end_time;type:date;"`                         // 项目结束时间
	TotalUsingArea        *float64   `gorm:"column:total_using_area;type:decimal(20,4);"`        // 总用地面积
	ConstructionArea      *float64   `gorm:"column:construction_area;type:decimal(20,4);"`       // 建设用地面积
	OrgID                 *string    `gorm:"column:org_id;size:36;index;"`                       // 项目所属子公司
	PlotID                *string    `gorm:"column:plot_id;size:36;index;"`                      // 所属地块
	Location              *string    `gorm:"column:location;size:200;"`                          // 项目地址(经纬度)
	IdentiArea            *float64   `gorm:"column:identi_area;type:decimal(20,4);"`             // 可确权面积
	Stage                 *int       `gorm:"column:stage;index;"`                                // 项目阶段
}

func (a PcProject) String() string {
	return toString(a)
}

// TableName 表名
func (a PcProject) TableName() string {
	return a.CostModel.TableName("pc_project")
}

// ToSchemaPcProject 转换为成本项目管理对象
func (a PcProject) ToSchemaPcProject() *schema.PcProject {
	item := &schema.PcProject{
		RecordID:              *a.RecordID,
		Name:                  *a.Name,
		Creator:               *a.Creator,
		Memo:                  *a.Memo,
		ParentID:              *a.ParentID,
		ParentPath:            *a.ParentPath,
		BuildingCoverage:      *a.BuildingCoverage,
		SlagVolume:            *a.SlagVolume,
		FloorArea:             *a.FloorArea,
		CivilAirDefenseArea:   *a.CivilAirDefenseArea,
		Type:                  *a.Type,
		CoverArea:             *a.CoverArea,
		Address:               *a.Address,
		UndergroundFloorArea:  *a.UndergroundFloorArea,
		GroundFloorArea:       *a.GroundFloorArea,
		UndergroundVolumeRate: *a.UndergroundVolumeRate,
		GroundVolumeRate:      *a.GroundVolumeRate,
		SaleArea:              *a.SaleArea,
		StartTime:             *a.StartTime,
		EndTime:               *a.EndTime,
		TotalUsingArea:        *a.TotalUsingArea,
		ConstructionArea:      *a.ConstructionArea,
		OrgID:                 *a.OrgID,
		PlotID:                *a.PlotID,
		Location:              *a.Location,
		IdentiArea:            *a.IdentiArea,
		Stage:                 *a.Stage,
	}
	return item
}

// PcProjects 成本项目管理列表
type PcProjects []*PcProject

// ToSchemaPcProjects 转换为成本项目管理对象列表
func (a PcProjects) ToSchemaPcProjects() []*schema.PcProject {
	list := make([]*schema.PcProject, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaPcProject()
	}
	return list
}
