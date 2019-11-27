package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjSalesPlan 创建项目销售计划存储实例
func NewProjSalesPlan(db *gorm.DB) *ProjSalesPlan {
	return &ProjSalesPlan{db}
}

// ProjSalesPlan 项目销售计划存储
type ProjSalesPlan struct {
	db *gorm.DB
}

func (a *ProjSalesPlan) getQueryOption(opts ...schema.ProjSalesPlanQueryOptions) schema.ProjSalesPlanQueryOptions {
	var opt schema.ProjSalesPlanQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjSalesPlan) Query(ctx context.Context, params schema.ProjSalesPlanQueryParam, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlanQueryResult, error) {
	db := entity.GetProjSalesPlanDB(ctx, a.db)

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
	var list entity.ProjSalesPlans
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjSalesPlanQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjSalesPlans(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjSalesPlan) Get(ctx context.Context, recordID string, opts ...schema.ProjSalesPlanQueryOptions) (*schema.ProjSalesPlan, error) {
	db := entity.GetProjSalesPlanDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjSalesPlan
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjSalesPlan(), nil
}

// Create 创建数据
func (a *ProjSalesPlan) Create(ctx context.Context, item schema.ProjSalesPlan) error {
	ProjSalesPlan := entity.SchemaProjSalesPlan(item).ToProjSalesPlan()
	result := entity.GetProjSalesPlanDB(ctx, a.db).Create(ProjSalesPlan)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjSalesPlan) Update(ctx context.Context, recordID string, item schema.ProjSalesPlan) error {
	ProjSalesPlan := entity.SchemaProjSalesPlan(item).ToProjSalesPlan()
	result := entity.GetProjSalesPlanDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjSalesPlan)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjSalesPlan) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjSalesPlanDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjSalesPlan{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// GenerateHis 生成历史版本
func (a *ProjSalesPlan) GenerateHis(ctx context.Context, item schema.ProjSalesPlan) error {
	db := entity.GetProjSalesPlanDB(ctx, a.db)
	hisDB := entity.GetProjSalesHisDB(ctx, a.db)

	subQuery := db.Select("*").Where("project_id = ?", item.ProjectID)

	result := hisDB.Create(subQuery)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
