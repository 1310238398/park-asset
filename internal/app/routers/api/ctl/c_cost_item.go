package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewCostItem 创建成本项控制器
func NewCostItem(bCostItem bll.ICostItem) *CostItem {
	return &CostItem{
		CostItemBll: bCostItem,
	}
}

// CostItem 成本项
// @Name CostItem
// @Description 成本项控制器
type CostItem struct {
	CostItemBll bll.ICostItem
}

// Query 查询数据
func (a *CostItem) Query(c *gin.Context) {
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

// query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.CostItem "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/cost-items?q=list
func (a *CostItem) query(c *gin.Context) {
	var params schema.CostItemQueryParam

	result, err := a.CostItemBll.Query(ginplus.NewContext(c), params, schema.CostItemQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// queryTree 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param show query string false "展示方式" map
// @Success 200 []schema.CostItem "查询结果：列表数据"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/cost-items?q=tree
func (a *CostItem) queryTree(c *gin.Context) {
	var params schema.CostItemQueryParam

	result, err := a.CostItemBll.QueryTree(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	if show := c.Query("show"); show == "map" {
		mapResult := []map[string]interface{}{}
		deep := 0
		for _, v := range result {
			mapResult = append(mapResult, v.ToMap(&deep))
		}

		ginplus.ResSuccess(c, schema.CostResult{
			Deep: deep,
			Tree: mapResult,
		})
	} else {
		ginplus.ResSuccess(c, result)
	}
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.CostItem
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/cost-items/{id}
func (a *CostItem) Get(c *gin.Context) {
	item, err := a.CostItemBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.CostItem true
// @Success 200 schema.CostItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/cost-items
func (a *CostItem) Create(c *gin.Context) {
	var item schema.CostItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.CostItemBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.CostItem true
// @Success 200 schema.CostItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/cost-items/{id}
func (a *CostItem) Update(c *gin.Context) {
	var item schema.CostItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.CostItemBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/cost-items/{id}
func (a *CostItem) Delete(c *gin.Context) {
	err := a.CostItemBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
