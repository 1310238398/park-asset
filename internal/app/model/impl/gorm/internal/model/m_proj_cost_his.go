package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjCostHis 创建项目成本项历史存储实例
func NewProjCostHis(db *gorm.DB) *ProjCostHis {
	return &ProjCostHis{db}
}

// ProjCostHis 项目成本项历史存储
type ProjCostHis struct {
	db *gorm.DB
}

func (a *ProjCostHis) getQueryOption(opts ...schema.ProjCostHisQueryOptions) schema.ProjCostHisQueryOptions {
	var opt schema.ProjCostHisQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjCostHis) Query(ctx context.Context, params schema.ProjCostHisQueryParam, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHisQueryResult, error) {
	db := entity.GetProjCostHisDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjCostHises
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjCostHisQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjCostHises(),
	}

	return qr, nil
}

// QueryShow  查询展示数据
func (a *ProjCostHis) QueryShow(ctx context.Context, params schema.ProjCostHisQueryParam, opts ...schema.ProjCostItemQueryOptions) (schema.ProjCostItemShows, error) {
	db := entity.GetProjCostHisDB(ctx, a.db)

	db = db.Order("id DESC")

	db.Where("proj_income_id=?", params.ProjIncomeID)

	var list entity.ProjCostHises

	if re := db.Find(&list); re.Error != nil {
		return nil, re.Error
	}

	return list.ToSchemaProjCostItemShows(), nil
}

// Get 查询指定数据
func (a *ProjCostHis) Get(ctx context.Context, recordID string, opts ...schema.ProjCostHisQueryOptions) (*schema.ProjCostHis, error) {
	db := entity.GetProjCostHisDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjCostHis
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjCostHis(), nil
}

// Create 创建数据
func (a *ProjCostHis) Create(ctx context.Context, item schema.ProjCostHis) error {
	ProjCostHis := entity.SchemaProjCostHis(item).ToProjCostHis()
	result := entity.GetProjCostHisDB(ctx, a.db).Create(ProjCostHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjCostHis) Update(ctx context.Context, recordID string, item schema.ProjCostHis) error {
	ProjCostHis := entity.SchemaProjCostHis(item).ToProjCostHis()
	result := entity.GetProjCostHisDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjCostHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjCostHis) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjCostHisDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjCostHis{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateList 批量添加
func (a *ProjCostHis) CreateList(ctx context.Context, list []*schema.ProjCostHis) error {
	for _, v := range list {
		ProjCostHis := entity.SchemaProjCostHis(*v).ToProjCostHis()
		result := entity.GetProjCostHisDB(ctx, a.db).Create(ProjCostHis)
		if err := result.Error; err != nil {
			return errors.WithStack(err)
		}
	}
	return nil
}
