package ctl

import (
	"ant-smartpark/pkg/errors"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/gin-gonic/gin"
)

// NewProjSalesPlan 创建项目销售计划控制器
func NewProjSalesPlan(bProjSalesPlan bll.IProjSalesPlan) *ProjSalesPlan {
	return &ProjSalesPlan{
		ProjSalesPlanBll: bProjSalesPlan,
	}
}

// ProjSalesPlan 项目销售计划
// @Name ProjSalesPlan
// @Description 项目销售计划控制器
type ProjSalesPlan struct {
	ProjSalesPlanBll bll.IProjSalesPlan
}

// Query 查询数据
func (a *ProjSalesPlan) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	default:
		ginplus.ResError(c, errors.NewBadRequestError("未知的查询类型"))
	}
}

// QueryPage 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param year query int false "年度"
// @Success 200 []schema.ProjSalesPlan "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-sales-plans?q=page
func (a *ProjSalesPlan) QueryPage(c *gin.Context) {
	var params schema.ProjSalesPlanQueryParam
	params.Year = util.S(c.Query("year")).DefaultInt(0)
	params.Quarter = util.S(c.Query("quarter")).DefaultInt(0)
	params.ProjBusinessID = c.Query("proj_business_id")
	params.ProjIncomeID = c.Query("proj_income_id")

	result, err := a.ProjSalesPlanBll.Query(ginplus.NewContext(c), params, schema.ProjSalesPlanQueryOptions{
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
// @Success 200 schema.ProjSalesPlan
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-sales-plans/{id}
func (a *ProjSalesPlan) Get(c *gin.Context) {
	item, err := a.ProjSalesPlanBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjSalesPlan true
// @Success 200 []schema.ProjSalesPlan
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-sales-plans
func (a *ProjSalesPlan) Create(c *gin.Context) {
	var item schema.ProjSalesPlan
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjSalesPlanBll.Create(ginplus.NewContext(c), item)
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
// @Param body body []schema.ProjSalesPlan true
// @Success 200 schema.ProjSalesPlan
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-sales-plans/{id}
func (a *ProjSalesPlan) Update(c *gin.Context) {
	var item schema.ProjSalesPlan
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjSalesPlanBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-sales-plans/{id}
func (a *ProjSalesPlan) Delete(c *gin.Context) {
	err := a.ProjSalesPlanBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// CreateList 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body []schema.ProjSalesPlan true
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-sales-plans/list
func (a *ProjSalesPlan) CreateList(c *gin.Context) {
	var items schema.ProjSalesPlans
	if err := ginplus.ParseJSON(c, &items); err != nil {
		ginplus.ResError(c, err)
		return
	}

	err := a.ProjSalesPlanBll.CreateList(ginplus.NewContext(c), items)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// DeleteList 删除数据
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body []string true "recordID列表"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-sales-plans/delete_list
func (a *ProjSalesPlan) DeleteList(c *gin.Context) {
	var recordIDs []string
	if err := ginplus.ParseJSON(c, &recordIDs); err != nil {
		ginplus.ResError(c, err)
		return
	}
	err := a.ProjSalesPlanBll.DeleteList(ginplus.NewContext(c), recordIDs)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
