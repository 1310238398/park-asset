package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjCostItem 创建项目成本项控制器
func NewProjCostItem(bProjCostItem bll.IProjCostItem) *ProjCostItem {
	return &ProjCostItem{
		ProjCostItemBll: bProjCostItem,
	}
}

// ProjCostItem 项目成本项
// @Name ProjCostItem
// @Description 项目成本项控制器
type ProjCostItem struct {
	ProjCostItemBll bll.IProjCostItem
}

func (a *ProjCostItem) Query(c *gin.Context) {
	q := c.Query("q")
	switch q {
	case "tree":
		a.queryTree(c)
	case "node":
		a.QueryNodeTree(c)
	default:
		a.queryTree(c)
	}
}

// queryTree 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Param show query string true "展示方式" map
// @Success 200 []schema.ProjCostItemShow "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-cost-items?q=tree
func (a *ProjCostItem) queryTree(c *gin.Context) {
	var params schema.ProjCostItemQueryParam
	params.ProjectID = c.Query("projectID")

	err := a.ProjCostItemBll.Init(ginplus.NewContext(c), params.ProjectID)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	result, err := a.ProjCostItemBll.QueryTree(ginplus.NewContext(c), params)
	if err != nil {
		return
	}
	if show := c.Query("show"); show == "map" {
		mapResult := []map[string]interface{}{}
		for _, v := range result {
			mapResult = append(mapResult, v.ToMap())
		}
		ginplus.ResSuccess(c, mapResult)
	} else {
		ginplus.ResSuccess(c, result)
	}
}

// QueryNodeTree 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []schema.ProjCostItemShow "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-cost-items?q=node
func (a *ProjCostItem) QueryNodeTree(c *gin.Context) {
	var params schema.ProjCostItemQueryParam
	params.ProjectID = c.Query("projectID")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	result, err := a.ProjCostItemBll.QueryTree(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResList(c, result.ToNodeTrees())
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjCostItemShow "项目成本项"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-cost-items/{id}
func (a *ProjCostItem) Get(c *gin.Context) {
	item, err := a.ProjCostItemBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjCostItem true
// @Success 200 schema.ProjCostItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-cost-items
func (a *ProjCostItem) Create(c *gin.Context) {
	var item schema.ProjCostItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjCostItemBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjCostItem true
// @Success 200 schema.ProjCostItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-cost-items/{id}
func (a *ProjCostItem) Update(c *gin.Context) {
	var item schema.ProjCostItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}
	recordID := c.Param("id")
	if recordID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	nitem, err := a.ProjCostItemBll.Update(ginplus.NewContext(c), recordID, item)
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
// @Router DELETE /api/v1/proj-cost-items/{id}
func (a *ProjCostItem) Delete(c *gin.Context) {
	err := a.ProjCostItemBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
