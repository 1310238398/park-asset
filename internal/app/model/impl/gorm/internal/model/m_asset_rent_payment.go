package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewAssetRentPayment 创建资产租金缴费明细存储实例
func NewAssetRentPayment(db *gormplus.DB) *AssetRentPayment {
	return &AssetRentPayment{db}
}

// AssetRentPayment 资产租金缴费明细存储
type AssetRentPayment struct {
	db *gormplus.DB
}

func (a *AssetRentPayment) getQueryOption(opts ...schema.AssetRentPaymentQueryOptions) schema.AssetRentPaymentQueryOptions {
	var opt schema.AssetRentPaymentQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *AssetRentPayment) Query(ctx context.Context, params schema.AssetRentPaymentQueryParam, opts ...schema.AssetRentPaymentQueryOptions) (*schema.AssetRentPaymentQueryResult, error) {
	db := entity.GetAssetRentPaymentDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.AssetRentPayments
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.AssetRentPaymentQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaAssetRentPayments(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *AssetRentPayment) Get(ctx context.Context, recordID string, opts ...schema.AssetRentPaymentQueryOptions) (*schema.AssetRentPayment, error) {
	db := entity.GetAssetRentPaymentDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.AssetRentPayment
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaAssetRentPayment(), nil
}

// Create 创建数据
func (a *AssetRentPayment) Create(ctx context.Context, item schema.AssetRentPayment) error {
	AssetRentPayment := entity.SchemaAssetRentPayment(item).ToAssetRentPayment()
	result := entity.GetAssetRentPaymentDB(ctx, a.db).Create(AssetRentPayment)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *AssetRentPayment) Update(ctx context.Context, recordID string, item schema.AssetRentPayment) error {
	AssetRentPayment := entity.SchemaAssetRentPayment(item).ToAssetRentPayment()
	result := entity.GetAssetRentPaymentDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(AssetRentPayment)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *AssetRentPayment) Delete(ctx context.Context, recordID string) error {
	result := entity.GetAssetRentPaymentDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.AssetRentPayment{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
