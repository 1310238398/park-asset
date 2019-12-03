package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjExpenditure 创建项目支出节点控制器
func NewProjExpenditure(bProjExpenditure bll.IProjExpenditure) *ProjExpenditure {
	return &ProjExpenditure{
		ProjExpenditureBll: bProjExpenditure,
	}
}

// ProjExpenditure 项目支出节点
// @Name ProjExpenditure
// @Description 项目支出节点控制器
type ProjExpenditure struct {
	ProjExpenditureBll bll.IProjExpenditure
}

// Query 查询数据
func (a *ProjExpenditure) Query(c *gin.Context) {
	switch c.Query("q") {
	case "tree":
		a.QueryTree(c)
	case "page":
		a.QueryPage(c)
	default:
		ginplus.ResError(c, errors.ErrUnknownQuery)

	}
}

// QueryPage 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "项目支出节点名称(模糊查询)"
// @Param project_id query string false "项目ID"
// @Success 200 []schema.ProjExpenditure "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-expenditures?q=page
func (a *ProjExpenditure) QueryPage(c *gin.Context) {
	var params schema.ProjExpenditureQueryParam
	params.LikeName = c.Query("name")
	params.ProjectID = c.Query("project_id")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	result, err := a.ProjExpenditureBll.Query(ginplus.NewContext(c), params, schema.ProjExpenditureQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryTree 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name query string false "项目支出节点名称(模糊查询)"
// @Param project_id query string false "项目ID"
// @Success 200 option.Interface "查询结果：{list:树结构列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-expenditures?q=tree
func (a *ProjExpenditure) QueryTree(c *gin.Context) {
	var params schema.ProjExpenditureQueryParam
	params.LikeName = c.Query("name")
	params.ProjectID = c.Query("project_id")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	result, err := a.ProjExpenditureBll.Query(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResList(c, result.Data.ToTrees().ToTree())
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjExpenditure
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-expenditures/{id}
func (a *ProjExpenditure) Get(c *gin.Context) {
	item, err := a.ProjExpenditureBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjExpenditure true
// @Success 200 schema.ProjExpenditure
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-expenditures
func (a *ProjExpenditure) Create(c *gin.Context) {
	var item schema.ProjExpenditure
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjExpenditureBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjExpenditure true
// @Success 200 schema.ProjExpenditure
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-expenditures/{id}
func (a *ProjExpenditure) Update(c *gin.Context) {
	var item schema.ProjExpenditure
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjExpenditureBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-expenditures/{id}
func (a *ProjExpenditure) Delete(c *gin.Context) {
	err := a.ProjExpenditureBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
