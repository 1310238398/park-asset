package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/gin-gonic/gin"
)

// NewApartment 创建公寓管理控制器
func NewApartment(bApartment bll.IApartment) *Apartment {
	return &Apartment{
		ApartmentBll: bApartment,
	}
}

// Apartment 公寓管理
// @Name Apartment
// @Description 公寓管理控制器
type Apartment struct {
	ApartmentBll bll.IApartment
}

// Query 查询数据
func (a *Apartment) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	default:
		ginplus.ResError(c, errors.ErrUnknownQuery)
	}
}

// QueryPage 查询分页数据
// @Summary 查询分页数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param project_id query string true "项目ID"
// @Param name query string false "建筑名称（模糊查询）"
// @Param building_type query int false "建筑类型: 1:楼栋 2:单元 3:楼层 4:门牌"
// @Param is_all_rent query int false "是否全部出租:(1是 2否)"
// @Param rent_status query int false "出租状态:1未租 2锁定 3已租"
// @Success 200 []schema.Apartment "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/apartments?q=page
func (a *Apartment) QueryPage(c *gin.Context) {
	var params schema.ApartmentQueryParam
	params.ProjectID = c.Query("project_id")
	if params.ProjectID == "" {
		ginplus.ResError(c, errors.ErrBadRequest)
		return
	}
	params.LikeName = c.Query("name")
	params.BuildingType = util.S(c.Query("building_type")).DefaultInt(0)
	params.IsAllRent = util.S(c.Query("is_all_rent")).DefaultInt(0)
	params.RentStatus = util.S(c.Query("rent_status")).DefaultInt(0)

	result, err := a.ApartmentBll.Query(ginplus.NewContext(c), params, schema.ApartmentQueryOptions{
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
// @Success 200 schema.Apartment
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/apartments/{id}
func (a *Apartment) Get(c *gin.Context) {
	item, err := a.ApartmentBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.Apartment true
// @Success 200 schema.Apartment
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/apartments
func (a *Apartment) Create(c *gin.Context) {
	var item schema.Apartment
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.ApartmentBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.Apartment true
// @Success 200 schema.Apartment
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/apartments/{id}
func (a *Apartment) Update(c *gin.Context) {
	var item schema.Apartment
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ApartmentBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/apartments/{id}
func (a *Apartment) Delete(c *gin.Context) {
	err := a.ApartmentBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
