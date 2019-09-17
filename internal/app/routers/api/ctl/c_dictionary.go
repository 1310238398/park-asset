package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewDictionary 创建字典管理控制器
func NewDictionary(bDictionary bll.IDictionary) *Dictionary {
	return &Dictionary{
		DictionaryBll: bDictionary,
	}
}

// Dictionary 字典管理
// @Name Dictionary
// @Description 字典管理控制器
type Dictionary struct {
	DictionaryBll bll.IDictionary
}

// Query 查询数据
func (a *Dictionary) Query(c *gin.Context) {
	switch c.Query("q") {
	case "page":
		a.QueryPage(c)
	case "tree":
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
// @Param code query string false "字典编号(模糊查询)"
// @Param name query string false "字典名称(模糊查询)"
// @Param parent_id query string false "父级ID"
// @Success 200 []schema.Dictionary "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/dictionaries?q=page
func (a *Dictionary) QueryPage(c *gin.Context) {
	params := schema.DictionaryQueryParam{
		LikeCode: c.Query("code"),
		LikeName: c.Query("name"),
	}

	if v := c.Query("parent_id"); v != "" {
		params.ParentID = &v
	}

	result, err := a.DictionaryBll.Query(ginplus.NewContext(c), params, schema.DictionaryQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResPage(c, result.Data, result.PageResult)
}

// QueryTree 查询字典树
// @Summary 查询字典树
// @Param Authorization header string false "Bearer 用户令牌"
// @Param parent_code query string false "父级编号"
// @Param level query int false "层级(-1表示所有层级,0表示当前层级（默认为0）)"
// @Success 200 option.Interface "查询结果：{list:字典树}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/dictionaries?q=tree
func (a *Dictionary) QueryTree(c *gin.Context) {
	var params schema.DictionaryQueryParam

	switch c.Query("level") {
	case "-1":
		params.PrefixParentPath = c.Query("parent_code")
	default:
		params.ParentPath = c.Query("parent_code")
	}

	result, err := a.DictionaryBll.Query(ginplus.NewContext(c), params)
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
// @Success 200 schema.Dictionary
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/dictionaries/{id}
func (a *Dictionary) Get(c *gin.Context) {
	item, err := a.DictionaryBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.Dictionary true
// @Success 200 schema.Dictionary
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/dictionaries
func (a *Dictionary) Create(c *gin.Context) {
	var item schema.Dictionary
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	item.Creator = ginplus.GetUserID(c)
	nitem, err := a.DictionaryBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.Dictionary true
// @Success 200 schema.Dictionary
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/dictionaries/{id}
func (a *Dictionary) Update(c *gin.Context) {
	var item schema.Dictionary
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.DictionaryBll.Update(ginplus.NewContext(c), c.Param("id"), item)
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
// @Router DELETE /api/v1/dictionaries/{id}
func (a *Dictionary) Delete(c *gin.Context) {
	err := a.DictionaryBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
