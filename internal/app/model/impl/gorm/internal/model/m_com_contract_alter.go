package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
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
