package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewRentDetail 创建租金明细存储实例
func NewRentDetail(db *gormplus.DB) *RentDetail {
	return &RentDetail{db}
}

// RentDetail 租金明细存储
type RentDetail struct {
	db *gormplus.DB
}

func (a *RentDetail) getQueryOption(opts ...schema.RentDetailQueryOptions) schema.RentDetailQueryOptions {
	var opt schema.RentDetailQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *RentDetail) Query(ctx context.Context, params schema.RentDetailQueryParam, opts ...schema.RentDetailQueryOptions) (*schema.RentDetailQueryResult, error) {
	db := entity.GetRentDetailDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.RentDetails
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.RentDetailQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaRentDetails(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *RentDetail) Get(ctx context.Context, recordID string, opts ...schema.RentDetailQueryOptions) (*schema.RentDetail, error) {
	db := entity.GetRentDetailDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.RentDetail
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaRentDetail(), nil
}

// Create 创建数据
func (a *RentDetail) Create(ctx context.Context, item schema.RentDetail) error {
	RentDetail := entity.SchemaRentDetail(item).ToRentDetail()
	result := entity.GetRentDetailDB(ctx, a.db).Create(RentDetail)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *RentDetail) Update(ctx context.Context, recordID string, item schema.RentDetail) error {
	RentDetail := entity.SchemaRentDetail(item).ToRentDetail()
	result := entity.GetRentDetailDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(RentDetail)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *RentDetail) Delete(ctx context.Context, recordID string) error {
	result := entity.GetRentDetailDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.RentDetail{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
