package ctl

import (
	"fmt"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"strconv"

	"github.com/gin-gonic/gin"
)

// NewComContract 创建合同管理控制器
func NewComContract(bComContract bll.IComContract) *ComContract {
	return &ComContract{
		ComContractBll: bComContract,
	}
}

// ComContract 合同管理控制器
type ComContract struct {
	ComContractBll bll.IComContract
}

// Query 查询数据
// @Tags 合同管理
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContract "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contracts
func (a *ComContract) Query(c *gin.Context) {
	var params schema.ComContractQueryParam
	statusStr := c.Query("status")
	if statusStr == "" {
		params.Status = -1
	} else {
		params.Status, _ = strconv.Atoi(statusStr)
	}
	params.Name = c.Query("name")
	params.SN = c.Query("sn")
	params.Category = c.Query("category")
	params.Yifang = c.Query("yifang")
	stateInt, _ := strconv.Atoi(c.Query("state"))
	params.State = stateInt

	result, err := a.ComContractBll.Query(ginplus.NewContext(c), params, schema.ComContractQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
		//QueryParam: &getQuery,
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// Get 查询指定数据
// @Tags 合同管理
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ComContract
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contracts/{id}
func (a *ComContract) Get(c *gin.Context) {
	item, err := a.ComContractBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Tags 合同管理
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContract true "创建数据"
// @Success 200 schema.ComContract
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contracts
func (a *ComContract) Create(c *gin.Context) {
	var item schema.ComContract
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}
	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractBll.Create(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Update 更新数据
// @Tags 合同管理
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContract true "更新数据"
// @Success 200 schema.ComContract
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contracts/{id}
func (a *ComContract) Update(c *gin.Context) {
	var item schema.ComContract
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}
	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractBll.Update(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// Delete 删除数据
// @Tags 合同管理
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contracts/{id}
func (a *ComContract) Delete(c *gin.Context) {
	err := a.ComContractBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// PassCheck 合同审核通过
// @Tags 合同管理
// @Summary 合同审核通过
// @param id post string true "合同id"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contracts/{id}/passcheck
func (a *ComContract) PassCheck(c *gin.Context) {
	err := a.ComContractBll.PassCheck(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		fmt.Println(err)
		errItem := schema.HTTPErrorItem{Code: 400, Message: err.Error()}
		ginplus.ResJSON(c, 400, schema.HTTPError{Error: errItem})
		return
	}
	ginplus.ResOK(c)
}

// Commit 提交合同审核
// @Tags 合同管理
// @Summary 提交合同审核
// @param id post string true "合同id"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contracts/{id}/commit
func (a *ComContract) Commit(c *gin.Context) {
	err := a.ComContractBll.Commit(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		fmt.Println(err)
		errItem := schema.HTTPErrorItem{Code: 400, Message: err.Error()}
		ginplus.ResJSON(c, 400, schema.HTTPError{Error: errItem})
		return
	}
	ginplus.ResOK(c)
}

// CancelCommit 取消提交审核
// @Tags 合同管理
// @Summary 取消提交合同审核
// @param id post string true "合同id"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contracts/{id}/cancelcommit
func (a *ComContract) CancelCommit(c *gin.Context) {
	err := a.ComContractBll.CancelCommit(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		fmt.Println(err)
		errItem := schema.HTTPErrorItem{Code: 400, Message: err.Error()}
		ginplus.ResJSON(c, 400, schema.HTTPError{Error: errItem})

		return
	}
	ginplus.ResOK(c)
}

// TakeEffect 设置生效
// @Tags 合同管理
// @Summary 对合同设置使之生效
// @param id post string true "合同id"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contracts/{id}/take-effect
func (a *ComContract) TakeEffect(c *gin.Context) {
	var effectInfo schema.ComContractEffectInfo
	if err := ginplus.ParseJSON(c, &effectInfo); err != nil {
		ginplus.ResError(c, err)
		return
	}
	err := a.ComContractBll.TakeEffect(ginplus.NewContext(c), c.Param("id"), effectInfo)
	if err != nil {
		fmt.Println(err)
		errItem := schema.HTTPErrorItem{Code: 400, Message: err.Error()}
		ginplus.ResJSON(c, 400, schema.HTTPError{Error: errItem})

		return
	}
	ginplus.ResOK(c)
}
