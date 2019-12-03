package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjCapitalizedInterest 创建项目资本化利息测算存储实例
func NewProjCapitalizedInterest(db *gorm.DB) *ProjCapitalizedInterest {
	return &ProjCapitalizedInterest{db}
}

// ProjCapitalizedInterest 项目资本化利息测算存储
type ProjCapitalizedInterest struct {
	db *gorm.DB
}

func (a *ProjCapitalizedInterest) getQueryOption(opts ...schema.ProjCapitalizedInterestQueryOptions) schema.ProjCapitalizedInterestQueryOptions {
	var opt schema.ProjCapitalizedInterestQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjCapitalizedInterest) Query(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterestQueryResult, error) {
	db := entity.GetProjCapitalizedInterestDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjCapitalizedInterests
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjCapitalizedInterestQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjCapitalizedInterests(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjCapitalizedInterest) Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterest, error) {
	db := entity.GetProjCapitalizedInterestDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjCapitalizedInterest
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjCapitalizedInterest(), nil
}

// GetByQueryIndex 按季度查询数据
func (a *ProjCapitalizedInterest) GetByQuarterIndex(ctx context.Context, projectID string, year int, quarter int) (*schema.ProjCapitalizedInterest, error) {
	db := entity.GetProjCapitalizedInterestDB(ctx, a.db).Where("project_id=? AND year=? AND quarter=?", projectID, year, quarter)
	var item entity.ProjCapitalizedInterest
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}
	return item.ToSchemaProjCapitalizedInterest(), nil
}

// Create 创建数据
func (a *ProjCapitalizedInterest) Create(ctx context.Context, item schema.ProjCapitalizedInterest) error {
	ProjCapitalizedInterest := entity.SchemaProjCapitalizedInterest(item).ToProjCapitalizedInterest()
	result := entity.GetProjCapitalizedInterestDB(ctx, a.db).Create(ProjCapitalizedInterest)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjCapitalizedInterest) Update(ctx context.Context, recordID string, item schema.ProjCapitalizedInterest) error {
	ProjCapitalizedInterest := entity.SchemaProjCapitalizedInterest(item).ToProjCapitalizedInterest()
	result := entity.GetProjCapitalizedInterestDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjCapitalizedInterest)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjCapitalizedInterest) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjCapitalizedInterestDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjCapitalizedInterest{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
