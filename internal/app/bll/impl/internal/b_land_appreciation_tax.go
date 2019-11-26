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
	Trans                    model.ITrans
	LandAppreciationTaxModel model.ILandAppreciationTax
	ProjSalesPlanModel       model.IProjSalesPlan
	ProjCostItemModel        model.IProjCostItem
}

// 更新项目的土地增值税
func (a *LandAppreciationTax) renew(ctx context.Context, projectID string) error {
	//获取土地增值税
	item, err := a.LandAppreciationTaxModel.GetByProjectID(ctx, projectID)
	if err != nil {
		return err
	}
	//创建新土地增值税
	if item == nil {

		return nil
	}
	//获取销售收入
	//获取扣除项金额
	//获取附加税
	//计算增值额及增值率
	//确认适用税率
	//计算土地增值税

	return nil
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
