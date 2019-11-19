package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjCapitalizedHis 创建项目资本化利息测算历史存储实例
func NewProjCapitalizedHis(db *gorm.DB) *ProjCapitalizedHis {
	return &ProjCapitalizedHis{db}
}

// ProjCapitalizedHis 项目资本化利息测算历史存储
type ProjCapitalizedHis struct {
	db *gorm.DB
}

func (a *ProjCapitalizedHis) getQueryOption(opts ...schema.ProjCapitalizedHisQueryOptions) schema.ProjCapitalizedHisQueryOptions {
	var opt schema.ProjCapitalizedHisQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjCapitalizedHis) Query(ctx context.Context, params schema.ProjCapitalizedHisQueryParam, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHisQueryResult, error) {
	db := entity.GetProjCapitalizedHisDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjCapitalizedHises
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjCapitalizedHisQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjCapitalizedHises(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjCapitalizedHis) Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHis, error) {
	db := entity.GetProjCapitalizedHisDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjCapitalizedHis
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjCapitalizedHis(), nil
}

// Create 创建数据
func (a *ProjCapitalizedHis) Create(ctx context.Context, item schema.ProjCapitalizedHis) error {
	ProjCapitalizedHis := entity.SchemaProjCapitalizedHis(item).ToProjCapitalizedHis()
	result := entity.GetProjCapitalizedHisDB(ctx, a.db).Create(ProjCapitalizedHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjCapitalizedHis) Update(ctx context.Context, recordID string, item schema.ProjCapitalizedHis) error {
	ProjCapitalizedHis := entity.SchemaProjCapitalizedHis(item).ToProjCapitalizedHis()
	result := entity.GetProjCapitalizedHisDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjCapitalizedHis)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjCapitalizedHis) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjCapitalizedHisDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjCapitalizedHis{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
