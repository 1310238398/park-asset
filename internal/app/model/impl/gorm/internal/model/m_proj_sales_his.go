package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjSalesHis 创建项目销售计划历史存储实例
func NewProjSalesHis(db *gorm.DB) *ProjSalesHis {
	return &ProjSalesHis{db}
}

// ProjSalesHis 项目销售计划历史存储
type ProjSalesHis struct {
	db *gorm.DB
}

func (a *ProjSalesHis) getQueryOption(opts ...schema.ProjSalesHisQueryOptions) schema.ProjSalesHisQueryOptions {
	var opt schema.ProjSalesHisQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjSalesHis) Query(ctx context.Context, params schema.ProjSalesHisQueryParam, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHisQueryResult, error) {
	db := entity.GetProjSalesHisDB(ctx, a.db)

	if v := params.ProjectID; v != "" {
		db = db.Where("project_id = ?", v)
	}
	if v := params.Year; v != 0 {
		db = db.Where("year = ?", v)
	}

	if v := params.ProjBusinessID; v != "" {
		db = db.Where("proj_business_id = ?", v)
	}

	if v := params.ProjIncomeID; v != "" {
		db = db.Where("proj_income_id = ?", v)
	}

	if v := params.Quarter; v != 0 {
		db = db.Where("quarter = ? ", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjSalesHises
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjSalesHisQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjSalesHises(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjSalesHis) Get(ctx context.Context, recordID string, opts ...schema.ProjSalesHisQueryOptions) (*schema.ProjSalesHis, error) {
	db := entity.GetProjSalesHisDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjSalesHis
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjSalesHis(), nil
}

// Create 创建数据
func (a *ProjSalesHis) Create(ctx context.Context, item schema.ProjSalesHis) error {
	ProjSalesHis := entity.SchemaProjSalesHis(item).ToProjSalesHis()
	result := entity.GetProjSalesHisDB(ctx, a.db).Create(ProjSalesHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjSalesHis) Update(ctx context.Context, recordID string, item schema.ProjSalesHis) error {
	ProjSalesHis := entity.SchemaProjSalesHis(item).ToProjSalesHis()
	result := entity.GetProjSalesHisDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjSalesHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjSalesHis) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjSalesHisDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjSalesHis{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
