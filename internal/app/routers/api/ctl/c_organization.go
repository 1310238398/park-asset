package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/gin-gonic/gin"
)

// NewOrganization 创建组织机构管理控制器
func NewOrganization(bOrganization bll.IOrganization) *Organization {
	return &Organization{
		OrganizationBll: bOrganization,
	}
}

// Organization 组织机构管理
// @Name Organization
// @Description 组织机构管理控制器
type Organization struct {
	OrganizationBll bll.IOrganization
}

// Query 查询数据
func (a *Organization) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	case "tree":
		a.QueryTree(c)
	case "company":
		a.QueryCompany(c)
	default:
		ginplus.ResError(c, errors.ErrUnknownQuery)
	}
}

// QueryPage 查询分页数据
// @Summary 查询分页数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Param name query string false "机构名称(模糊查询)"
// @Param org_type query int false "机构类型"
// @Param parent_id query string false "父级ID"
// @Success 200 []schema.Organization "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/organizations?q=page
func (a *Organization) QueryPage(c *gin.Context) {
	var params schema.OrganizationQueryParam
	params.LikeName = c.Query("name")
	params.OrgType = util.S(c.Query("org_type")).DefaultInt(0)
	if v := c.Query("parent_id"); v != "" {
		params.ParentID = &v
	}

	result, err := a.OrganizationBll.Query(ginplus.NewContext(c), params, schema.OrganizationQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryTree 查询组织机构树
// @Summary 查询组织机构树
// @Param Authorization header string false "Bearer 用户令牌"
// @Param parent_code query string false "父级编号"
// @Param level query int false "层级(-1表示所有层级,0表示当前层级（默认为0）)"
// @Success 200 option.Interface "查询结果：{list:组织机构树}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/organizations?q=tree
func (a *Organization) QueryTree(c *gin.Context) {
	var params schema.OrganizationQueryParam

	switch c.Query("level") {
	case "-1":
		params.PrefixParentPath = c.Query("parent_code")
	default:
		params.ParentPath = c.Query("parent_code")
	}

	result, err := a.OrganizationBll.Query(ginplus.NewContext(c), params)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, result.Data.ToTrees().ToTree())
}

// QueryCompany 查询二级子公司列表
// @Summary 查询二级子公司列表
// @Param Authorization header string false "Bearer 用户令牌"
// @Success 200 []schema.Organization "查询结果：{list:组织机构树}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/organizations?q=company
func (a *Organization) QueryCompany(c *gin.Context) {
	result, err := a.OrganizationBll.QueryCompany(ginplus.NewContext(c), ginplus.GetUserID(c))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResList(c, result.Data.ToTrees().ToTree())
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.Organization
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/organizations/{id}
func (a *Organization) Get(c *gin.Context) {
	item, err := a.OrganizationBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.Organization true
// @Success 200 schema.Organization
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/organizations
func (a *Organization) Create(c *gin.Context) {
	var item schema.Organization
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.OrganizationBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.Organization true
// @Success 200 schema.Organization
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/organizations/{id}
func (a *Organization) Update(c *gin.Context) {
	var item schema.Organization
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.OrganizationBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/organizations/{id}
func (a *Organization) Delete(c *gin.Context) {
	err := a.OrganizationBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
