package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjDeliveryStandard 创建成本项目交付标准控制器
func NewProjDeliveryStandard(bProjDeliveryStandard bll.IProjDeliveryStandard) *ProjDeliveryStandard {
	return &ProjDeliveryStandard{
		ProjDeliveryStandardBll: bProjDeliveryStandard,
	}
}

// ProjDeliveryStandard 成本项目交付标准
// @Name ProjDeliveryStandard
// @Description 成本项目交付标准控制器
type ProjDeliveryStandard struct {
	ProjDeliveryStandardBll bll.IProjDeliveryStandard
}

func (a *ProjDeliveryStandard) Query(c *gin.Context) {
	q := c.Query("q")
	switch q {
	case "list":
		a.query(c)
	case "tree":
		a.queryTree(c)
	default:
		a.query(c)
	}
}

// Query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ProjDeliveryStandard "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-delivery-standards?q=list
func (a *ProjDeliveryStandard) query(c *gin.Context) {
	var params schema.ProjDeliveryStandardQueryParam

	result, err := a.ProjDeliveryStandardBll.Query(ginplus.NewContext(c), params, schema.ProjDeliveryStandardQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// queryTree 查询树结构数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string  true "项目ID"
// @Success 200 []schema.ProjDeliveryStandard "列表数据"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-delivery-standards?q=tree
func (a *ProjDeliveryStandard) queryTree(c *gin.Context) {
	var params schema.ProjDeliveryStandardQueryParam
	params.ProjectID = c.Query("projectID")
	if params.ParentID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}

	result, err := a.ProjDeliveryStandardBll.QueryTree(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, result)
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjDeliveryStandard
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-delivery-standards/{id}
func (a *ProjDeliveryStandard) Get(c *gin.Context) {
	item, err := a.ProjDeliveryStandardBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjDeliveryStandard true
// @Success 200 schema.ProjDeliveryStandard
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-delivery-standards
func (a *ProjDeliveryStandard) Create(c *gin.Context) {
	var item schema.ProjDeliveryStandard
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjDeliveryStandardBll.Create(ginplus.NewContext(c), item)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, nitem)
}

// UpdateAll 更新数据
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ProjDeliveryStandard true
// @Success 200
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-delivery-standards
func (a *ProjDeliveryStandard) UpdateAll(c *gin.Context) {
	var item schema.ProjDeliveryStandards
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}
	projectID := item[0].ProjectID
	err := a.ProjDeliveryStandardBll.UpdateList(c, projectID, item)

	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// Update 更新数据
// @Summary 更新数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Param body body schema.ProjDeliveryStandard true
// @Success 200 schema.ProjDeliveryStandard
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-delivery-standards/{id}
func (a *ProjDeliveryStandard) Update(c *gin.Context) {
	var item schema.ProjDeliveryStandard
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjDeliveryStandardBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/proj-delivery-standards/{id}
func (a *ProjDeliveryStandard) Delete(c *gin.Context) {
	err := a.ProjDeliveryStandardBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
