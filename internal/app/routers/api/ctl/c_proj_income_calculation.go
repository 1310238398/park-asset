package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"
	"strings"

	"github.com/gin-gonic/gin"
)

// NewProjIncomeCalculation 创建项目收益测算控制器
func NewProjIncomeCalculation(bProjIncomeCalculation bll.IProjIncomeCalculation) *ProjIncomeCalculation {
	return &ProjIncomeCalculation{
		ProjIncomeCalculationBll: bProjIncomeCalculation,
	}
}

// ProjIncomeCalculation 项目收益测算
// @Name ProjIncomeCalculation
// @Description 项目收益测算控制器
type ProjIncomeCalculation struct {
	ProjIncomeCalculationBll bll.IProjIncomeCalculation
}

func (a *ProjIncomeCalculation) Query(c *gin.Context) {
	q := c.Query("q")
	switch q {
	case "list":
		a.query(c)
	case "current":
		a.getCurrent(c)
	default:
		a.query(c)
	}
}

// Query 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param current query int true "分页索引" 1
// @Param pageSize query int true "分页大小" 10
// @Success 200 []schema.ProjIncomeCalculation "查询结果：{list:列表数据,pagination:{current:页索引,pageSize:页大小,total:总数量}}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-income-calculations?q=list
func (a *ProjIncomeCalculation) query(c *gin.Context) {
	var params schema.ProjIncomeCalculationQueryParam

	result, err := a.ProjIncomeCalculationBll.Query(ginplus.NewContext(c), params, schema.ProjIncomeCalculationQueryOptions{
		PageParam: ginplus.GetPaginationParam(c),
	})
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResPage(c, result.Data, result.PageResult)
}

// getCurrent 查询数据
// @Summary 查询数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 schema.ProjIncomeCalculationResult "查询结果：{info:原始数据,list:列表数据}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-income-calculations?q=current
func (a *ProjIncomeCalculation) getCurrent(c *gin.Context) {
	projectID := c.Query("projectID")
	if projectID == "" {
		ginplus.ResError(c, errors.ErrInvalidRequestParameter)
		return
	}
	if err := a.ProjIncomeCalculationBll.Renew(ginplus.NewContext(c), projectID); err != nil {
		ginplus.ResError(c, errors.ErrInvalidRequestParameter)
		return
	}

	result, err := a.ProjIncomeCalculationBll.GetCurrent(ginplus.NewContext(c), projectID)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	if result == nil {
		result = new(schema.ProjIncomeCalculation)
	}
	ginplus.ResSuccess(c, result.ToProjIncomeCalculationResult())
}

// Get 查询指定数据
// @Summary 查询指定数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.ProjIncomeCalculation
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 404 schema.HTTPError "{error:{code:0,message:资源不存在}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-income-calculations/{id}
func (a *ProjIncomeCalculation) Get(c *gin.Context) {
	item, err := a.ProjIncomeCalculationBll.Get(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, item)
}

// Create 创建数据
// @Summary 创建数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param body body schema.ProjIncomeCalculation true
// @Success 200 schema.ProjIncomeCalculation
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-income-calculations
func (a *ProjIncomeCalculation) Create(c *gin.Context) {
	var item schema.ProjIncomeCalculation
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	nitem, err := a.ProjIncomeCalculationBll.Create(ginplus.NewContext(c), item)
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
// @Param body body schema.ProjIncomeItem true
// @Success 200 schema.HTTPStatus "{status:"OK"}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-income-calculations/{id}
func (a *ProjIncomeCalculation) Update(c *gin.Context) {
	var item schema.ProjIncomeItem
	if err := ginplus.ParseJSON(c, &item); err != nil {
		ginplus.ResError(c, err)
		return
	}

	err := a.ProjIncomeCalculationBll.UpdateMemo(ginplus.NewContext(c), c.Param("id"), item.Index, item.Memo)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// Delete 删除数据
// @Summary 删除数据
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "记录ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router DELETE /api/v1/proj-income-calculations/{id}
func (a *ProjIncomeCalculation) Delete(c *gin.Context) {
	err := a.ProjIncomeCalculationBll.Delete(ginplus.NewContext(c), c.Param("id"))
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// CreateVersion 保存新版本
// @Summary 保存新版本
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Param body body schema.VersionRequest true
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/proj-version/:id
func (a *ProjIncomeCalculation) CreateVersion(c *gin.Context) {
	projectID := c.Param("id")

	req := schema.VersionRequest{}

	if err := ginplus.ParseJSON(c, &req); err != nil {
		ginplus.ResError(c, err)
		return
	}

	if err := a.ProjIncomeCalculationBll.CreateVersion(ginplus.NewContext(c), projectID, req.Name, req.Change); err != nil {
		ginplus.ResError(c, err)
		return
	}
	return
}

// UpdateVersion 保存旧版本
// @Summary 保存旧版本
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Param body body schema.VersionRequest true
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-version/:id
func (a *ProjIncomeCalculation) UpdateVersion(c *gin.Context) {
	projectID := c.Param("id")

	req := schema.VersionRequest{}

	if err := ginplus.ParseJSON(c, &req); err != nil {
		ginplus.ResError(c, err)
		return
	}

	if err := a.ProjIncomeCalculationBll.UpdateVersion(ginplus.NewContext(c), projectID, req.Change); err != nil {
		ginplus.ResError(c, err)
		return
	}
	return
}

// QueryVersionCompare 查询版本对比版本
// @Summary 查询版本对比版本
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Param list query string true "版本ID列表,逗号分隔允许current、last、beforeLast"
// @Success 200 []schema.ProjCompareItem
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-version/:id/compare
func (a *ProjIncomeCalculation) QueryVersionCompare(c *gin.Context) {
	projectID := c.Param("id")
	versions := strings.Split(c.Query("list"), ",")

	result, err := a.ProjIncomeCalculationBll.GetVersionComparison(
		ginplus.NewContext(c), projectID, versions...)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResSuccess(c, result)
}

// Apply 收益测试审核申请
// @Summary 收益测试审核申请
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-version/:id/apply
func (a *ProjIncomeCalculation) Apply(c *gin.Context) {
	projectID := c.Param("id")

	err := a.ProjIncomeCalculationBll.Apply(ginplus.NewContext(c), projectID)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// Pass 通过收益测试审核申请
// @Summary 通过收益测试审核申请
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-version/:id/pass
func (a *ProjIncomeCalculation) Pass(c *gin.Context) {
	projectID := c.Param("id")

	err := a.ProjIncomeCalculationBll.Pass(ginplus.NewContext(c), projectID)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}

// Reject 驳回收益测试审核申请
// @Summary 驳回收益测试审核申请
// @Param Authorization header string false "Bearer 用户令牌"
// @Param id path string true "项目ID"
// @Success 200 schema.HTTPStatus "{status:OK}"
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router PUT /api/v1/proj-version/:id/reject
func (a *ProjIncomeCalculation) Reject(c *gin.Context) {
	projectID := c.Param("id")

	err := a.ProjIncomeCalculationBll.Reject(ginplus.NewContext(c), projectID)
	if err != nil {
		ginplus.ResError(c, err)
		return
	}
	ginplus.ResOK(c)
}
