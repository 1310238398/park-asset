package internal

import (
	"context"
	"gxt-park-assets/internal/app/bll"
	"time"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjIncomeCalculation 创建项目收益测算
func NewProjIncomeCalculation(
	mTrans model.ITrans,
	mProjIncomeCalculation model.IProjIncomeCalculation,
	mTaxCalculation model.ITaxCalculation,
	mLandAppreciationTax model.ILandAppreciationTax,
	mProjSalesPlan model.IProjSalesPlan,
	mProjCostItem model.IProjCostItem,
) bll.IProjIncomeCalculation {
	return &ProjIncomeCalculation{
		TransModel:                 mTrans,
		ProjIncomeCalculationModel: mProjIncomeCalculation,
		TaxCalculationModel:        mTaxCalculation,
		LandAppreciationTaxModel:   mLandAppreciationTax,
		ProjSalesPlanModel:         mProjSalesPlan,
		ProjCostItemModel:          mProjCostItem,
	}
}

// ProjIncomeCalculation 项目收益测算业务逻辑
type ProjIncomeCalculation struct {
	TransModel                 model.ITrans
	ProjIncomeCalculationModel model.IProjIncomeCalculation
	TaxCalculationModel        model.ITaxCalculation
	LandAppreciationTaxModel   model.ILandAppreciationTax
	ProjSalesPlanModel         model.IProjSalesPlan
	ProjCostItemModel          model.IProjCostItem
}

// Renew 更新收益测算
func (a *ProjIncomeCalculation) Renew(ctx context.Context, projectID string) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		return a.renew(ctx, projectID)
	})
}

// renew 更新当前版本
func (a *ProjIncomeCalculation) renew(ctx context.Context, projectID string) error {

	// 查询最终版
	finish, err := a.ProjIncomeCalculationModel.GetFinish(ctx, projectID)
	if err != nil {
		return err
	}
	// 如果存在最终版则返回
	if finish != nil {
		return nil
	}

	// 获取当前数据
	current, err := a.ProjIncomeCalculationModel.GetCurrent(ctx, projectID)
	if err != nil {
		return err
	}
	// 没有数据则新建数据
	if current == nil {
		current = new(schema.ProjIncomeCalculation)
		current.RecordID = util.MustUUID()
		current.DoneTime = time.Now()
		current.ProjectID = projectID
		current.Flag = 1
		if err := a.ProjIncomeCalculationModel.Create(ctx, *current); err != nil {
			return err
		}
	}
	pspqp := schema.ProjSalesPlanQueryParam{}
	pspqp.ProjectID = projectID
	if pspqr, err := a.ProjSalesPlanModel.Query(ctx, pspqp); err != nil {
		return err
	} else if len(pspqr.Data) > 0 {
		var sale, tax float64
		for _, v := range pspqr.Data {
			sale += v.Payback
			tax += v.TaxPrice
		}
		// 销售收入
		current.TotalSale = sale
		// 销售税税额
		current.SaledTax = tax
	}

	pciqp := schema.ProjCostItemQueryParam{}
	pciqp.ProjectID = projectID
	pid := ""
	pciqp.CostParentID = &pid

	if pciqr, err := a.ProjCostItemModel.QueryShow(ctx, pciqp); err != nil {
		return err
	} else if len(pciqr) > 0 {
		var total, tax float64
		for _, v := range pciqr {
			total += v.Price
			tax += v.TaxPrice
		}
		// 开发成本
		current.TotalCost = total

		if item, err := a.ProjCostItemModel.GetByProjectIDAndCostName(ctx, projectID, "土地出让金"); err != nil {
			return err
		} else if item != nil {
			// 土地出让金
			// 【土地出让金+土地利息】
			current.LandTransferFee += item.Price
		}

		if item, err := a.ProjCostItemModel.GetByProjectIDAndCostName(ctx, projectID, "土地利息】"); err != nil {
			return err
		} else if item != nil {
			// 土地出让金
			// 【土地出让金+土地利息】
			current.LandTransferFee += item.Price
		}

		if item, err := a.ProjCostItemModel.GetByProjectIDAndCostName(ctx, projectID, "契税"); err != nil {
			return err
		} else if item != nil {
			// 契税及土地使用税
			// 【契税+土地使用税】
			current.DeedLandTax += item.Price
		}

		if item, err := a.ProjCostItemModel.GetByProjectIDAndCostName(ctx, projectID, "土地使用税"); err != nil {
			return err
		} else if item != nil {
			// 契税及土地使用税
			// 【契税+土地使用税】
			current.DeedLandTax += item.Price
		}

		if item, err := a.ProjCostItemModel.GetByProjectIDAndCostName(ctx, projectID, "资本化利息"); err != nil {
			return err
		} else if item != nil {
			// 资本化利息
			current.CapitalizedInterest = item.Price
		}

		// 进项税税额
		current.InputTax = tax

	}

	// 增值税税额
	// 【销售税税额-进项税税额】
	current.ValueAddTax = current.SaledTax - current.InputTax

	// 增值附加税
	// 【增值税税额*地方附加税税率】
	if taxRate, err := GetTaxRate(ctx, a.TaxCalculationModel, schema.TAX_ADDITIONAL, 0.125); err != nil {
		return err
	} else {
		current.ValueAddTaxSurcharge = current.ValueAddTax * taxRate
	}

	// 土地增值税
	if tax, err := a.LandAppreciationTaxModel.GetByProjectID(ctx, projectID); err != nil {
		return err
	} else if tax != nil {
		current.LandValueAddedTax = tax.Tax
	}

	// 项目税前利润
	// 【销售收入-开发成本-增值税额-增值税附加-土地增值税】
	if v := current.TotalSale - current.TotalCost -
		current.ValueAddTax - current.ValueAddTaxSurcharge -
		current.LandValueAddedTax; v > 0 {
		current.ProfitBeforeTax = v
	}

	// 税前利润率
	// 【项目税前利润/(销售收入-销售税税额)】
	if v := current.ProfitBeforeTax / (current.TotalSale - current.SaledTax); v > 0 {
		current.ProfitBeforeTaxRate = v
	}

	// 企业所得税
	// 【项目税前利润*所得税税率】
	if taxRate, err := GetTaxRate(ctx, a.TaxCalculationModel, schema.TAX_INCOME, 0.25); err != nil {
		return err
	} else {
		current.CorporateIncomeTax = current.ProfitBeforeTax * taxRate
	}

	// 项目净利润
	// 【项目税前利润-企业所得税】
	current.NetProfit = current.ProfitBeforeTax - current.CorporateIncomeTax

	// 项目净利润率
	// 【项目净利润/(销售收入-销售税税额)】
	if v := current.NetProfit / (current.TotalSale - current.SaledTax); v > 0 {
		current.NetProfitRate = v
	}

	// 总投资回报率
	// 【项目净利润/(开发成本+增值税额+增值税附加+土地增值税）】
	if v := current.NetProfit / (current.TotalCost +
		current.ValueAddTax + current.ValueAddTaxSurcharge +
		current.LandValueAddedTax); v > 0 {
		current.PaybackRate = v
	}

	return a.ProjIncomeCalculationModel.Update(ctx, current.RecordID, *current)
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
			return nil, err
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

// UpdateMemo 更新备注
func (a *ProjIncomeCalculation) UpdateMemo(ctx context.Context, recordID, index string, memo string) error {
	item, err := a.ProjIncomeCalculationModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if item == nil {
		return errors.ErrNotFound
	}

	switch index {
	case "1":
		item.TotalSaleMemo = memo
	case "1.1":
		item.SaledTaxMemo = memo
	case "2":
		item.TotalCostMemo = memo
	case "2.1":
	case "2.2":
	case "2.3":
	case "2.4":
	case "3":
	case "4":
	case "5":
	case "6":
	case "7":
	case "8":
	case "9":
	case "10":
	case "11":
	default:
		return nil
	}

	err = a.ProjIncomeCalculationModel.Update(ctx, item.RecordID, *item)
	if err != nil {
		return err
	}
	return nil
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

//TODO 创建新版本
func (a *ProjIncomeCalculation) CreateVersion(ctx context.Context, projectID string) error {
	return nil
}

//TODO 更新旧版本
func (a *ProjIncomeCalculation) UpdateVersion(ctx context.Context, projectID string) error {
	return nil
}

//TODO 获取版本比对
func (a *ProjIncomeCalculation) GetVersionComparison(ctx context.Context,
	projectID string, versions ...string) ([]*schema.ProjCompareItem, error) {
	//获取版本列表（收益测算）
	list := []*schema.ProjIncomeCalculation{}
	for _, v := range versions {

	}

	//版本排序

	//对比收益测算表

	//如果销售金额发生变化对比销售计划表

	//如果成本发生变化对比成本测算表

	//如果资本化利息发生变化，对比资本化利息表

	return nil
}
