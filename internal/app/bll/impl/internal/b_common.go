package internal

import (
	"context"
	"fmt"
	"gxt-park-assets/internal/app/errors"

	"gxt-park-assets/internal/app/config"
	icontext "gxt-park-assets/internal/app/context"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/logger"
	"gxt-park-assets/pkg/util"
)

// GetRootUser 获取root用户
func GetRootUser() *schema.User {
	user := config.GetGlobalConfig().Root
	return &schema.User{
		RecordID: user.UserName,
		UserName: user.UserName,
		RealName: user.RealName,
		Password: util.MD5HashString(user.Password),
	}
}

// CheckIsRootUser 检查是否是root用户
func CheckIsRootUser(ctx context.Context, userID string) bool {
	return GetRootUser().RecordID == userID
}

// GetUserID 获取用户ID
func GetUserID(ctx context.Context) string {
	userID, _ := icontext.FromUserID(ctx)
	return userID
}

// TransFunc 定义事务执行函数
type TransFunc func(context.Context) error

// ExecTrans 执行事务
func ExecTrans(ctx context.Context, transModel model.ITrans, fn TransFunc) error {
	if _, ok := icontext.FromTrans(ctx); ok {
		return fn(ctx)
	}
	trans, err := transModel.Begin(ctx)
	if err != nil {
		return err
	}

	err = fn(icontext.NewTrans(ctx, trans))
	if err != nil {
		_ = transModel.Rollback(ctx, trans)
		return err
	}
	return transModel.Commit(ctx, trans)
}

// GetSystemParameterValue 获取系统参数值
func GetSystemParameterValue(ctx context.Context, mSystemParameter model.ISystemParameter, code string) (util.S, error) {
	result, err := mSystemParameter.Query(ctx, schema.SystemParameterQueryParam{
		Status: 1,
		Code:   code,
	})
	if err != nil {
		return "", err
	} else if len(result.Data) > 0 {
		return util.S(result.Data[0].Value), nil
	}
	return "", nil
}

// DefaultSystemParameterValue 获取系统参数值(如果出现错误或值为空，则使用默认值)
func DefaultSystemParameterValue(ctx context.Context, mSystemParameter model.ISystemParameter, code, defValue string) util.S {
	val, err := GetSystemParameterValue(ctx, mSystemParameter, code)
	if err != nil || val == "" {
		if err != nil {
			logger.StartSpan(ctx, logger.SetSpanTitle("查询系统参数")).WithField("code", code).Errorf(err.Error())
		}
		return util.S(defValue)
	}
	return val
}

// GetCostTemplate 获取成本模板
func GetCostTemplate(ctx context.Context, mCostItem model.ICostItem) (schema.CostItems, error) {
	ps := schema.CostItemQueryParam{}
	cir, err := mCostItem.Query(ctx, ps)
	if err != nil {
		return nil, err
	}

	result := schema.CostItems{}
	for _, v := range cir.Data {
		if v.ParentID == "" {
			result = append(result, v)
		} else {
			for _, k := range cir.Data {
				if k.RecordID == v.ParentID {
					k.Children = append(k.Children, v)
					break
				}
			}
		}
	}
	return result, nil
}

// GetTaxPrice 计算税金
func GetTaxPrice(ctx context.Context, mTaxCalculation model.ITaxCalculation, price float64, taxID string, taxRate float64) (float64, float64, error) {
	/*
		本方法限于成本测算中各成本项的计税
		土地增值税，地方附加税等通过按名称查询指定税率的方式查询
	*/
	var taxPrice float64

	//取税
	tax, err := mTaxCalculation.Get(ctx, taxID)
	if err != nil {
		return 0, 0, err
	}
	if tax == nil {
		if taxRate == 0 {
			return 0, 0, nil
		}
		// 默认计税
		taxPrice = price * taxRate / (1 + taxRate)
		return taxPrice, taxRate, nil
	}

	if taxRate == 0 {
		taxRate = tax.TaxRate
	}

	//计税
	if tax.Type == 1 {
		taxPrice = price * taxRate / (1 + taxRate)
	} else if tax.Type == 2 {
		taxPrice = price * taxRate
	}
	return taxPrice, taxRate, nil
}

// GetTaxRate 获取税率（根据税名）
func GetTaxRate(ctx context.Context, mTaxCalculation model.ITaxCalculation, name string, defRate ...float64) (float64, error) {

	if name == "" {
		return 0, nil
	}
	tax, err := mTaxCalculation.GetByName(ctx, name)
	if err != nil {
		return 0, err
	}
	if tax == nil {
		if len(defRate) > 0 {
			return defRate[0], nil
		}
		switch name {
		case schema.TAX_ADDITIONAL:
			return 0, errors.ErrNoTaxAdditional
		case schema.TAX_CONTRACT:
			return 0, errors.ErrNoTaxContract
		case schema.TAX_INCOME:
			return 0, errors.ErrNoTaxIncome
		case schema.TAX_OUTPUT:
			return 0, errors.ErrNoTaxOutput
		case schema.TAX_STAMP:
			return 0, errors.ErrNoTaxStamp
		case schema.TAX_USE:
			return 0, errors.ErrNoTaxUse
		}
		return 0, errors.New(fmt.Sprintf("未设置[%s]", name))
	}
	return tax.TaxRate, nil
}
