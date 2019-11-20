package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewTaxCalculation 创建税目计算表
func NewTaxCalculation(mTaxCalculation model.ITaxCalculation) *TaxCalculation {
	return &TaxCalculation{
		TaxCalculationModel: mTaxCalculation,
	}
}

// TaxCalculation 税目计算表业务逻辑
type TaxCalculation struct {
	TaxCalculationModel model.ITaxCalculation
}

// Query 查询数据
func (a *TaxCalculation) Query(ctx context.Context, params schema.TaxCalculationQueryParam, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculationQueryResult, error) {
	return a.TaxCalculationModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *TaxCalculation) Get(ctx context.Context, recordID string, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculation, error) {
	item, err := a.TaxCalculationModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *TaxCalculation) getUpdate(ctx context.Context, recordID string) (*schema.TaxCalculation, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *TaxCalculation) Create(ctx context.Context, item schema.TaxCalculation) (*schema.TaxCalculation, error) {
	item.RecordID = util.MustUUID()
	err := a.TaxCalculationModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *TaxCalculation) Update(ctx context.Context, recordID string, item schema.TaxCalculation) (*schema.TaxCalculation, error) {
	oldItem, err := a.TaxCalculationModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.TaxCalculationModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *TaxCalculation) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.TaxCalculationModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.TaxCalculationModel.Delete(ctx, recordID)
}
