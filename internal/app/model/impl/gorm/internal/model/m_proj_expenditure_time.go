package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjExpenditureTime 创建项目支出节点时间表存储实例
func NewProjExpenditureTime(db *gorm.DB) *ProjExpenditureTime {
	return &ProjExpenditureTime{db}
}

// ProjExpenditureTime 项目支出节点时间表存储
type ProjExpenditureTime struct {
	db *gorm.DB
}

func (a *ProjExpenditureTime) getQueryOption(opts ...schema.ProjExpenditureTimeQueryOptions) schema.ProjExpenditureTimeQueryOptions {
	var opt schema.ProjExpenditureTimeQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjExpenditureTime) Query(ctx context.Context, params schema.ProjExpenditureTimeQueryParam, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTimeQueryResult, error) {
	db := entity.GetProjExpenditureTimeDB(ctx, a.db)

	if v := params.ProjExpenditureID; v != "" {
		db = db.Where("proj_expenditure_id = ?", v)
	}

	if v := params.Year; v != 0 {
		db = db.Where("year = ?", v)
	}

	if v := params.Quarter; v != 0 {
		db = db.Where("quarter = ?", v)
	}

	if v := params.Month; v != 0 {
		db = db.Where("month = ?", v)
	}

	if v := params.Day; v != 0 {
		db = db.Where("day = ?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjExpenditureTimes
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjExpenditureTimeQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjExpenditureTimes(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjExpenditureTime) Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTime, error) {
	db := entity.GetProjExpenditureTimeDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjExpenditureTime
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjExpenditureTime(), nil
}

// Create 创建数据
func (a *ProjExpenditureTime) Create(ctx context.Context, item schema.ProjExpenditureTime) error {
	ProjExpenditureTime := entity.SchemaProjExpenditureTime(item).ToProjExpenditureTime()
	result := entity.GetProjExpenditureTimeDB(ctx, a.db).Create(ProjExpenditureTime)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjExpenditureTime) Update(ctx context.Context, recordID string, item schema.ProjExpenditureTime) error {
	ProjExpenditureTime := entity.SchemaProjExpenditureTime(item).ToProjExpenditureTime()
	result := entity.GetProjExpenditureTimeDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjExpenditureTime)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjExpenditureTime) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjExpenditureTimeDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjExpenditureTime{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
