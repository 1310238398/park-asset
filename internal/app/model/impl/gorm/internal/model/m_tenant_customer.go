package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewTenantCustomer 创建租户信息管理存储实例
func NewTenantCustomer(db *gormplus.DB) *TenantCustomer {
	return &TenantCustomer{db}
}

// TenantCustomer 租户信息管理存储
type TenantCustomer struct {
	db *gormplus.DB
}

func (a *TenantCustomer) getQueryOption(opts ...schema.TenantCustomerQueryOptions) schema.TenantCustomerQueryOptions {
	var opt schema.TenantCustomerQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *TenantCustomer) Query(ctx context.Context, params schema.TenantCustomerQueryParam, opts ...schema.TenantCustomerQueryOptions) (*schema.TenantCustomerQueryResult, error) {
	db := entity.GetTenantCustomerDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.TenantCustomers
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.TenantCustomerQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaTenantCustomers(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *TenantCustomer) Get(ctx context.Context, recordID string, opts ...schema.TenantCustomerQueryOptions) (*schema.TenantCustomer, error) {
	db := entity.GetTenantCustomerDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.TenantCustomer
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaTenantCustomer(), nil
}

// Create 创建数据
func (a *TenantCustomer) Create(ctx context.Context, item schema.TenantCustomer) error {
	TenantCustomer := entity.SchemaTenantCustomer(item).ToTenantCustomer()
	result := entity.GetTenantCustomerDB(ctx, a.db).Create(TenantCustomer)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *TenantCustomer) Update(ctx context.Context, recordID string, item schema.TenantCustomer) error {
	TenantCustomer := entity.SchemaTenantCustomer(item).ToTenantCustomer()
	result := entity.GetTenantCustomerDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(TenantCustomer)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *TenantCustomer) Delete(ctx context.Context, recordID string) error {
	result := entity.GetTenantCustomerDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.TenantCustomer{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
