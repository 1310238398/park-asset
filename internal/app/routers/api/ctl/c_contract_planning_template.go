package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewContractPlanningTemplate 创建合约规划模板控制器
func NewContractPlanningTemplate(bContractPlanningTemplate bll.IContractPlanningTemplate) *ContractPlanningTemplate {
	return &ContractPlanningTemplate{
		ContractPlanningTemplateBll: bContractPlanningTemplate,
	}
}

// ContractPlanningTemplate 合约规划模板
// @Name ContractPlanningTemplate
// @Description 合约规划模板控制器
type ContractPlanningTemplate struct {
	ContractPlanningTemplateBll bll.IContractPlanningTemplate
}

// Query 查询数据
func (a *ContractPlanningTemplate) Query(c *gin.Context) {
	switch c.Query("q") {
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
// @Param name query string false "合同名称(模糊查询)"
// @Param cost_id query string false "成本项ID"
// @Success 200 []schema.ContractPlanningTemplate "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/contract-planning-templates?q=page
func (a *ContractPlanningTemplate) QueryPage(c *gin.Context) {
	var params schema.ContractPlanningTemplateQueryParam
	params.LikeName = c.Query("name")
	params.CostID = c.Query("cost_id")

	result, err := a.ContractPlanningTemplateBll.Query(ginplus.NewContext(c), params, schema.ContractPlanningTemplateQueryOptions{
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
// @Success 200 schema.ContractPlanningTemplate
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/contract-planning-templates/{id}
func (a *ContractPlanningTemplate) Get(c *gin.Context) {
	item, err := a.ContractPlanningTemplateBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ContractPlanningTemplate true
// @Success 200 schema.ContractPlanningTemplate
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/contract-planning-templates
func (a *ContractPlanningTemplate) Create(c *gin.Context) {
	var item schema.ContractPlanningTemplate
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ContractPlanningTemplateBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ContractPlanningTemplate true
// @Success 200 schema.ContractPlanningTemplate
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/contract-planning-templates/{id}
func (a *ContractPlanningTemplate) Update(c *gin.Context) {
	var item schema.ContractPlanningTemplate
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ContractPlanningTemplateBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/contract-planning-templates/{id}
func (a *ContractPlanningTemplate) Delete(c *gin.Context) {
	err := a.ContractPlanningTemplateBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
