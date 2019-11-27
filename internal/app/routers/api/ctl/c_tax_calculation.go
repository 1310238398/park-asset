package ctl

import (
	"ant-smartpark/pkg/errors"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewTaxCalculation 创建税目计算表控制器
func NewTaxCalculation(bTaxCalculation bll.ITaxCalculation) *TaxCalculation {
	return &TaxCalculation{
		TaxCalculationBll: bTaxCalculation,
	}
}

// TaxCalculation 税目计算表
// @Name TaxCalculation
// @Description 税目计算表控制器
type TaxCalculation struct {
	TaxCalculationBll bll.ITaxCalculation
}

// Query 查询数据
func (a *TaxCalculation) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	case "list":
		a.QueryList(c)
	default:
		ginplus.ResError(c, errors.NewBadRequestError("未知的查询类型"))
	}
}

// QueryPage 查询分页数据
// @Summary 查询分页数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name  query string false "税目名称(模糊查询)"
// @Success 200 []schema.TaxCalculation "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/tax-calculations?q=page
func (a *TaxCalculation) QueryPage(c *gin.Context) {
	var params schema.TaxCalculationQueryParam
	params.LikeName = c.Query("name")

	result, err := a.TaxCalculationBll.Query(ginplus.NewContext(c), params, schema.TaxCalculationQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryList 查询列表数据
// @Summary 查询=列表数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param name  query string false "税目名称(模糊查询)"
// @Success 200 []schema.TaxCalculation "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/tax-calculations?q=list
func (a *TaxCalculation) QueryList(c *gin.Context) {
	var params schema.TaxCalculationQueryParam
	params.LikeName = c.Query("name")

	result, err := a.TaxCalculationBll.Query(ginplus.NewContext(c), params)
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
// @Success 200 schema.TaxCalculation
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/tax-calculations/{id}
func (a *TaxCalculation) Get(c *gin.Context) {
	item, err := a.TaxCalculationBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.TaxCalculation true
// @Success 200 schema.TaxCalculation
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/tax-calculations
func (a *TaxCalculation) Create(c *gin.Context) {
	var item schema.TaxCalculation
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.TaxCalculationBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.TaxCalculation true
// @Success 200 schema.TaxCalculation
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/tax-calculations/{id}
func (a *TaxCalculation) Update(c *gin.Context) {
	var item schema.TaxCalculation
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.TaxCalculationBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/tax-calculations/{id}
func (a *TaxCalculation) Delete(c *gin.Context) {
	err := a.TaxCalculationBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
