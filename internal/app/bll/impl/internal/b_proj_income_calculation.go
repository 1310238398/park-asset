package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjIncomeCalculation 创建项目收益测算
func NewProjIncomeCalculation(mProjIncomeCalculation model.IProjIncomeCalculation) *ProjIncomeCalculation {
	return &ProjIncomeCalculation{
		ProjIncomeCalculationModel: mProjIncomeCalculation,
	}
}

// ProjIncomeCalculation 项目收益测算业务逻辑
type ProjIncomeCalculation struct {
	ProjIncomeCalculationModel model.IProjIncomeCalculation
}

// Query 查询数据
func (a *ProjIncomeCalculation) Query(ctx context.Context, params schema.ProjIncomeCalculationQueryParam, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculationQueryResult, error) {
	return a.ProjIncomeCalculationModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjIncomeCalculation) Get(ctx context.Context, recordID string, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculation, error) {
	item, err := a.ProjIncomeCalculationModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

// GetCurrent 查询指定数据
func (a *ProjIncomeCalculation) GetCurrent(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error) {
	//查询最终版
	item, err := a.ProjIncomeCalculationModel.GetFinish(ctx, projectID)
	if err != nil {
		return nil, err
	} else if item == nil {
		//查询当前版
		item, err = a.ProjIncomeCalculationModel.GetCurrent(ctx, projectID)
		if err != nil {
			return nil, err
		} else if item == nil {
			return nili, err
		}
	}
	return item, nil
}

func (a *ProjIncomeCalculation) getUpdate(ctx context.Context, recordID string) (*schema.ProjIncomeCalculation, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjIncomeCalculation) Create(ctx context.Context, item schema.ProjIncomeCalculation) (*schema.ProjIncomeCalculation, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjIncomeCalculationModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjIncomeCalculation) Update(ctx context.Context, recordID string, item schema.ProjIncomeCalculation) (*schema.ProjIncomeCalculation, error) {
	oldItem, err := a.ProjIncomeCalculationModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjIncomeCalculationModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjIncomeCalculation) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjIncomeCalculationModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjIncomeCalculationModel.Delete(ctx, recordID)
}
