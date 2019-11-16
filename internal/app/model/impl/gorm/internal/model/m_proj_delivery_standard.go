package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewProjDeliveryStandard 创建成本项目交付标准存储实例
func NewProjDeliveryStandard(db *gorm.DB) *ProjDeliveryStandard {
	return &ProjDeliveryStandard{db}
}

// ProjDeliveryStandard 成本项目交付标准存储
type ProjDeliveryStandard struct {
	db *gorm.DB
}

func (a *ProjDeliveryStandard) getQueryOption(opts ...schema.ProjDeliveryStandardQueryOptions) schema.ProjDeliveryStandardQueryOptions {
	var opt schema.ProjDeliveryStandardQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjDeliveryStandard) Query(ctx context.Context, params schema.ProjDeliveryStandardQueryParam, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandardQueryResult, error) {
	db := entity.GetProjDeliveryStandardDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjDeliveryStandards
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjDeliveryStandardQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjDeliveryStandards(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjDeliveryStandard) Get(ctx context.Context, recordID string, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandard, error) {
	db := entity.GetProjDeliveryStandardDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjDeliveryStandard
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjDeliveryStandard(), nil
}

// Create 创建数据
func (a *ProjDeliveryStandard) Create(ctx context.Context, item schema.ProjDeliveryStandard) error {
	ProjDeliveryStandard := entity.SchemaProjDeliveryStandard(item).ToProjDeliveryStandard()
	result := entity.GetProjDeliveryStandardDB(ctx, a.db).Create(ProjDeliveryStandard)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjDeliveryStandard) Update(ctx context.Context, recordID string, item schema.ProjDeliveryStandard) error {
	ProjDeliveryStandard := entity.SchemaProjDeliveryStandard(item).ToProjDeliveryStandard()
	result := entity.GetProjDeliveryStandardDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjDeliveryStandard)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjDeliveryStandard) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjDeliveryStandardDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjDeliveryStandard{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
