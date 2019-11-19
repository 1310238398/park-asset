package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewProjCostBusiness 创建项目成本项业态存储实例
func NewProjCostBusiness(db *gorm.DB) *ProjCostBusiness {
	return &ProjCostBusiness{db}
}

// ProjCostBusiness 项目成本项业态存储
type ProjCostBusiness struct {
	db *gorm.DB
}

func (a *ProjCostBusiness) getQueryOption(opts ...schema.ProjCostBusinessQueryOptions) schema.ProjCostBusinessQueryOptions {
	var opt schema.ProjCostBusinessQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjCostBusiness) Query(ctx context.Context, params schema.ProjCostBusinessQueryParam, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusinessQueryResult, error) {
	db := entity.GetProjCostBusinessDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjCostBusinesses
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjCostBusinessQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjCostBusinesses(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjCostBusiness) Get(ctx context.Context, recordID string, opts ...schema.ProjCostBusinessQueryOptions) (*schema.ProjCostBusiness, error) {
	db := entity.GetProjCostBusinessDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjCostBusiness
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjCostBusiness(), nil
}

// Create 创建数据
func (a *ProjCostBusiness) Create(ctx context.Context, item schema.ProjCostBusiness) error {
	ProjCostBusiness := entity.SchemaProjCostBusiness(item).ToProjCostBusiness()
	result := entity.GetProjCostBusinessDB(ctx, a.db).Create(ProjCostBusiness)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjCostBusiness) Update(ctx context.Context, recordID string, item schema.ProjCostBusiness) error {
	ProjCostBusiness := entity.SchemaProjCostBusiness(item).ToProjCostBusiness()
	result := entity.GetProjCostBusinessDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjCostBusiness)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjCostBusiness) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjCostBusinessDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjCostBusiness{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
