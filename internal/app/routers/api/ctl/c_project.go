package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/gin-gonic/gin"
)

// NewProject 创建项目管理控制器
func NewProject(
	bProject bll.IProject,
	bOrganization bll.IOrganization,
	bStatistic bll.IStatistic,
) *Project {
	return &Project{
		ProjectBll:      bProject,
		OrganizationBll: bOrganization,
		StatisticBll:    bStatistic,
	}
}

// Project 项目管理
// @Name Project
// @Description 项目管理控制器
type Project struct {
	ProjectBll      bll.IProject
	OrganizationBll bll.IOrganization
	StatisticBll    bll.IStatistic
}

// Query 查询数据
func (a *Project) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	case "list":
		a.QueryList(c)
	default:
		ginplus.ResError(c, errors.ErrUnknownQuery)
	}
}

// QueryPage 查询分页数据
// @Summary 查询分页数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "项目名称（模糊查询）"
// @Param org_id query string false "所属子公司"
// @Param plot_id query string false "所属地块"
// @Param asset_type query int false "资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"
// @Success 200 []schema.Project "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/projects?q=page
func (a *Project) QueryPage(c *gin.Context) {
	var params schema.ProjectQueryParam
	params.LikeName = c.Query("name")
	params.PlotID = c.Query("plot_id")

	if v := c.Query("org_id"); v != "" {
		params.OrgIDs = []string{v}
	} else {
		if !ginplus.CheckIsRootUser(c) {
			result, err := a.OrganizationBll.QueryCompany(ginplus.NewContext(c), ginplus.GetUserID(c))
			if err != nil {
				ginplus.ResError(c, err)
				return
			}
			params.OrgIDs = result.Data.ToRecordIDs()
		}
	}

	if v := c.Query("asset_type"); v != "" {
		params.AssetTypes = []string{v}
	}

	result, err := a.ProjectBll.Query(ginplus.NewContext(c), params, schema.ProjectQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryList 查询列表数据
// @Summary 查询列表数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "项目名称（模糊查询）"
// @Success 200 []schema.Project "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/projects?q=list
func (a *Project) QueryList(c *gin.Context) {
	var params schema.TAssetDataQueryProjectNameParam
	params.LikeProjectName = c.Query("name")
	params.Count = util.S(c.Query("pageSize")).DefaultInt(0)

	result, err := a.StatisticBll.QueryProjectName(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, result)
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.Project
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/projects/{id}
func (a *Project) Get(c *gin.Context) {
	item, err := a.ProjectBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.Project true
// @Success 200 schema.Project
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/projects
func (a *Project) Create(c *gin.Context) {
	var item schema.Project
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ProjectBll.Create(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Update 更新数据
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.Project true
// @Success 200 schema.Project
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/projects/{id}
func (a *Project) Update(c *gin.Context) {
	var item schema.Project
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjectBll.Update(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Delete 删除数据
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/projects/{id}
func (a *Project) Delete(c *gin.Context) {
	err := a.ProjectBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
