package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewCostBusiness 创建成本项业态存储实例
func NewCostBusiness(db *gorm.DB) *CostBusiness {
	return &CostBusiness{db}
}

// CostBusiness 成本项业态存储
type CostBusiness struct {
	db *gorm.DB
}

func (a *CostBusiness) getQueryOption(opts ...schema.CostBusinessQueryOptions) schema.CostBusinessQueryOptions {
	var opt schema.CostBusinessQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *CostBusiness) Query(ctx context.Context, params schema.CostBusinessQueryParam, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusinessQueryResult, error) {
	db := entity.GetCostBusinessDB(ctx, a.db)

	if v := params.BusinessID; v != "" {
		db = db.Where("business_id = ?", v)
	}

	if v := params.CostID; v != "" {
		db = db.Where("cost_id = ?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.CostBusinesses
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.CostBusinessQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaCostBusinesses(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *CostBusiness) Get(ctx context.Context, recordID string, opts ...schema.CostBusinessQueryOptions) (*schema.CostBusiness, error) {
	db := entity.GetCostBusinessDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.CostBusiness
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaCostBusiness(), nil
}

// Create 创建数据
func (a *CostBusiness) Create(ctx context.Context, item schema.CostBusiness) error {
	CostBusiness := entity.SchemaCostBusiness(item).ToCostBusiness()
	result := entity.GetCostBusinessDB(ctx, a.db).Create(CostBusiness)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *CostBusiness) Update(ctx context.Context, recordID string, item schema.CostBusiness) error {
	CostBusiness := entity.SchemaCostBusiness(item).ToCostBusiness()
	result := entity.GetCostBusinessDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(CostBusiness)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *CostBusiness) Delete(ctx context.Context, recordID string) error {
	result := entity.GetCostBusinessDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.CostBusiness{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
