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
	db = db.Where("deleted_at is null")
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
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
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
	db = db.Where("deleted_at is null")

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
	_, err := WrapPageQueryNC(db, nil, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	qr := &schema.IncomeClassificationStatisticQueryResult{
		Data: list.ToSchemaIncomeClassificationStatistics(),
	}

	return qr, nil
}

// GetContractNum 获取合同数
func (a *Statistic) GetContractNum(ctx context.Context, params schema.GetContractNumQueryParam) (int, error) {
	var values []interface{}
	subSQL := fmt.Sprintf("SELECT COUNT(*) AS count FROM %s WHERE deleted_at is null AND signing_status='已租'", entity.TAssetData{}.TableName())
	if v := params.OrgName; v != "" {
		subSQL += " and org_name=?"
		values = append(values, v)
	}
	subSQL += " GROUP BY code"

	var result struct {
		Count int `grom:"column:count"`
	}
	sql := fmt.Sprintf("SELECT SUM(1) AS count FROM (%s) AS a WHERE count>0", subSQL)
	db := a.db.Raw(sql, values...).Scan(&result)
	if err := db.Error; err != nil {
		return 0, errors.WithStack(err)
	}

	return result.Count, nil
}

// GetEnterpriseNum 获取企业数
func (a *Statistic) GetEnterpriseNum(ctx context.Context, params schema.GetEnterpriseNumQueryParam) (int, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())

	if v := params.OrgName; v != "" {
		db = db.Where("org_name=?", v)
	}

	db = db.Where("asset_type!=2")
	db = db.Where("customer_tenant_type='企业'")

	var count int
	db = db.Count(&count)
	if err := db.Error; err != nil {
		return 0, errors.WithStack(err)
	}

	return count, nil
}

// GetMerchantNum 获取商家数
func (a *Statistic) GetMerchantNum(ctx context.Context, params schema.GetMerchantNumQueryParam) (int, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())

	if v := params.OrgName; v != "" {
		db = db.Where("org_name=?", v)
	}

	db = db.Where("asset_type=2")
	db = db.Where("signing_status='已租'")

	var count int
	db = db.Count(&count)
	if err := db.Error; err != nil {
		return 0, errors.WithStack(err)
	}

	return count, nil
}

// GetProjectNum 获取项目数
func (a *Statistic) GetProjectNum(ctx context.Context, params schema.GetProjectNumQueryParam) (int, error) {
	var values []interface{}
	subSQL := fmt.Sprintf("SELECT COUNT(*) AS count FROM %s WHERE deleted_at is null AND project_name!=''", entity.TAssetData{}.TableName())
	if v := params.OrgName; v != "" {
		subSQL += " and org_name=?"
		values = append(values, v)
	}
	subSQL += " GROUP BY project_name"

	var result struct {
		Count int `grom:"column:count"`
	}
	sql := fmt.Sprintf("SELECT SUM(1) AS count FROM (%s) AS a WHERE count>0", subSQL)
	db := a.db.Raw(sql, values...).Scan(&result)
	if err := db.Error; err != nil {
		return 0, errors.WithStack(err)
	}

	return result.Count, nil
}

// GetIncome 获取收入统计
func (a *Statistic) GetIncome(ctx context.Context, params schema.GetIncomeStatisticQueryParam) (*schema.GetIncomeStatisticResult, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())
	db = db.Where("deleted_at is null")

	if v := params.OrgName; v != "" {
		db = db.Where("org_name=?", v)
	}

	payment := a.getAllPayment()
	actual := a.getAllActual()
	if y := params.Year; y > 0 {
		payment = a.getYearPayment(y)
		actual = a.getYearActual(y)
		if q := params.Quarter; q > 0 {
			payment = fmt.Sprintf("quarter_y%d0%d_value", y, q)
			actual = fmt.Sprintf("quarter_s%d0%d_value", y, q)
		}
	}

	var selQuery string
	selQuery += fmt.Sprintf("SUM(%s)'payment_amount'", payment)
	selQuery += fmt.Sprintf(",SUM(%s)'actual_amount'", actual)
	db = db.Select(selQuery)

	var item entity.IncomeStatistic
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaGetIncomeStatisticResult(), nil
}

// GetArea 获取面积统计
func (a *Statistic) GetArea(ctx context.Context, params schema.GetAreaStatisticQueryParam) (*schema.GetAreaStatisticResult, error) {
	db := a.db.Table(entity.TAssetData{}.TableName())
	db = db.Where("deleted_at is null")

	if v := params.OrgName; v != "" {
		db = db.Where("org_name=?", v)
	}

	selQuery := "SUM(rent_area_value)'rent_area'"
	selQuery += ",SUM(case signing_status when '已租' then rent_area_value ELSE 0 END)'rented_area'"

	db = db.Select(selQuery)

	var item entity.AreaStatistic
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaGetAreaStatisticResult(), nil
}
