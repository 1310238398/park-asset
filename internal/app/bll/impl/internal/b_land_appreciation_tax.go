package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewLandAppreciationTax 创建土地增值税
func NewLandAppreciationTax(mLandAppreciationTax model.ILandAppreciationTax) *LandAppreciationTax {
	return &LandAppreciationTax{
		LandAppreciationTaxModel: mLandAppreciationTax,
	}
}

// LandAppreciationTax 土地增值税业务逻辑
type LandAppreciationTax struct {
	LandAppreciationTaxModel model.ILandAppreciationTax
}

// Query 查询数据
func (a *LandAppreciationTax) Query(ctx context.Context, params schema.LandAppreciationTaxQueryParam, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTaxQueryResult, error) {
	return a.LandAppreciationTaxModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *LandAppreciationTax) Get(ctx context.Context, recordID string, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTax, error) {
	item, err := a.LandAppreciationTaxModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *LandAppreciationTax) getUpdate(ctx context.Context, recordID string) (*schema.LandAppreciationTax, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *LandAppreciationTax) Create(ctx context.Context, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error) {
	item.RecordID = util.MustUUID()
	err := a.LandAppreciationTaxModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *LandAppreciationTax) Update(ctx context.Context, recordID string, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error) {
	oldItem, err := a.LandAppreciationTaxModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.LandAppreciationTaxModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *LandAppreciationTax) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.LandAppreciationTaxModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.LandAppreciationTaxModel.Delete(ctx, recordID)
}