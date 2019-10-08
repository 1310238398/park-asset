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

// QueryProject 查询项目统计数据
func (a *Statistic) QueryProject(ctx context.Context, params schema.ProjectStatisticQueryParam, opts ...schema.ProjectStatisticQueryOptions) (*schema.ProjectStatisticQueryResult, error) {
	db := entity.GetTAssetDataDB(ctx, a.db).DB
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

	payment := "quarter_y201901_value+quarter_y201902_value+quarter_y201903_value+quarter_y201904_value+quarter_y2019_value+quarter_y202001_value+quarter_y202002_value+quarter_y202003_value+quarter_y202004_value+quarter_y2020_value"
	actual := "quarter_s201901_value+quarter_s201902_value+quarter_s201903_value+quarter_s201904_value+quarter_s2019_value+quarter_s202001_value+quarter_s202002_value+quarter_s202003_value+quarter_s202004_value+quarter_s2020_value"
	if v := params.RentCycle; len(v) > 0 {
		if len(v) == 1 {
			if v[0] == 2019 {
				payment = "quarter_y201901_value+quarter_y201902_value+quarter_y201903_value+quarter_y201904_value+quarter_y2019_value"
				actual = "quarter_s201901_value+quarter_s201902_value+quarter_s201903_value+quarter_s201904_value+quarter_s2019_value"
			} else {
				payment = "quarter_y202001_value+quarter_y202002_value+quarter_y202003_value+quarter_y202004_value+quarter_y2020_value"
				actual = "quarter_s202001_value+quarter_s202002_value+quarter_s202003_value+quarter_s202004_value+quarter_s2020_value"
			}
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
