package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewLandAppreciationTax 创建土地增值税
func NewLandAppreciationTax(mTrans model.ITrans,
	mLandAppreciationTax model.ILandAppreciationTax,
	mProjSalesPlan model.IProjSalesPlan,
	mProjCostItem model.IProjCostItem,
	mTaxCalculation model.ITaxCalculation) *LandAppreciationTax {
	return &LandAppreciationTax{
		TransModel:               mTrans,
		LandAppreciationTaxModel: mLandAppreciationTax,
		ProjSalesPlanModel:       mProjSalesPlan,
		ProjCostItemModel:        mProjCostItem,
		TaxCalculationModel:      mTaxCalculation,
	}
}

// LandAppreciationTax 土地增值税业务逻辑
type LandAppreciationTax struct {
	TransModel               model.ITrans
	LandAppreciationTaxModel model.ILandAppreciationTax
	ProjSalesPlanModel       model.IProjSalesPlan
	ProjCostItemModel        model.IProjCostItem
	TaxCalculationModel      model.ITaxCalculation
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
		item = new(schema.LandAppreciationTax)
		item.RecordID = util.MustUUID()
		item.ProjectID = projectID
		item.FinanceAddRate = 0.05
		item.ManageAddRate = 0.05
		item.CostAddRate = 0.2
		if err := a.LandAppreciationTaxModel.Create(ctx, *item); err != nil {
			return nil
		}
	}

	// 获取相关税率
	incomeTaxRate, err := GetTaxRate(ctx, a.TaxCalculationModel, schema.TAX_INCOME)
	if err != nil {
		return err
	}

	localTaxRate, err := GetTaxRate(ctx, a.TaxCalculationModel, schema.TAX_ADDITIONAL)
	if err != nil {
		return err
	}

	//获取销售收入
	var income float64
	pspqp := schema.ProjSalesPlanQueryParam{}
	pspqp.ProjectID = projectID
	pspqr, err := a.ProjSalesPlanModel.Query(ctx, pspqp)
	if err != nil {
		return err
	}
	if pspqr.Data == nil || len(pspqr.Data) == 0 {
		return errors.ErrNoProjSalesPlan
	}
	for _, v := range pspqr.Data {
		income += v.Payback
	}

	item.Income = util.DecimalFloat64(income / (incomeTaxRate + 1))
	//获取扣除项金额
	var cost float64
	var tax float64
	pciqp := schema.ProjCostItemQueryParam{}
	pciqp.ProjectID = projectID
	pciqp.InLandTax = 1
	shows, err := a.ProjCostItemModel.QueryShow(ctx, pciqp)
	if err != nil {
		return err
	}
	if len(shows) == 0 {
		return errors.ErrNoProjCostItem
	}
	result := schema.ProjCostItemShows{}
	for _, v := range shows {
		if v.CostParentID == "" {
			result = append(result, v)
		} else {
			for _, k := range shows {
				if k.CostID == v.CostParentID {
					k.Children = append(k.Children, v)
				}
			}
		}
	}

	var getCost func(t *schema.ProjCostItemShow) (bool, float64, float64, error)
	getCost = func(t *schema.ProjCostItemShow) (bool, float64, float64, error) {
		var price float64
		var tax float64
		var hasc = false
		if t.RecordID == "" {
			return false, 0, 0, nil
		}
		for _, v := range t.Children {
			i, pr, ta, err := getCost(v)
			if err != nil {
				return i, pr, ta, err
			}
			if i {
				price += pr
				tax += ta
				hasc = true
			}
		}

		if !hasc {
			price = t.Price
			tax = t.TaxPrice
		}
		return true, price, tax, nil
	}
	for _, v := range result {
		i, pr, ta, err := getCost(v)
		if err != nil {
			return err
		}
		if i {
			cost += pr
			tax += ta
		}
	}
	item.Cost = cost - tax
	//计算附加税

	//附加税=（销项税-进项税）*地方税率
	if t := item.Income*incomeTaxRate - tax; t > 0 {
		item.AdditionalTax = t * localTaxRate
	}

	//计算增值额及增值率
	increase := item.Income -
		item.Cost*(1+item.FinanceAddRate+item.ManageAddRate+item.CostAddRate) -
		item.AdditionalTax
	if increase < 0 { //增值额去负数
		increase = 0
	}
	increaseRate := increase / item.Cost

	//计算土地增值税
	item.Tax = 0
	var done float64  //已计税额
	var doing float64 //当前计税额
	//增值额未超过扣除项目金额50%的部分，税率为30%
	if increaseRate <= 0.5 {
		doing = increase
	} else {
		doing = item.Cost * 0.5
	}
	item.Tax += doing * 0.3
	done += doing
	//增值额超过扣除项目金额50%、未超过扣除项目金额100%的部分，税率为40%
	if increaseRate > 0.5 {
		if increaseRate <= 1.0 {
			doing = increase - done
		} else {
			doing = item.Cost*1.0 - done
		}
		item.Tax += doing * 0.4
		done += doing
	}
	//增值额超过扣除项目金额100%、未超过扣除项目金额200%的部分，税率为50%
	if increaseRate > 1.0 {
		if increaseRate <= 2.0 {
			doing = increase - done
		} else {
			doing = item.Cost*2.0 - done
		}
		item.Tax += doing * 0.5
		done += doing
	}
	//增值额超过扣除项目金额200%的部分，税率为60%
	if increaseRate > 2.0 {
		doing = increase - done
		item.Tax += doing * 0.6
		done += doing
	}

	//更新土地增值税
	if err := a.LandAppreciationTaxModel.Update(ctx, item.RecordID, *item); err != nil {
		return err
	}
	return nil
}

// Renew 更新土地增值税
func (a *LandAppreciationTax) Renew(ctx context.Context, projectID string) error {
	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		return a.renew(ctx, projectID)
	})
	return err
}

// Query 查询数据
func (a *LandAppreciationTax) Query(ctx context.Context, params schema.LandAppreciationTaxQueryParam, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTaxQueryResult, error) {
	//更新数据
	a.renew(ctx, params.ProjectID)

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

// GetByProjectID 按项目ID获取土增
func (a *LandAppreciationTax) GetByProjectID(ctx context.Context, projectID string) (*schema.LandAppreciationTax, error) {
	err := a.Renew(ctx, projectID)
	if err != nil {
		return nil, err
	}

	item, err := a.LandAppreciationTaxModel.GetByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	} else if item == nil {

		item, err = a.LandAppreciationTaxModel.GetByProjectID(ctx, projectID)
		if err != nil {
			return nil, err
		}
	}
	return item, nil
}

func (a *LandAppreciationTax) getUpdate(ctx context.Context, recordID string) (*schema.LandAppreciationTax, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *LandAppreciationTax) Create(ctx context.Context, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error) {
	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.LandAppreciationTaxModel.Create(ctx, item)
		if err != nil {
			return err
		}
		if err := a.renew(ctx, item.ProjectID); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *LandAppreciationTax) Update(ctx context.Context, recordID string, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error) {

	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		oldItem, err := a.LandAppreciationTaxModel.Get(ctx, recordID)
		if err != nil {
			return err
		} else if oldItem == nil {
			return errors.ErrNotFound
		}

		err = a.LandAppreciationTaxModel.Update(ctx, recordID, item)
		if err != nil {
			return err
		}
		if err := a.renew(ctx, oldItem.ProjectID); err != nil {
			return err
		}
		return nil
	})
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
