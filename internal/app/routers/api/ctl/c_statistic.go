package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

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
// @Param rent_cycle query string false "缴费周期，约定：年(2019)，季度(2019-1)"
// @Success 200 []schema.ProjectStatistic "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/statistics/project
func (a *Statistic) QueryProject(c *gin.Context) {
	var params schema.ProjectStatisticQueryParam

	result, err := a.StatisticBll.QueryProject(ginplus.NewContext(c), params, schema.ProjectStatisticQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}
