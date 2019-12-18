package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewComContractAlter 创建变更管理存储实例
func NewComContractAlter(db *gorm.DB) *ComContractAlter {
	return &ComContractAlter{db}
}

// ComContractAlter 变更管理存储
type ComContractAlter struct {
	db *gorm.DB
}

func (a *ComContractAlter) getQueryOption(opts ...schema.ComContractAlterQueryOptions) schema.ComContractAlterQueryOptions {
	var opt schema.ComContractAlterQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ComContractAlter) Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Order("id DESC")

	var list entity.ComContractAlters
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlters(),
	}

	return qr, nil
}

// QueryDesignByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QueryDesignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterDesignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterDesigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterDesignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterDesigns(),
	}

	return qr, nil
}

// QuerySignByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QuerySignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterSignDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterSigns
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterSignQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterSigns(),
	}

	return qr, nil
}

// QueryStuffPriceByComContractID 通过合同id查询设计变更
func (a *ComContractAlter) QueryStuffPriceByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAlterStuffPriceDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Where("comcontract_id = ?", comContractID)
	db = db.Order("id DESC")

	var list entity.ComContractAlterStuffPrices
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAlterStuffPriceQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAlterStuffPrices(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ComContractAlter) Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error) {
	db := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAlter
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAlter(), nil
}

// Create 创建数据
func (a *ComContractAlter) Create(ctx context.Context, item schema.ComContractAlter) error {
	eitem := entity.SchemaComContractAlter(item).ToComContractAlter()
	result := entity.GetComContractAlterDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CreateDesign 创建数据
func (a *ComContractAlter) CreateDesign(ctx context.Context, item schema.ComContractAlterDesign) error {
	eitem := entity.SchemaComContractAlterDesign(item).ToComContractAlterDesign()
	result := entity.GetComContractAlterDesignDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ComContractAlter) Update(ctx context.Context, recordID string, item schema.ComContractAlter) error {
	eitem := entity.SchemaComContractAlter(item).ToComContractAlter()
	result := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ComContractAlter) Delete(ctx context.Context, recordID string) error {
	result := entity.GetComContractAlterDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAlter{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
