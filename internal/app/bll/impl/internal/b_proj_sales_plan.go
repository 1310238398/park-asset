package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjSalesPlan 创建项目销售计划
func NewProjSalesPlan(mProjSalesPlan model.IProjSalesPlan, mTrans model.ITrans,
	mBusinessFormat model.IBusinessFormat, mProjBusinFormat model.IProjBusinessFormat,
	mTaxCalculation model.ITaxCalculation) *ProjSalesPlan {
	return &ProjSalesPlan{
		TransModel:              mTrans,
		BusinessFormatModel:     mBusinessFormat,
		ProjSalesPlanModel:      mProjSalesPlan,
		ProjBusinessFormatModel: mProjBusinFormat,
		TaxCalculationModel:     mTaxCalculation,
	}

}

// ProjSalesPlan 项目销售计划业务逻辑
type ProjSalesPlan struct {
	TransModel              model.ITrans
	BusinessFormatModel     model.IBusinessFormat
	ProjBusinessFormatModel model.IProjBusinessFormat
	ProjSalesPlanModel      model.IProjSalesPlan
	TaxCalculationModel     model.ITaxCalculation
}

// Query 查询数据
func (a *ProjSalesPlan) Query(ctx context.Context, params schema.ProjSalesPlanQueryParam, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlanQueryResult, error) {
	result, err := a.ProjSalesPlanModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	result.Data, err = a.fillBusinName(ctx, result.Data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Get 查询指定数据
func (a *ProjSalesPlan) Get(ctx context.Context, recordID string, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlan, error) {
	item, err := a.ProjSalesPlanModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjSalesPlan) getUpdate(ctx context.Context, recordID string) (*schema.ProjSalesPlan, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjSalesPlan) Create(ctx context.Context, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjSalesPlanModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjSalesPlan) Update(ctx context.Context, recordID string, item schema.ProjSalesPlan) (*schema.ProjSalesPlan, error) {
	oldItem, err := a.ProjSalesPlanModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	newItem := oldItem

	tax, err := a.getTax(ctx, "增值税销项税")
	if err != nil {
		return nil, err
	}
	if tax != nil {
		a.fillTax(ctx, tax, &item)
	}

	switch {
	case item.Payback > 0:
		newItem.Payback = item.Payback
		fallthrough
	case item.ContractAmount > 0:
		newItem.ContractAmount = item.Payback
		fallthrough
	case item.Principal != "":
		newItem.Principal = item.Principal
		fallthrough
	case item.SaleArea > 0:
		newItem.SaleArea = item.SaleArea
		fallthrough
	case item.AveragePrice > 0:
		newItem.AveragePrice = item.AveragePrice
	}

	err = a.ProjSalesPlanModel.Update(ctx, recordID, *newItem)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjSalesPlan) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjSalesPlanModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjSalesPlanModel.Delete(ctx, recordID)
}

// CreateList 批量创建
func (a *ProjSalesPlan) CreateList(ctx context.Context, items schema.ProjSalesPlans) error {
	if len(items) == 0 {
		return nil
	}
	tax, err := a.getTax(ctx, "增值税销项税")
	if err != nil {
		return err
	}
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		for _, item := range items {
			item.RecordID = util.MustUUID()
			a.fillTax(ctx, tax, item)
			err = a.checkExist(ctx, *item)
			if err != nil {
				return err
			}
			err = a.ProjSalesPlanModel.Create(ctx, *item)
			if err != nil {
				return err
			}
		}
		return nil
	})

}

// DeleteList 批量删除
func (a *ProjSalesPlan) DeleteList(ctx context.Context, recordIDs []string) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		for _, recordID := range recordIDs {
			oldItem, err := a.ProjSalesPlanModel.Get(ctx, recordID)
			if err != nil {
				return err
			} else if oldItem == nil {
				return errors.ErrNotFound
			}
		}
		return nil
	})

}

// 填充销售计划对应业态名称
func (a *ProjSalesPlan) fillBusinName(ctx context.Context, list schema.ProjSalesPlans) (schema.ProjSalesPlans, error) {
	if len(list) == 0 {
		return nil, nil
	}
	projBusinResult, err := a.ProjBusinessFormatModel.Query(ctx, schema.ProjBusinessFormatQueryParam{
		ProjectID: list[0].ProjectID,
		RecordIDs: list.ToProjBusinFormatIDs(),
	})
	if err != nil {
		return nil, err
	}
	list.FillData(projBusinResult.Data)

	return list, nil

}

// 填充销售税额
func (a *ProjSalesPlan) fillTax(ctx context.Context, tax *schema.TaxCalculation, item *schema.ProjSalesPlan) {
	if tax == nil {
		return
	}
	if tax.Type == 1 {
		item.TaxPrice = item.Payback / (1 + tax.TaxRate) * tax.TaxRate
	}
	if tax.Type == 2 {
		item.TaxPrice = item.Payback * tax.TaxRate

	}
}

// getTax 获取税目
func (a *ProjSalesPlan) getTax(ctx context.Context, taxName string) (*schema.TaxCalculation, error) {
	result, err := a.TaxCalculationModel.Query(ctx, schema.TaxCalculationQueryParam{
		Name: taxName,
	})
	if err != nil {
		return nil, err
	} else if len(result.Data) == 0 {
		return nil, nil
	}

	return result.Data[0], nil
}

func (a *ProjSalesPlan) checkExist(ctx context.Context, item schema.ProjSalesPlan) error {
	result, err := a.ProjSalesPlanModel.Query(ctx, schema.ProjSalesPlanQueryParam{
		ProjectID:      item.ProjectID,
		Year:           item.Year,
		Quarter:        item.Quarter,
		ProjBusinessID: item.ProjBusinessID,
	}, schema.ProjSalesPlanQueryOptions{
		PageParam: &schema.PaginationParam{PageIndex: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}

	return nil
}

// GenerateHis 生成历史版本
func (a *ProjSalesPlan) GenerateHis(ctx context.Context, incomeItem schema.ProjIncomeCalculation) error {
	// TODO
	return nil
}
