package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjDynamicCost 项目动态成本业务逻辑接口
type IProjDynamicCost interface {

	//查询成本科目树结构
	QueryCostTree(ctx context.Context, projectID string) (schema.ProjDynamicCostTrees, error)
}
