package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewProjBusinessFormat 创建项目业态存储实例
func NewProjBusinessFormat(db *gorm.DB) *ProjBusinessFormat {
	return &ProjBusinessFormat{db}
}

// ProjBusinessFormat 项目业态存储
type ProjBusinessFormat struct {
	db *gorm.DB
}

func (a *ProjBusinessFormat) getQueryOption(opts ...schema.ProjBusinessFormatQueryOptions) schema.ProjBusinessFormatQueryOptions {
	var opt schema.ProjBusinessFormatQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjBusinessFormat) Query(ctx context.Context, params schema.ProjBusinessFormatQueryParam, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormatQueryResult, error) {
	db := entity.GetProjBusinessFormatDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjBusinessFormats
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjBusinessFormatQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjBusinessFormats(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjBusinessFormat) Get(ctx context.Context, recordID string, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormat, error) {
	db := entity.GetProjBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjBusinessFormat
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjBusinessFormat(), nil
}

// Create 创建数据
func (a *ProjBusinessFormat) Create(ctx context.Context, item schema.ProjBusinessFormat) error {
	ProjBusinessFormat := entity.SchemaProjBusinessFormat(item).ToProjBusinessFormat()
	result := entity.GetProjBusinessFormatDB(ctx, a.db).Create(ProjBusinessFormat)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjBusinessFormat) Update(ctx context.Context, recordID string, item schema.ProjBusinessFormat) error {
	ProjBusinessFormat := entity.SchemaProjBusinessFormat(item).ToProjBusinessFormat()
	result := entity.GetProjBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjBusinessFormat)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjBusinessFormat) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjBusinessFormat{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
