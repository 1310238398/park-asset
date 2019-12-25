package ctl

import (
	// "gxt-park-assets/internal/app/bll"
	// "gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/internal/app/schema"

	"github.com/gin-gonic/gin"
)

// NewProjCostItem 创建项目成本项控制器
func NewProjDynamicCost() *ProjCostItem {
	return &ProjCostItem{}
}

// ProjDynamicCost 项目动态成本
// @Name ProjDynamicCost
// @Description 项目动态成本控制器
type ProjDynamicCost struct {
}

func (a *ProjDynamicCost) Query(c *gin.Context) {
	q := c.Query("q")
	switch q {
	case "costTree":
		a.queryCostTree(c)
	case "costSimpleTree":
		a.queryCostSimpleTree(c)
	case "simpleTree":
		a.querySimpleTree(c)
	default:
		a.querySimpleTree(c)
	}
}

// TODO queryCostTree 查询动态成本科目树结构
// @Summary 查询动态成本科目树结构
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicCostTree "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost?q=costTree
func (a *ProjDynamicCost) queryCostTree(c *gin.Context) {
	example := []*schema.ProjDynamicCostTree{
		&schema.ProjDynamicCostTree{
			CostID: "111",
			Children: []*schema.ProjDynamicCostTree{
				&schema.ProjDynamicCostTree{},
			},
		},
	}
	ginplus.ResSuccess(c, example)
}

// TODO queryCostSimpleTree 查询动态成本科目简化树结构
// @Summary 查询动态成本科目简化树结构
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicCostSimpleTree "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost?q=costSimpleTree
func (a *ProjDynamicCost) queryCostSimpleTree(c *gin.Context) {
	example := []*schema.ProjDynamicCostSimpleTree{
		&schema.ProjDynamicCostSimpleTree{
			CostID: "111",
			Children: []*schema.ProjDynamicCostSimpleTree{
				&schema.ProjDynamicCostSimpleTree{},
			},
		},
	}
	ginplus.ResSuccess(c, example)
}

// TODO querySimpleTree 查询动态成本简化树结构
// @Summary 查询动态成本简化树结构
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicSimpleTree "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost?q=simpleTree
func (a *ProjDynamicCost) querySimpleTree(c *gin.Context) {
	example := []*schema.ProjDynamicSimpleTree{
		&schema.ProjDynamicSimpleTree{
			CostID: "111",
			Children: []*schema.ProjDynamicSimpleTree{
				&schema.ProjDynamicSimpleTree{},
			},
		},
	}
	ginplus.ResSuccess(c, example)
}

// TODO GetProjDynamicCost 查询动态成本详情
// @Summary 查询动态成本详情
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 schema.ProjDynamicCost "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id
func (a *ProjDynamicCost) GetProjDynamicCost(c *gin.Context) {
	example := &schema.ProjDynamicCost{}
	ginplus.ResSuccess(c, example)
}

// TODO QueryProjDynamicPlanning 查询动态成本规划列表
// @Summary 查询动态成本规划列表
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicPlanning "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id/plans
func (a *ProjDynamicCost) QueryProjDynamicPlanning(c *gin.Context) {
	example := []*schema.ProjDynamicPlanning{
		&schema.ProjDynamicPlanning{},
	}
	ginplus.ResSuccess(c, example)
}

// TODO QueryProjDynamicSettled 查询科目结算信息
// @Summary 查询科目结算信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicSettled "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id/setteled
func (a *ProjDynamicCost) QueryProjDynamicSettled(c *gin.Context) {
	example := []*schema.ProjDynamicSettled{
		&schema.ProjDynamicSettled{},
	}
	ginplus.ResSuccess(c, example)
}

// TODO QueryProjDynamicUnsettled 查询科目待结算信息
// @Summary 查询科目结算信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicUnsettled "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id/unsettled
func (a *ProjDynamicCost) QueryProjDynamicUnsettled(c *gin.Context) {
	example := []*schema.ProjDynamicUnsettled{
		&schema.ProjDynamicUnsettled{},
	}
	ginplus.ResSuccess(c, example)
}

// TODO QueryProjDynamicOnApproval 查询科目在途信息
// @Summary 查询科目在途信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicOnApproval "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id/on-approval
func (a *ProjDynamicCost) QueryProjDynamicOnApproval(c *gin.Context) {
	example := []*schema.ProjDynamicOnApproval{
		&schema.ProjDynamicOnApproval{},
	}
	ginplus.ResSuccess(c, example)
}

// TODO QueryProjDynamicTransfer 查询科目调动信息
// @Summary 查询科目调动信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Success 200 []*schema.ProjDynamicTransfer "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router GET /api/v1/proj-dynamic-cost/:proj_cost_id/transfer
func (a *ProjDynamicCost) QueryProjDynamicTransfer(c *gin.Context) {
	example := []*schema.ProjDynamicTransfer{
		&schema.ProjDynamicTransfer{},
	}
	ginplus.ResSuccess(c, example)
}

// TODO CreateTransfer 资金调动
// @Summary 查询科目调动信息
// @Param Authorization header string false "Bearer 用户令牌"
// @Param projectID query string true "项目ID"
// @Param body body schema.ProjDynamicTransferRequest
// @Success 200 []*schema.ProjDynamicTransfer "数据列表"
// @Failure 400 schema.HTTPError "{error:{code:0,message:未知的查询类型}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router Post /api/v1/proj-dynamic-cost/transfer
func (a *ProjDynamicCost) CreateTransfer(c *gin.Context) {

	req := new(schema.ProjDynamicTransfer)
	if err := ginplus.ParseJSON(c, req); err != nil {
		ginplus.ResError(c, err)
		return
	}

	example := []*schema.ProjDynamicTransfer{
		&schema.ProjDynamicTransfer{},
	}
	ginplus.ResSuccess(c, example)
}
