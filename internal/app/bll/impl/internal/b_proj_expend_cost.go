package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpendCost 创建项目支出节点成本项
func NewProjExpendCost(mProjExpendCost model.IProjExpendCost) *ProjExpendCost {
	return &ProjExpendCost{
		ProjExpendCostModel: mProjExpendCost,
	}
}

// ProjExpendCost 项目支出节点成本项业务逻辑
type ProjExpendCost struct {
	ProjExpendCostModel model.IProjExpendCost
}

// Query 查询数据
func (a *ProjExpendCost) Query(ctx context.Context, params schema.ProjExpendCostQueryParam, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCostQueryResult, error) {
	return a.ProjExpendCostModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjExpendCost) Get(ctx context.Context, recordID string, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCost, error) {
	item, err := a.ProjExpendCostModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjExpendCost) getUpdate(ctx context.Context, recordID string) (*schema.ProjExpendCost, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjExpendCost) Create(ctx context.Context, item schema.ProjExpendCost) (*schema.ProjExpendCost, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjExpendCostModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjExpendCost) Update(ctx context.Context, recordID string, item schema.ProjExpendCost) (*schema.ProjExpendCost, error) {
	oldItem, err := a.ProjExpendCostModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjExpendCostModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjExpendCost) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjExpendCostModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjExpendCostModel.Delete(ctx, recordID)
}
