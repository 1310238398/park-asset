package internal

import (
	"context"
	"gxt-park-assets/internal/app/bll"

	// "gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	// "gxt-park-assets/pkg/util"
)

// NewProjDeliveryStandard 创建成本项目交付标准
func NewProjDynamicCost(mTrans model.ITrans) bll.IProjDeliveryStandard {
	return &ProjDeliveryStandard{
		Trans: mTrans,
	}
}

// ProjDynamicCost 动态成本业务逻辑
type ProjDynamicCost struct {
	Trans model.ITrans
}

//TODO QueryCostTree 查询成本科目树结构
func (a *ProjDynamicCost) QueryCostTree(ctx context.Context, projectID string) ([]*schema.ProjDynamicCostTree, error) {
	example := []*schema.ProjDynamicCostTree{
		&schema.ProjDynamicCostTree{
			CostID: "111",
			Children: []*schema.ProjDynamicCostTree{
				&schema.ProjDynamicCostTree{},
			},
		},
	}
	return example, nil
}
