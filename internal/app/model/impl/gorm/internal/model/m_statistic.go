package model

import (
	"context"
	"fmt"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewStatistic 创建统计查询存储实例
func NewStatistic(db *gormplus.DB) *Statistic {
	return &Statistic{db}
}

// Statistic 统计查询存储
type Statistic struct {
	db *gormplus.DB
}

func (a *Statistic) getAllPayment() string {
	s := "quarter_y201901_value+quarter_y201902_value+quarter_y201903_value+quarter_y201904_value+quarter_y2019_value+quarter_y202001_value+quarter_y202002_value+quarter_y202003_value+quarter_y202004_value+quarter_y2020_value"
	return s
}

// 获取年度应收
func (a *Statistic) getYearPayment(y int) string {
	s := "quarter_y201901_value+quarter_y201902_value+quarter_y201903_value+quarter_y201904_value+quarter_y2019_value"
	if y == 2020 {
		s = "quarter_y202001_value+quarter_y202002_value+quarter_y202003_value+quarter_y202004_value+quarter_y2020_value"
	}
	return s
}

func (a *Statistic) getAllActual() string {
	s := "quarter_s201901_value+quarter_s201902_value+quarter_s201903_value+quarter_s201904_value+quarter_s2019_value+quarter_s202001_value+quarter_s202002_value+quarter_s202003_value+quarter_s202004_value+quarter_s2020_value"
	return s
}

// 获取年度实收
func (a *Statistic) getYearActual(y int) string {
	s := "quarter_s201901_value+quarter_s201902_value+quarter_s201903_value+quarter_s201904_value+quarter_s2019_value"
	if y == 2020 {
		s = "quarter_s202001_value+quarter_s202002_value+quarter_s202003_value+quarter_s202004_value+quarter_s2020_value"
	}
	return s
}

// QueryProject 查询项目统计数据
func (a *Statistic) QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())

	if v := params.LikeOrgName; v != "" {
		db = db.Where("org_name LIKE ?", "%"+v+"%")
	}
	if v := params.LikeProjectName; v != "" {
		db = db.Where("project_name LIKE ?", "%"+v+"%")
	}
	if v := params.AssetType; v != 0 {
		db = db.Where("asset_type=?", v)
	}

	selQuery := "org_name,project_name,asset_type"
	selQuery += ",SUM(rent_area_value)'rent_area'"
	selQuery += ",SUM(case signing_status when '已租' then rent_area_value ELSE 0 END)'rented_area'"

	payment := a.getAllPayment()
	actual := a.getAllActual()
	if v := params.RentCycle; len(v) > 0 {
		if len(v) == 1 {
			payment = a.getYearPayment(v[0])
			actual = a.getYearActual(v[0])
		} else {
			payment = fmt.Sprintf("quarter_y%d0%d_value", v[0], v[1])
			actual = fmt.Sprintf("quarter_s%d0%d_value", v[0], v[1])
		}
	}

	selQuery += fmt.Sprintf(",SUM(%s)'payment_amount'", payment)
	selQuery += fmt.Sprintf(",SUM(%s)'actual_amount'", actual)

	db = db.Select(selQuery)
	db = db.Group("org_name,project_name,asset_type")
	db = db.Order("org_name,project_name,asset_type")

	var opt schema.ProjectStatisticQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}

	var list entity.ProjectStatistics
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	qr := &schema.ProjectStatisticQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjectStatistics(),
	}

	return qr, nil
}

// QueryIncomeClassification 查询收入分类占比统计数据
func (a *Statistic) QueryIncomeClassification(ctx context.Context, params schema.IncomeClassificationStatisticQueryParam, opts ...schema.IncomeClassificationStatisticQueryOptions) (*schema.IncomeClassificationStatisticQueryResult, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())

	if v := params.OrgName; v != "" {
		db = db.Where("org_name=?", v)
	}

	selQuery := "asset_type"
	actual := a.getAllActual()
	if v := params.Year; v > 0 {
		actual = a.getYearActual(v)
	}

	selQuery += fmt.Sprintf(",SUM(%s)'actual_amount'", actual)

	db = db.Select(selQuery)
	db = db.Group("asset_type")

	var list entity.IncomeClassificationStatistics
	_, err := WrapPageQuery(db, nil, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	qr := &schema.IncomeClassificationStatisticQueryResult{
		Data: list.ToSchemaIncomeClassificationStatistics(),
	}

	return qr, nil
}
