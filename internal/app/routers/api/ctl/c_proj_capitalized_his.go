package ctl

import (
	"github.com/gin-gonic/gin"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
)

// NewProjCapitalizedHis 创建项目资本化利息测算历史控制器
func NewProjCapitalizedHis(bProjCapitalizedHis bll.IProjCapitalizedHis) *ProjCapitalizedHis {
	return &ProjCapitalizedHis{
		ProjCapitalizedHisBll: bProjCapitalizedHis,
	}
}

// ProjCapitalizedHis 项目资本化利息测算历史
// @Name ProjCapitalizedHis
// @Description 项目资本化利息测算历史控制器
type ProjCapitalizedHis struct {
	ProjCapitalizedHisBll bll.IProjCapitalizedHis
}

// Query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ProjCapitalizedHis "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-capitalized-his
func (a *ProjCapitalizedHis) Query(c *gin.Context) {
	var params schema.ProjCapitalizedHisQueryParam

	result, err := a.ProjCapitalizedHisBll.Query(ginplus.NewContext(c), params, schema.ProjCapitalizedHisQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjCapitalizedHis
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-capitalized-his/{id}
func (a *ProjCapitalizedHis) Get(c *gin.Context) {
	item, err := a.ProjCapitalizedHisBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjCapitalizedHis true
// @Success 200 schema.ProjCapitalizedHis
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-capitalized-his
func (a *ProjCapitalizedHis) Create(c *gin.Context) {
	var item schema.ProjCapitalizedHis
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjCapitalizedHisBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjCapitalizedHis true
// @Success 200 schema.ProjCapitalizedHis
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-capitalized-his/{id}
func (a *ProjCapitalizedHis) Update(c *gin.Context) {
	var item schema.ProjCapitalizedHis
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjCapitalizedHisBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-capitalized-his/{id}
func (a *ProjCapitalizedHis) Delete(c *gin.Context) {
	err := a.ProjCapitalizedHisBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
