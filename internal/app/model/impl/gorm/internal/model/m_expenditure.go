package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewExpenditure 创建支出节点存储实例
func NewExpenditure(db *gorm.DB) *Expenditure {
	return &Expenditure{db}
}

// Expenditure 支出节点存储
type Expenditure struct {
	db *gorm.DB
}

func (a *Expenditure) getQueryOption(opts ...schema.ExpenditureQueryOptions) schema.ExpenditureQueryOptions {
	var opt schema.ExpenditureQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Expenditure) Query(ctx context.Context, params schema.ExpenditureQueryParam, opts ...schema.ExpenditureQueryOptions) (*schema.ExpenditureQueryResult, error) {
	db := entity.GetExpenditureDB(ctx, a.db)

	db = db.Order("id")

	opt := a.getQueryOption(opts...)
	var list entity.Expenditures
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ExpenditureQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaExpenditures(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Expenditure) Get(ctx context.Context, recordID string, opts ...schema.ExpenditureQueryOptions) (*schema.Expenditure, error) {
	db := entity.GetExpenditureDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Expenditure
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaExpenditure(), nil
}

// Create 创建数据
func (a *Expenditure) Create(ctx context.Context, item schema.Expenditure) error {
	Expenditure := entity.SchemaExpenditure(item).ToExpenditure()
	result := entity.GetExpenditureDB(ctx, a.db).Create(Expenditure)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Expenditure) Update(ctx context.Context, recordID string, item schema.Expenditure) error {
	Expenditure := entity.SchemaExpenditure(item).ToExpenditure()
	result := entity.GetExpenditureDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Expenditure)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Expenditure) Delete(ctx context.Context, recordID string) error {
	result := entity.GetExpenditureDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Expenditure{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
