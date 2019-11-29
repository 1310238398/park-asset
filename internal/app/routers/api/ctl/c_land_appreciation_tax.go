package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewLandAppreciationTax 创建土地增值税控制器
func NewLandAppreciationTax(bLandAppreciationTax bll.ILandAppreciationTax) *LandAppreciationTax {
	return &LandAppreciationTax{
		LandAppreciationTaxBll: bLandAppreciationTax,
	}
}

// LandAppreciationTax 土地增值税
// @Name LandAppreciationTax
// @Description 土地增值税控制器
type LandAppreciationTax struct {
	LandAppreciationTaxBll bll.ILandAppreciationTax
}

// Query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 schema.LandAppreciationTax
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/land-appreciation-taxes
func (a *LandAppreciationTax) Query(c *gin.Context) {
	projectID := c.Query("projectID")
	if projectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
	}

	result, err := a.LandAppreciationTaxBll.GetByProjectID(ginplus.NewContext(c), projectID)
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
// @Success 200 schema.LandAppreciationTax
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/land-appreciation-taxes/{id}
func (a *LandAppreciationTax) Get(c *gin.Context) {
	item, err := a.LandAppreciationTaxBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.LandAppreciationTax true
// @Success 200 schema.LandAppreciationTax
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/land-appreciation-taxes
func (a *LandAppreciationTax) Create(c *gin.Context) {
	var item schema.LandAppreciationTax
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.LandAppreciationTaxBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.LandAppreciationTax true
// @Success 200 schema.LandAppreciationTax
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/land-appreciation-taxes/{id}
func (a *LandAppreciationTax) Update(c *gin.Context) {
	var item schema.LandAppreciationTax
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.LandAppreciationTaxBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/land-appreciation-taxes/{id}
func (a *LandAppreciationTax) Delete(c *gin.Context) {
	err := a.LandAppreciationTaxBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
