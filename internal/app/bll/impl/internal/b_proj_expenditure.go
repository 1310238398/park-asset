package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpenditure 创建项目支出节点
func NewProjExpenditure(mProjExpenditure model.IProjExpenditure) *ProjExpenditure {
	return &ProjExpenditure{
		ProjExpenditureModel: mProjExpenditure,
	}
}

// ProjExpenditure 项目支出节点业务逻辑
type ProjExpenditure struct {
	ProjExpenditureModel model.IProjExpenditure
}

// Query 查询数据
func (a *ProjExpenditure) Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error) {
	return a.ProjExpenditureModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjExpenditure) Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditure, error) {
	item, err := a.ProjExpenditureModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjExpenditure) getUpdate(ctx context.Context, recordID string) (*schema.ProjExpenditure, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjExpenditure) Create(ctx context.Context, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjExpenditureModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjExpenditure) Update(ctx context.Context, recordID string, item schema.ProjExpenditure) (*schema.ProjExpenditure, error) {
	oldItem, err := a.ProjExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjExpenditureModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjExpenditure) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjExpenditureModel.Delete(ctx, recordID)
}
