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
// @Name ComContractAlter
// @Description 变更管理控制器
type ComContractAlter struct {
	ComContractAlterBll bll.IComContractAlter
}

// QueryDesignByProjectID 通过项目ID查询设计变更数据
// @Tags 变更管理
// @Summary 通过项目ID查询设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "变更主题名称"
// @Param sn query string false "设计编号"
// @Param contract_name query string false "合同名称"
// @Success 200 []schema.ComContractAlterDesign "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/designsbyproject/{id}
func (a *ComContractAlter) QueryDesignByProjectID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ProjectID := c.Param("id")
	//查询条件
	params.Name = c.Query("name")
	params.SN = c.Query("sn")
	params.ContractName = c.Query("contract_name")

	result, err := a.ComContractAlterBll.QueryDesignByProjectID(ginplus.NewContext(c), ProjectID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QuerySignByProjectID 通过项目ID查询签证变更数据
// @Tags 变更管理
// @Summary 通过项目ID查询签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "变更主题名称"
// @Param sn query string false "设计编号"
// @Param contract_name query string false "合同名称"
// @Success 200 []schema.ComContractAlterSign "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/signsbyproject/{id}
func (a *ComContractAlter) QuerySignByProjectID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ProjectID := c.Param("id")
	//查询条件
	params.Name = c.Query("name")
	params.SN = c.Query("sn")
	params.ContractName = c.Query("contract_name")

	result, err := a.ComContractAlterBll.QuerySignByProjectID(ginplus.NewContext(c), ProjectID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryStuffPriceByProjectID 通过项目ID查询材料批价数据
// @Tags 变更管理
// @Summary 通过项目ID查询材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "变更主题名称"
// @Param sn query string false "设计编号"
// @Param contract_name query string false "合同名称"
// @Param working_company query string false "施工单位"
// @Success 200 []schema.ComContractAlterStuffPrice "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/stuffpricesbyproject/{id}
func (a *ComContractAlter) QueryStuffPriceByProjectID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ProjectID := c.Param("id")
	//查询条件
	params.Name = c.Query("name")
	params.SN = c.Query("sn")
	params.ContractName = c.Query("contract_name")
	params.WorkingCompany = c.Query("working_company")

	result, err := a.ComContractAlterBll.QueryStuffPriceByProjectID(ginplus.NewContext(c), ProjectID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryDesignByComContractID 通过合同ID查询设计变更数据
// @Tags 变更管理
// @Summary 通过合同ID查询设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlterDesign "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/design
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

// QuerySignByComContractID 通过合同ID查询签证变更数据
// @Tags 变更管理
// @Summary 通过合同ID查询签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlterSign "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/sign
func (a *ComContractAlter) QuerySignByComContractID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ComContractID := c.Param("id")

	result, err := a.ComContractAlterBll.QuerySignByComContractID(ginplus.NewContext(c), ComContractID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryStuffPriceByComContractID 通过合同ID查询材料批价数据
// @Tags 变更管理
// @Summary 通过合同ID查询材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlterStuffPrice "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/stuffprice
func (a *ComContractAlter) QueryStuffPriceByComContractID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	ComContractID := c.Param("id")

	result, err := a.ComContractAlterBll.QueryStuffPriceByComContractID(ginplus.NewContext(c), ComContractID, params, schema.ComContractAlterQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryStuffPriceItemByStuffPriceID 通过材料批价ID查询材料批价报价数据
// @Tags 变更管理
// @Summary 通过材料批价ID查询材料批价报价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ComContractAlterStuffPriceItem "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract/{id}/alter/stuffpriceitem
func (a *ComContractAlter) QueryStuffPriceItemByStuffPriceID(c *gin.Context) {
	var params schema.ComContractAlterQueryParam
	StuffPriceID := c.Param("id")

	result, err := a.ComContractAlterBll.QueryStuffPriceItemByStuffPriceID(ginplus.NewContext(c), StuffPriceID, params, schema.ComContractAlterQueryOptions{
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
// @Router GET /api/v1/com-contract-alter
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
// @Router GET /api/v1/com-contract-alter/{id}
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
// @Router POST /api/v1/com-contract-alter
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
// @Router PUT /api/v1/com-contract-alter/{id}
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
// @Router DELETE /api/v1/com-contract-alter/{id}
func (a *ComContractAlter) Delete(c *gin.Context) {
	err := a.ComContractAlterBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

/*  ==========   Design  start ==========  */

// GetDesign 查询指定设计变更数据
// @Tags 变更管理
// @Summary 查询指定设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ComContractAlterDesign
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/design/{id}
func (a *ComContractAlter) GetDesign(c *gin.Context) {
	item, err := a.ComContractAlterBll.GetDesign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// CreateDesign 创建设计变更数据
// @Tags 变更管理
// @Summary 创建设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContractAlterDesign true "创建数据"
// @Success 200 schema.ComContractAlterDesign
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contract-alter/design
func (a *ComContractAlter) CreateDesign(c *gin.Context) {
	var item schema.ComContractAlterDesign
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractAlterBll.CreateDesign(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateDesign 更新设计变更数据
// @Tags 变更管理
// @Summary 更新设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterDesign true "更新数据"
// @Success 200 schema.ComContractAlterDesign
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/design/{id}
func (a *ComContractAlter) UpdateDesign(c *gin.Context) {
	var item schema.ComContractAlterDesign
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ComContractAlterBll.UpdateDesign(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// CommitDesign 设计变更 提交审核
// @Tags 变更管理
// @Summary 将设计变更信息 提交审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/design/{id}/commit
func (a *ComContractAlter) CommitDesign(c *gin.Context) {

	err := a.ComContractAlterBll.CommitDesign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// PassCheckDesign 设计变更 通过审核
// @Tags 变更管理
// @Summary 将设计变更信息 通过审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/design/{id}/passcheck
func (a *ComContractAlter) PassCheckDesign(c *gin.Context) {

	err := a.ComContractAlterBll.PassCheckDesign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// RebackDesign 设计变更 审核退回
// @Tags 变更管理
// @Summary 将设计变更信息 审核退回
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/design/{id}/reback
func (a *ComContractAlter) RebackDesign(c *gin.Context) {

	err := a.ComContractAlterBll.RebackDesign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// AffirmDesign 设计变更确认
// @Tags 变更管理
// @Summary 确认设计变更信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterDesignAffirmInfo true "设计变更确认信息"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/design/{id}/affirm
func (a *ComContractAlter) AffirmDesign(c *gin.Context) {
	var info schema.ComContractAlterDesignAffirmInfo
	if err := ginplus.ParseJSON(c, &info); err != nil {
		ginplus.ResError(c, err)
		return
	}
	err := a.ComContractAlterBll.AffirmDesign(ginplus.NewContext(c), c.Param("id"), info)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// DeleteDesign 删除设计变更数据
// @Tags 变更管理
// @Summary 删除设计变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contract-alter/design/{id}
func (a *ComContractAlter) DeleteDesign(c *gin.Context) {
	err := a.ComContractAlterBll.DeleteDesign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

/*  ==========   Sign  start ==========  */

// GetSign 查询指定签证变更数据
// @Tags 变更管理
// @Summary 查询指定签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ComContractAlterSign
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/sign/{id}
func (a *ComContractAlter) GetSign(c *gin.Context) {
	item, err := a.ComContractAlterBll.GetSign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// CreateSign 创建签证变更数据
// @Tags 变更管理
// @Summary 创建签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContractAlterSign true "创建数据"
// @Success 200 schema.ComContractAlterSign
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contract-alter/sign
func (a *ComContractAlter) CreateSign(c *gin.Context) {
	var item schema.ComContractAlterSign
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractAlterBll.CreateSign(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateSign 更新签证变更数据
// @Tags 变更管理
// @Summary 更新签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterSign true "更新数据"
// @Success 200 schema.ComContractAlterSign
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/sign/{id}
func (a *ComContractAlter) UpdateSign(c *gin.Context) {
	var item schema.ComContractAlterSign
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ComContractAlterBll.UpdateSign(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// CommitSign 签证变更 提交审核
// @Tags 变更管理
// @Summary 将签证变更信息 提交审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/sign/{id}/commit
func (a *ComContractAlter) CommitSign(c *gin.Context) {

	err := a.ComContractAlterBll.CommitSign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// PassCheckSign 签证变更 通过审核
// @Tags 变更管理
// @Summary 将签证变更信息 通过审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/sign/{id}/passcheck
func (a *ComContractAlter) PassCheckSign(c *gin.Context) {

	err := a.ComContractAlterBll.PassCheckSign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// RebackSign 签证变更 审核退回
// @Tags 变更管理
// @Summary 将签证变更信息 审核退回
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/sign/{id}/reback
func (a *ComContractAlter) RebackSign(c *gin.Context) {

	err := a.ComContractAlterBll.RebackSign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// AffirmSign 签证变更确认
// @Tags 变更管理
// @Summary 确认签证变更信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterSignAffirmInfo true "设计变更确认信息"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/sign/{id}/affirm
func (a *ComContractAlter) AffirmSign(c *gin.Context) {
	var info schema.ComContractAlterSignAffirmInfo
	if err := ginplus.ParseJSON(c, &info); err != nil {
		ginplus.ResError(c, err)
		return
	}

	err := a.ComContractAlterBll.AffirmSign(ginplus.NewContext(c), c.Param("id"), info)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// DeleteSign 删除签证变更数据
// @Tags 变更管理
// @Summary 删除签证变更数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contract-alter/sign/{id}
func (a *ComContractAlter) DeleteSign(c *gin.Context) {
	err := a.ComContractAlterBll.DeleteSign(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

/*  ==========   StuffPrice  start ==========  */

// GetStuffPrice 查询指定材料批价数据
// @Tags 变更管理
// @Summary 查询指定材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ComContractAlterStuffPrice
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/stuffprice/{id}
func (a *ComContractAlter) GetStuffPrice(c *gin.Context) {
	item, err := a.ComContractAlterBll.GetStuffPrice(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// CreateStuffPrice 创建材料批价数据
// @Tags 变更管理
// @Summary 创建材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContractAlterStuffPrice true "创建数据"
// @Success 200 schema.ComContractAlterStuffPrice
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contract-alter/stuffprice
func (a *ComContractAlter) CreateStuffPrice(c *gin.Context) {
	var item schema.ComContractAlterStuffPrice
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractAlterBll.CreateStuffPrice(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateStuffPrice 更新材料批价数据
// @Tags 变更管理
// @Summary 更新材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterStuffPrice true "更新数据"
// @Success 200 schema.ComContractAlterStuffPrice
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/stuffprice/{id}
func (a *ComContractAlter) UpdateStuffPrice(c *gin.Context) {
	var item schema.ComContractAlterStuffPrice
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ComContractAlterBll.UpdateStuffPrice(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// CommitStuffPrice 材料批价 提交审核
// @Tags 变更管理
// @Summary 将材料批价信息 提交审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/stuffprice/{id}/commit
func (a *ComContractAlter) CommitStuffPrice(c *gin.Context) {

	err := a.ComContractAlterBll.CommitStuffPrice(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// PassCheckStuffPrice 材料批价 通过审核
// @Tags 变更管理
// @Summary 将材料批价信息 通过审核
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/stuffprice/{id}/passcheck
func (a *ComContractAlter) PassCheckStuffPrice(c *gin.Context) {

	err := a.ComContractAlterBll.PassCheckStuffPrice(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// RebackStuffPrice 材料批价 审核退回
// @Tags 变更管理
// @Summary 将材料批价信息 审核退回
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/stuffprice/{id}/reback
func (a *ComContractAlter) RebackStuffPrice(c *gin.Context) {

	err := a.ComContractAlterBll.RebackStuffPrice(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// DeleteStuffPrice 删除材料批价数据
// @Tags 变更管理
// @Summary 删除材料批价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contract-alter/stuffprice/{id}
func (a *ComContractAlter) DeleteStuffPrice(c *gin.Context) {
	err := a.ComContractAlterBll.DeleteStuffPrice(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

/*  ==========   StuffPriceItem  start ==========  */

// GetStuffPriceItem 查询指定材料批价报价数据
// @Tags 变更管理
// @Summary 查询指定材料批价报价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ComContractAlterStuffPriceItem
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/com-contract-alter/stuffpriceitem/{id}
func (a *ComContractAlter) GetStuffPriceItem(c *gin.Context) {
	item, err := a.ComContractAlterBll.GetStuffPriceItem(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// CreateStuffPriceItem 创建材料批价报价数据
// @Tags 变更管理
// @Summary 创建材料批价报价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ComContractAlterStuffPriceItem true "创建数据"
// @Success 200 schema.ComContractAlterStuffPriceItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/com-contract-alter/stuffpriceitem
func (a *ComContractAlter) CreateStuffPriceItem(c *gin.Context) {
	var item schema.ComContractAlterStuffPriceItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ComContractAlterBll.CreateStuffPriceItem(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateStuffPriceItem 更新材料批价报价数据
// @Tags 变更管理
// @Summary 更新材料批价报价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ComContractAlterStuffPriceItem true "更新数据"
// @Success 200 schema.ComContractAlterStuffPriceItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/com-contract-alter/stuffpriceitem/{id}
func (a *ComContractAlter) UpdateStuffPriceItem(c *gin.Context) {
	var item schema.ComContractAlterStuffPriceItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ComContractAlterBll.UpdateStuffPriceItem(ginplus.NewContext(c), c.Param("id"), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// DeleteStuffPriceItem 删除材料批价报价数据
// @Tags 变更管理
// @Summary 删除材料批价报价数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/com-contract-alter/stuffpriceitem/{id}
func (a *ComContractAlter) DeleteStuffPriceItem(c *gin.Context) {
	err := a.ComContractAlterBll.DeleteStuffPriceItem(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
