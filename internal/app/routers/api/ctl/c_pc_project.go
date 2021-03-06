package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewPcProject 创建成本项目管理控制器
func NewPcProject(bPcProject bll.IPcProject,
	bOrganization bll.IOrganization,
) *PcProject {
	return &PcProject{
		PcProjectBll:    bPcProject,
		OrganizationBll: bOrganization,
	}
}

// PcProject 成本项目管理
// @Name PcProject
// @Description 成本项目管理控制器
type PcProject struct {
	PcProjectBll    bll.IPcProject
	OrganizationBll bll.IOrganization
}

// Query 查询数据
func (a *PcProject) Query(c *gin.Context) {
	switch c.Query("q") {
	case "list":
		a.QueryList(c)
	case "page":
		a.QueryPage(c)
	case "tree":
		a.QueryTree(c)
	case "nodes":
		a.queryNodes(c)
	default:
		ginplus.ResError(c, errors.ErrUnknownQuery)
	}
}

// QueryPage 查询分页数据
// @Summary 查询分页数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "名称"
// @Param org_id query string false "项目所属公司ID"
// @Param plot_id query string false "地块ID"
// @Success 200 []schema.PcProject "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/pc-projects?q=page
func (a *PcProject) QueryPage(c *gin.Context) {
	var params schema.PcProjectQueryParam
	params.LikeName = c.Query("name")
	params.OrgID = c.Query("org_id")
	params.PlotID = c.Query("plot_id")
	result, err := a.PcProjectBll.Query(ginplus.NewContext(c), params, schema.PcProjectQueryOptions{
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
// @Param name query string false "名称"
// @Param org_id query string false "项目所属公司ID"
// @Param plot_id query string false "地块ID"
// @Success 200 []schema.PcProject "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/pc-projects?q=list
func (a *PcProject) QueryList(c *gin.Context) {
	var params schema.PcProjectQueryParam
	params.LikeName = c.Query("name")
	params.OrgID = c.Query("org_id")
	params.PlotID = c.Query("plot_id")
	result, err := a.PcProjectBll.Query(ginplus.NewContext(c), params, schema.PcProjectQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResList(c, result)
}

// QueryTree 查询树状数据
// @Summary 查询树状数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name query string false "项目名称(模糊查询)"
// @Success 200 []schema.PcProject "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/pc-projects?q=tree
func (a *PcProject) QueryTree(c *gin.Context) {
	var (
		pjParams  schema.PcProjectQueryParam
		orgParams schema.OrganizationQueryParam
		orgResult *schema.OrganizationQueryResult
	)

	pjParams.LikeName = c.Query("name")
	orgResult, err := a.OrganizationBll.Query(ginplus.NewContext(c), orgParams)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	pjParams.OrgIDs = orgResult.Data.ToRecordIDs()

	if !ginplus.CheckIsRootUser(c) {
		orgResult, err := a.OrganizationBll.QueryCompany(ginplus.NewContext(c), ginplus.GetUserID(c))
		if err != nil {
			ginplus.ResError(c, err)
			return
		}
		pjParams.OrgIDs = orgResult.Data.ToRecordIDs()

	}

	pcResult, err := a.PcProjectBll.Query(ginplus.NewContext(c), pjParams)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, orgResult.Data.ToProjectTrees().ToTree(pcResult.Data.ToProjectTrees()))
}

// QueryNodes 查询树状数据
// @Summary 查询树状数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name query string false "名称"
// @Success 200 schema.ProjectNodes "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/pc-projects?q=nodes
func (a *PcProject) queryNodes(c *gin.Context) {
	var (
		pjParams  schema.PcProjectQueryParam
		orgResult *schema.OrganizationQueryResult
	)

	orgResult, err := a.OrganizationBll.Query(ginplus.NewContext(c), schema.OrganizationQueryParam{})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	pjParams.OrgIDs = orgResult.Data.ToRecordIDs()

	if !ginplus.CheckIsRootUser(c) {
		orgResult, err := a.OrganizationBll.QueryCompany(ginplus.NewContext(c), ginplus.GetUserID(c))
		if err != nil {
			ginplus.ResError(c, err)
			return
		}
		pjParams.OrgIDs = orgResult.Data.ToRecordIDs()

	}

	pcResult, err := a.PcProjectBll.Query(ginplus.NewContext(c), pjParams)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, orgResult.Data.ToProjectTrees().
		ToTree(pcResult.Data.ToProjectTrees()).ToProjectNodes())
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.PcProject
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/pc-projects/{id}
func (a *PcProject) Get(c *gin.Context) {
	item, err := a.PcProjectBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.PcProject true
// @Success 200 schema.PcProject
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/pc-projects
func (a *PcProject) Create(c *gin.Context) {
	var item schema.PcProject
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.PcProjectBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.PcProject true
// @Success 200 schema.PcProject
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/pc-projects/{id}
func (a *PcProject) Update(c *gin.Context) {
	var item schema.PcProject
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.PcProjectBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/pc-projects/{id}
func (a *PcProject) Delete(c *gin.Context) {
	err := a.PcProjectBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
