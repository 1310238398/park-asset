package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewLandAppreciationTax 创建土地增值税存储实例
func NewLandAppreciationTax(db *gorm.DB) *LandAppreciationTax {
	return &LandAppreciationTax{db}
}

// LandAppreciationTax 土地增值税存储
type LandAppreciationTax struct {
	db *gorm.DB
}

func (a *LandAppreciationTax) getQueryOption(opts ...schema.LandAppreciationTaxQueryOptions) schema.LandAppreciationTaxQueryOptions {
	var opt schema.LandAppreciationTaxQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *LandAppreciationTax) Query(ctx context.Context, params schema.LandAppreciationTaxQueryParam, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTaxQueryResult, error) {
	db := entity.GetLandAppreciationTaxDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.LandAppreciationTaxes
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.LandAppreciationTaxQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaLandAppreciationTaxes(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *LandAppreciationTax) Get(ctx context.Context, recordID string, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTax, error) {
	db := entity.GetLandAppreciationTaxDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.LandAppreciationTax
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaLandAppreciationTax(), nil
}

// GetByProjectID 查询指定数据
func (a *LandAppreciationTax) GetByProjectID(ctx context.Context, projectID string, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTax, error) {
	db := entity.GetLandAppreciationTaxDB(ctx, a.db).Where("project_id=?", projectID)
	var item entity.LandAppreciationTax
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaLandAppreciationTax(), nil
}

// Create 创建数据
func (a *LandAppreciationTax) Create(ctx context.Context, item schema.LandAppreciationTax) error {
	LandAppreciationTax := entity.SchemaLandAppreciationTax(item).ToLandAppreciationTax()
	result := entity.GetLandAppreciationTaxDB(ctx, a.db).Create(LandAppreciationTax)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *LandAppreciationTax) Update(ctx context.Context, recordID string, item schema.LandAppreciationTax) error {
	LandAppreciationTax := entity.SchemaLandAppreciationTax(item).ToLandAppreciationTax()
	result := entity.GetLandAppreciationTaxDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(LandAppreciationTax)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *LandAppreciationTax) Delete(ctx context.Context, recordID string) error {
	result := entity.GetLandAppreciationTaxDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.LandAppreciationTax{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
