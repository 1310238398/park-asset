package ctl

import (
	"ant-smartpark/pkg/errors"
	"fmt"
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjBusinessFormat 创建项目业态控制器
func NewProjBusinessFormat(bProjBusinessFormat bll.IProjBusinessFormat) *ProjBusinessFormat {
	return &ProjBusinessFormat{
		ProjBusinessFormatBll: bProjBusinessFormat,
	}
}

// ProjBusinessFormat 项目业态
// @Name ProjBusinessFormat
// @Description 项目业态控制器
type ProjBusinessFormat struct {
	ProjBusinessFormatBll bll.IProjBusinessFormat
}

// Query 查询数据
func (a *ProjBusinessFormat) Query(c *gin.Context) {
	switch c.Query("q") {
	case "list":
		a.QueryList(c)
	default:
		ginplus.ResError(c, errors.NewBadRequestError("未知的查询类型"))
	}
}

// QueryList 查询列表数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param project_id query string ture "项目ID"
// @Param business_format_id query string ture "业态ID"
// @Success 200 []schema.ProjBusinessFormat "查询结果：{list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-business-formats?q=list
func (a *ProjBusinessFormat) QueryList(c *gin.Context) {
	var params schema.ProjBusinessFormatQueryParam
	params.ProjectID = c.Query("project_id")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	params.BusinessFormatID = c.Query("business_format_id")
	result, err := a.ProjBusinessFormatBll.Query(ginplus.NewContext(c), params)
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
// @Success 200 schema.ProjBusinessFormat
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-business-formats/{id}
func (a *ProjBusinessFormat) Get(c *gin.Context) {
	item, err := a.ProjBusinessFormatBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjBusinessFormat true
// @Success 200 schema.ProjBusinessFormat
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-business-formats
func (a *ProjBusinessFormat) Create(c *gin.Context) {
	var item schema.ProjBusinessFormat
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjBusinessFormatBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjBusinessFormat true
// @Success 200 schema.ProjBusinessFormat
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-business-formats/{id}
func (a *ProjBusinessFormat) Update(c *gin.Context) {
	var item schema.ProjBusinessFormat
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjBusinessFormatBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-business-formats/{id}
func (a *ProjBusinessFormat) Delete(c *gin.Context) {
	err := a.ProjBusinessFormatBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// UpdateList 更新数据
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body []schema.ProjBusinessFormat true
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-business-formats/update_list
func (a *ProjBusinessFormat) UpdateList(c *gin.Context) {
	var items schema.ProjBusinessFormats
	if err := ginplus.ParseJSON(c, &items); err != nil {
		ginplus.ResError(c, err)
		return
	}
	if len(items) == 0 {
		return
	}
	for _, item := range items {
		fmt.Println(item)
	}
	err := a.ProjBusinessFormatBll.UpdateList(ginplus.NewContext(c), items[0].ProjectID, items)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)

}
