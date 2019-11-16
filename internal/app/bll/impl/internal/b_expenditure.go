package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewExpenditure 创建支出节点
func NewExpenditure(mExpenditure model.IExpenditure) *Expenditure {
	return &Expenditure{
		ExpenditureModel: mExpenditure,
	}
}

// Expenditure 支出节点业务逻辑
type Expenditure struct {
	ExpenditureModel model.IExpenditure
}

// Query 查询数据
func (a *Expenditure) Query(ctx context.Context, params schema.ExpenditureQueryParam, opts ...schema.ExpenditureQueryOptions) (*schema.ExpenditureQueryResult, error) {
	return a.ExpenditureModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Expenditure) Get(ctx context.Context, recordID string, opts ...schema.ExpenditureQueryOptions) (*schema.Expenditure, error) {
	item, err := a.ExpenditureModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Expenditure) getUpdate(ctx context.Context, recordID string) (*schema.Expenditure, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Expenditure) Create(ctx context.Context, item schema.Expenditure) (*schema.Expenditure, error) {
	item.RecordID = util.MustUUID()
	err := a.ExpenditureModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Expenditure) Update(ctx context.Context, recordID string, item schema.Expenditure) (*schema.Expenditure, error) {
	oldItem, err := a.ExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ExpenditureModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Expenditure) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ExpenditureModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ExpenditureModel.Delete(ctx, recordID)
}
