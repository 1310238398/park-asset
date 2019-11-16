package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewTaxCalculation 创建税目计算表存储实例
func NewTaxCalculation(db *gorm.DB) *TaxCalculation {
	return &TaxCalculation{db}
}

// TaxCalculation 税目计算表存储
type TaxCalculation struct {
	db *gorm.DB
}

func (a *TaxCalculation) getQueryOption(opts ...schema.TaxCalculationQueryOptions) schema.TaxCalculationQueryOptions {
	var opt schema.TaxCalculationQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *TaxCalculation) Query(ctx context.Context, params schema.TaxCalculationQueryParam, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculationQueryResult, error) {
	db := entity.GetTaxCalculationDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.TaxCalculations
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.TaxCalculationQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaTaxCalculations(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *TaxCalculation) Get(ctx context.Context, recordID string, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculation, error) {
	db := entity.GetTaxCalculationDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.TaxCalculation
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaTaxCalculation(), nil
}

// Create 创建数据
func (a *TaxCalculation) Create(ctx context.Context, item schema.TaxCalculation) error {
	TaxCalculation := entity.SchemaTaxCalculation(item).ToTaxCalculation()
	result := entity.GetTaxCalculationDB(ctx, a.db).Create(TaxCalculation)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *TaxCalculation) Update(ctx context.Context, recordID string, item schema.TaxCalculation) error {
	TaxCalculation := entity.SchemaTaxCalculation(item).ToTaxCalculation()
	result := entity.GetTaxCalculationDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(TaxCalculation)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *TaxCalculation) Delete(ctx context.Context, recordID string) error {
	result := entity.GetTaxCalculationDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.TaxCalculation{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
