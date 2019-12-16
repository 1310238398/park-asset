package ctl

import (
	"github.com/gin-gonic/gin"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
)

// NewComContractAlter 创建变更管理控制器
func NewComContractAlter(bComContractAlter bll.IComContractAlter) *ComContractAlter {
	return &ComContractAlter{
		ComContractAlterBll: bComContractAlter,
	}
}

// ComContractAlter 变更管理控制器
type ComContractAlter struct {
	ComContractAlterBll bll.IComContractAlter
}

// Query 查询数据
// @Tags 变更管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" default(1)
// @Param pageSize query int true "分页大小" default(10)
// @Success 200 {array} schema.ComContractAlter "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 {object} schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 {object} schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router /api/v1/com-contract-alters [get]
func (a *ComContractAlter) Query(c *gin.Context) {
	var params schema.ComContractAlterQueryParam

	result, err := a.ComContractAlterBll.Query(ginplus.NewContext(c), params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// Get 查询指定数据
// @Tags 变更管理
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 {object} schema.ComContractAlter
// @Failure 401 {object} schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 {object} schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 {object} schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router /api/v1/com-contract-alters/{id} [get]
func (a *ComContractAlter) Get(c *gin.Context) {
	item, err := a.ComContractAlterBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Tags 变更管理
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContractAlter true "创建数据"
// @Success 200 {object} schema.ComContractAlter
// @Failure 400 {object} schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 {object} schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 {object} schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router /api/v1/com-contract-alters [post]
func (a *ComContractAlter) Create(c *gin.Context) {
	var item schema.ComContractAlter
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractAlterBll.Create(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Update 更新数据
// @Tags 变更管理
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlter true "更新数据"
// @Success 200 {object} schema.ComContractAlter
// @Failure 400 {object} schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 {object} schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 {object} schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router /api/v1/com-contract-alters/{id} [put]
func (a *ComContractAlter) Update(c *gin.Context) {
	var item schema.ComContractAlter
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ComContractAlterBll.Update(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Delete 删除数据
// @Tags 变更管理
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 {object} schema.HTTPStatus "{status:OK}"
// @Failure 401 {object} schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 {object} schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router /api/v1/com-contract-alters/{id} [delete]
func (a *ComContractAlter) Delete(c *gin.Context) {
	err := a.ComContractAlterBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
