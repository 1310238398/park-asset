package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjContractPlanning 创建项目合约规划控制器
func NewProjContractPlanning(bProjContractPlanning bll.IProjContractPlanning) *ProjContractPlanning {
	return &ProjContractPlanning{
		ProjContractPlanningBll: bProjContractPlanning,
	}
}

// ProjContractPlanning 项目合约规划
// @Name ProjContractPlanning
// @Description 项目合约规划控制器
type ProjContractPlanning struct {
	ProjContractPlanningBll bll.IProjContractPlanning
}

// Query 查询数据
func (a *ProjContractPlanning) Query(c *gin.Context) {
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
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param project_id query string true "项目ID"
// @Param cost_id query string false "成本项ID"
// @Success 200 []schema.ProjContractPlanning "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-contract-plannings?q=page
func (a *ProjContractPlanning) QueryPage(c *gin.Context) {
	var params schema.ProjContractPlanningQueryParam
	params.ProjectID = c.Query("project_id")
	params.CostID = c.Query("cost_id")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}

	result, err := a.ProjContractPlanningBll.Query(ginplus.NewContext(c), params, schema.ProjContractPlanningQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryList 查询分页数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param project_id query string true "项目ID"
// @Param cost_id query string true "成本项ID"
// @Success 200 []schema.ProjContractPlanning "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-contract-plannings?q=list
func (a *ProjContractPlanning) QueryList(c *gin.Context) {
	var params schema.ProjContractPlanningQueryParam
	params.ProjectID = c.Query("project_id")
	params.CostID = c.Query("cost_id")
	if params.ProjectID == "" || params.CostID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}

	result, err := a.ProjContractPlanningBll.Query(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResList(c, result.Data)
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjContractPlanning
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-contract-plannings/{id}
func (a *ProjContractPlanning) Get(c *gin.Context) {
	item, err := a.ProjContractPlanningBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjContractPlanning true
// @Success 200 schema.ProjContractPlanning
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-contract-plannings
func (a *ProjContractPlanning) Create(c *gin.Context) {
	var item schema.ProjContractPlanning
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjContractPlanningBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjContractPlanning true
// @Success 200 schema.ProjContractPlanning
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-contract-plannings/{id}
func (a *ProjContractPlanning) Update(c *gin.Context) {
	var item schema.ProjContractPlanning
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjContractPlanningBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-contract-plannings/{id}
func (a *ProjContractPlanning) Delete(c *gin.Context) {
	err := a.ProjContractPlanningBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
