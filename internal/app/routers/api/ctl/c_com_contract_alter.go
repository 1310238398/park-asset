package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
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

// QueryDesignByComContractID 通过合同ID查询设计变更数据
// @Tags 变更管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlter "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/designs
func (a *ComContractAlter) QueryDesignByComContractID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ComContractID := c.Param("id")

	result, err := a.ComContractAlterBll.QueryDesignByComContractID(ginplus.NewContext(c), ComContractID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QuerySignByComContractID 通过合同ID查询设计变更数据
// @Tags 变更管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlter "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/signs
func (a *ComContractAlter) QuerySignByComContractID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ComContractID := c.Param("id")

	result, err := a.ComContractAlterBll.QueryDesignByComContractID(ginplus.NewContext(c), ComContractID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryStuffPriceByComContractID 通过合同ID查询设计变更数据
// @Tags 变更管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlter "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/stuffprices
func (a *ComContractAlter) QueryStuffPriceByComContractID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ComContractID := c.Param("id")

	result, err := a.ComContractAlterBll.QueryDesignByComContractID(ginplus.NewContext(c), ComContractID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// Query 查询数据
// @Tags 变更管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlter "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alters
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
// @Success 200 schema.ComContractAlter
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alters/{id}
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
// @Success 200 schema.ComContractAlter
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contract-alters
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
// @Success 200 schema.ComContractAlter
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alters/{id}
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
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contract-alters/{id}
func (a *ComContractAlter) Delete(c *gin.Context) {
	err := a.ComContractAlterBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
