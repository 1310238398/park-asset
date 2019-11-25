package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewBusinessFormat 创建业态存储实例
func NewBusinessFormat(db *gorm.DB) *BusinessFormat {
	return &BusinessFormat{db}
}

// BusinessFormat 业态存储
type BusinessFormat struct {
	db *gorm.DB
}

func (a *BusinessFormat) getQueryOption(opts ...schema.BusinessFormatQueryOptions) schema.BusinessFormatQueryOptions {
	var opt schema.BusinessFormatQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *BusinessFormat) Query(ctx context.Context, params schema.BusinessFormatQueryParam, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormatQueryResult, error) {
	db := entity.GetBusinessFormatDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name like ?", "%"+v+"%")
	}

	if v := params.ISCivilDefense; v != 0 {
		db = db.Where("is_civil_defense = ?", v)
	}

	if v := params.ISUnderground; v != 0 {
		db = db.Where("is_underground = ?", v)

	}

	if v := params.RecordID; v != "" {
		db = db.Where("record_id = ?", v)
	}

	if v := params.RecordIDs; len(v) > 0 {
		db = db.Where("record_id IN (?)", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.BusinessFormats
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.BusinessFormatQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaBusinessFormats(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *BusinessFormat) Get(ctx context.Context, recordID string, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormat, error) {
	db := entity.GetBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.BusinessFormat
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaBusinessFormat(), nil
}

// Create 创建数据
func (a *BusinessFormat) Create(ctx context.Context, item schema.BusinessFormat) error {
	BusinessFormat := entity.SchemaBusinessFormat(item).ToBusinessFormat()
	result := entity.GetBusinessFormatDB(ctx, a.db).Create(BusinessFormat)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *BusinessFormat) Update(ctx context.Context, recordID string, item schema.BusinessFormat) error {
	BusinessFormat := entity.SchemaBusinessFormat(item).ToBusinessFormat()
	result := entity.GetBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(BusinessFormat)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *BusinessFormat) Delete(ctx context.Context, recordID string) error {
	result := entity.GetBusinessFormatDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.BusinessFormat{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
