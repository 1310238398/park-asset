package ctl

import (
	"fmt"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
	"io"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// NewStatistic 创建统计查询控制器
func NewStatistic(bStatistic bll.IStatistic) *Statistic {
	return &Statistic{
		StatisticBll: bStatistic,
	}
}

// Statistic 统计查询
// @Name Statistic
// @Description 统计查询控制器
type Statistic struct {
	StatisticBll bll.IStatistic
}

// QueryProjectName 查询项目名称
// @Summary 查询项目名称
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name query string false "项目名称（模糊查询）"
// @Success 200 []schema.Project "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/project/name
func (a *Statistic) QueryProjectName(c *gin.Context) {
	var params schema.TAssetDataQueryProjectNameParam
	params.LikeProjectName = c.Query("name")
	params.Count = 50

	result, err := a.StatisticBll.QueryProjectName(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, result)
}

// QueryProject 项目统计查询
// @Summary 项目统计查询
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param org_name query string false "组织名称（模糊查询）"
// @Param project_name query string false "项目名称（模糊查询）"
// @Param asset_type query int false "资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"
// @Param rent_cycle query string true "缴费周期，约定：年(2019)，季度(2019-1)"
// @Success 200 []schema.ProjectStatistic "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/project
func (a *Statistic) QueryProject(c *gin.Context) {
	var params schema.ProjectStatisticQueryParam
	params.LikeOrgName = c.Query("org_name")
	params.LikeProjectName = c.Query("project_name")
	params.AssetType = util.S(c.Query("asset_type")).DefaultInt(0)

	if v := c.Query("rent_cycle"); v != "" {
		for _, s := range strings.Split(v, "-") {
			params.RentCycle = append(params.RentCycle, util.S(s).DefaultInt(0))
		}
	}

	result, err := a.StatisticBll.QueryProject(ginplus.NewContext(c), params, schema.ProjectStatisticQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// ExportProject 导出项目资产
// @Summary 导出项目资产
// @Param Authorization header string false "Bearer 用户令牌"
// @Param org_name query string false "组织名称（模糊查询）"
// @Param project_name query string false "项目名称（模糊查询）"
// @Param asset_type query int false "资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"
// @Param rent_cycle query string true "缴费周期，约定：年(2019)，季度(2019-1)"
// @Success 200 file "excel文件"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/project/export
func (a *Statistic) ExportProject(c *gin.Context) {
	var params schema.ProjectStatisticQueryParam
	params.LikeOrgName = c.Query("org_name")
	params.LikeProjectName = c.Query("project_name")
	params.AssetType = util.S(c.Query("asset_type")).DefaultInt(0)

	if v := c.Query("rent_cycle"); v != "" {
		for _, s := range strings.Split(v, "-") {
			params.RentCycle = append(params.RentCycle, util.S(s).DefaultInt(0))
		}
	}

	buf, err := a.StatisticBll.ExportProject(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	filename := "集团自持运营资产数据统计表"
	if len(params.RentCycle) > 0 {
		filename += fmt.Sprintf("-%d年", params.RentCycle[0])
		if len(params.RentCycle) > 1 {
			filename += fmt.Sprintf("-第%d季度", params.RentCycle[1])
		}
	}
	filename = fmt.Sprintf("%s.xlsx", filename)

	c.Writer.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Writer.Header().Set("Content-Disposition", util.ContentDisposition(filename, ""))
	c.Writer.Header().Set("Content-Length", strconv.FormatInt(int64(buf.Len()), 10))
	io.Copy(c.Writer, buf)
}

// QueryIncomeClassification 查询资产各分类收入
// @Summary 查询资产各分类收入
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Param org_id query string false "组织ID"
// @Success 200 []schema.IncomeClassificationStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/income_classification
func (a *Statistic) QueryIncomeClassification(c *gin.Context) {
	var params schema.IncomeClassificationStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.OrgID = c.Query("org_id")

	items, err := a.StatisticBll.QueryIncomeClassification(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, items)
}

// QueryOperationalIndicator 查询运营指标
// @Summary 查询运营指标
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Param org_id query string false "组织ID"
// @Success 200 schema.OperationalIndicatorStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/operational_indicator
func (a *Statistic) QueryOperationalIndicator(c *gin.Context) {
	var params schema.OperationalIndicatorStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.OrgID = c.Query("org_id")

	item, err := a.StatisticBll.QueryOperationalIndicator(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResSuccess(c, item)
}

// QueryOverview 查询概览统计数据
// @Summary 查询概览统计数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Param org_id query string false "组织ID"
// @Success 200 schema.OverviewStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/overview
func (a *Statistic) QueryOverview(c *gin.Context) {
	var params schema.OverviewStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.OrgID = c.Query("org_id")

	item, err := a.StatisticBll.QueryOverview(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResSuccess(c, item)
}

// QueryQuarterFinanciallIndicator 查询季度财务指标统计
// @Summary 查询季度财务指标统计
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Param quarter query int true "季度"
// @Param org_id query string false "组织ID"
// @Success 200 schema.QuarterFinanciallIndicatorStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/quarter_financiall_indicator
func (a *Statistic) QueryQuarterFinanciallIndicator(c *gin.Context) {
	var params schema.QuarterFinanciallIndicatorStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.Quarter = util.S(c.Query("quarter")).DefaultInt(0)
	params.OrgID = c.Query("org_id")

	item, err := a.StatisticBll.QueryQuarterFinanciallIndicator(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResSuccess(c, item)
}

// QueryFinanciallIndicator 查询财务指标统计
// @Summary 查询财务指标统计
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Param org_id query string false "组织ID"
// @Success 200 []schema.FinanciallIndicatorStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/financiall_indicator
func (a *Statistic) QueryFinanciallIndicator(c *gin.Context) {
	var params schema.FinanciallIndicatorStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.OrgID = c.Query("org_id")

	items, err := a.StatisticBll.QueryFinanciallIndicator(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, items)
}

// QueryCompany 查询子公司统计
// @Summary 查询子公司统计
// @Param Authorization header string false "Bearer 用户令牌"
// @Param year query int true "年份"
// @Success 200 []schema.CompanyStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/company
func (a *Statistic) QueryCompany(c *gin.Context) {
	var params schema.CompanyStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)

	items, err := a.StatisticBll.QueryCompany(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, items)
}
