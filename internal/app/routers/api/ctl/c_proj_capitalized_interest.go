package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjCapitalizedInterest 创建项目资本化利息测算控制器
func NewProjCapitalizedInterest(bProjCapitalizedInterest bll.IProjCapitalizedInterest) *ProjCapitalizedInterest {
	return &ProjCapitalizedInterest{
		ProjCapitalizedInterestBll: bProjCapitalizedInterest,
	}
}

// ProjCapitalizedInterest 项目资本化利息测算
// @Name ProjCapitalizedInterest
// @Description 项目资本化利息测算控制器
type ProjCapitalizedInterest struct {
	ProjCapitalizedInterestBll bll.IProjCapitalizedInterest
}

func (a *ProjCapitalizedInterest) Query(c *gin.Context) {
	q := c.Query("q")
	switch q {
	case "list":
		a.query(c)
	case "year":
		a.queryYear(c)
	default:
		a.query(c)
	}
}

// query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ProjCapitalizedInterest "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-capitalized-interests?q=list
func (a *ProjCapitalizedInterest) query(c *gin.Context) {
	var params schema.ProjCapitalizedInterestQueryParam

	result, err := a.ProjCapitalizedInterestBll.Query(ginplus.NewContext(c), params, schema.ProjCapitalizedInterestQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// queryYear 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true 项目ID
// @Success 200 []schema.ProjCapitalizedInterestYearShow "查询结果：列表数据"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-capitalized-interests?q=year
func (a *ProjCapitalizedInterest) queryYear(c *gin.Context) {
	var params schema.ProjCapitalizedInterestQueryParam
	if pid := c.Query("projectID"); pid != "" {
		params.ProjectID = pid
	} else {
		ginplus.ResError(c, errors.ErrInvalidRequestParameter)
		return
	}

	result, err := a.ProjCapitalizedInterestBll.QueryYearShow(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	if len(result) == 0 {
		result = append(result, new(schema.ProjCapitalizedInterestYearShow))
	}
	ginplus.ResSuccess(c, result)
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjCapitalizedInterest
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-capitalized-interests/{id}
func (a *ProjCapitalizedInterest) Get(c *gin.Context) {
	item, err := a.ProjCapitalizedInterestBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjCapitalizedInterest true
// @Success 200 schema.ProjCapitalizedInterest
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-capitalized-interests
func (a *ProjCapitalizedInterest) Create(c *gin.Context) {
	var item schema.ProjCapitalizedInterest
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjCapitalizedInterestBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjCapitalizedInterest true
// @Success 200 schema.ProjCapitalizedInterest
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-capitalized-interests/{id}
func (a *ProjCapitalizedInterest) Update(c *gin.Context) {
	var item schema.ProjCapitalizedInterest
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjCapitalizedInterestBll.Update(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateYear 更新数据
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ProjCapitalizedInterest true
// @Success 200 schema.ProjCapitalizedInterest
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-capitalized-interests
func (a *ProjCapitalizedInterest) UpdateYear(c *gin.Context) {
	var item schema.ProjCapitalizedInterestYearShow
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	err := a.ProjCapitalizedInterestBll.UpdateYearShow(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// Delete 删除数据
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/proj-capitalized-interests/{id}
func (a *ProjCapitalizedInterest) Delete(c *gin.Context) {
	err := a.ProjCapitalizedInterestBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
