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
// @Success 200 []schema.IncomeClassificationStatistic
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/income_classification
func (a *Statistic) QueryIncomeClassification(c *gin.Context) {
	var params schema.IncomeClassificationStatisticQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)

	items, err := a.StatisticBll.QueryIncomeClassification(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, items)
}
