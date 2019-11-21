package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewProjIncomeCalculation 创建项目收益测算存储实例
func NewProjIncomeCalculation(db *gorm.DB) *ProjIncomeCalculation {
	return &ProjIncomeCalculation{db}
}

// ProjIncomeCalculation 项目收益测算存储
type ProjIncomeCalculation struct {
	db *gorm.DB
}

func (a *ProjIncomeCalculation) getQueryOption(opts ...schema.ProjIncomeCalculationQueryOptions) schema.ProjIncomeCalculationQueryOptions {
	var opt schema.ProjIncomeCalculationQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjIncomeCalculation) Query(ctx context.Context, params schema.ProjIncomeCalculationQueryParam, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculationQueryResult, error) {
	db := entity.GetProjIncomeCalculationDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjIncomeCalculations
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjIncomeCalculationQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjIncomeCalculations(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjIncomeCalculation) Get(ctx context.Context, recordID string, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculation, error) {
	db := entity.GetProjIncomeCalculationDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjIncomeCalculation
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjIncomeCalculation(), nil
}

// Create 创建数据
func (a *ProjIncomeCalculation) Create(ctx context.Context, item schema.ProjIncomeCalculation) error {
	ProjIncomeCalculation := entity.SchemaProjIncomeCalculation(item).ToProjIncomeCalculation()
	result := entity.GetProjIncomeCalculationDB(ctx, a.db).Create(ProjIncomeCalculation)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjIncomeCalculation) Update(ctx context.Context, recordID string, item schema.ProjIncomeCalculation) error {
	ProjIncomeCalculation := entity.SchemaProjIncomeCalculation(item).ToProjIncomeCalculation()
	result := entity.GetProjIncomeCalculationDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjIncomeCalculation)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjIncomeCalculation) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjIncomeCalculationDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjIncomeCalculation{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}