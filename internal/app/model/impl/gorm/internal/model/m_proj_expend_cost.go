package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjExpendCost 创建项目支出节点成本项存储实例
func NewProjExpendCost(db *gorm.DB) *ProjExpendCost {
	return &ProjExpendCost{db}
}

// ProjExpendCost 项目支出节点成本项存储
type ProjExpendCost struct {
	db *gorm.DB
}

func (a *ProjExpendCost) getQueryOption(opts ...schema.ProjExpendCostQueryOptions) schema.ProjExpendCostQueryOptions {
	var opt schema.ProjExpendCostQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjExpendCost) Query(ctx context.Context, params schema.ProjExpendCostQueryParam, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCostQueryResult, error) {
	db := entity.GetProjExpendCostDB(ctx, a.db)

	if v := params.ProjCostID; v != "" {
		db = db.Where("proj_cost_id = ?", v)
	}

	if v := params.ProjCostIDs; len(v) > 0 {
		db = db.Where("proj_cost_id IN (?)", v)
	}

	if v := params.ProjExpenditureID; v != "" {
		db = db.Where("proj_expenditure_id = ?", v)
	}

	if v := params.ProjExpenditureIDs; len(v) > 0 {
		db = db.Where("proj_expenditure_id IN (?)", v)
	}

	if v := params.NotProjCostIDs; len(v) > 0 {
		db = db.Where("proj_cost_id NOT IN (?)", v)
	}

	if v := params.NotProjExpenditureIDs; len(v) > 0 {
		db = db.Where("proj_expenditure_id NOT IN (?)", v)
	}
	if v := params.ProjectID; v != "" {
		sub := entity.GetProjExpenditureDB(ctx, a.db).Select("record_id").Where("project_id = ?", v).SubQuery()
		db = db.Where("proj_expenditure_id IN (?)", sub)

	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjExpendCosts
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjExpendCostQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjExpendCosts(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjExpendCost) Get(ctx context.Context, recordID string, opts ...schema.ProjExpendCostQueryOptions) (*schema.ProjExpendCost, error) {
	db := entity.GetProjExpendCostDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjExpendCost
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjExpendCost(), nil
}

// Create 创建数据
func (a *ProjExpendCost) Create(ctx context.Context, item schema.ProjExpendCost) error {
	ProjExpendCost := entity.SchemaProjExpendCost(item).ToProjExpendCost()
	result := entity.GetProjExpendCostDB(ctx, a.db).Create(ProjExpendCost)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjExpendCost) Update(ctx context.Context, recordID string, item schema.ProjExpendCost) error {
	ProjExpendCost := entity.SchemaProjExpendCost(item).ToProjExpendCost()
	result := entity.GetProjExpendCostDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjExpendCost)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjExpendCost) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjExpendCostDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjExpendCost{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteByProjExpendID 通过项目支出节点ID删除
func (a *ProjExpendCost) DeleteByProjExpendID(ctx context.Context, projExpenditureID string) error {
	result := entity.GetProjExpendCostDB(ctx, a.db).Where("proj_expenditure_id=?", projExpenditureID).Delete(entity.ProjExpendCost{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdatePrice 更新价格数据
func (a *ProjExpendCost) UpdatePrice(ctx context.Context, recordID string, costPrice, amount float64) error {
	result := entity.GetProjExpendCostDB(ctx, a.db).Where("record_id=?", recordID).Updates(map[string]interface{}{"cost_price": costPrice, "amount": amount})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
