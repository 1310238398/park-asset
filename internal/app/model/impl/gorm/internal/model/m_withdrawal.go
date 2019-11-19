package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewWithdrawal 创建退租管理存储实例
func NewWithdrawal(db *gormplus.DB) *Withdrawal {
	return &Withdrawal{db}
}

// Withdrawal 退租管理存储
type Withdrawal struct {
	db *gormplus.DB
}

func (a *Withdrawal) getQueryOption(opts ...schema.WithdrawalQueryOptions) schema.WithdrawalQueryOptions {
	var opt schema.WithdrawalQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Withdrawal) Query(ctx context.Context, params schema.WithdrawalQueryParam, opts ...schema.WithdrawalQueryOptions) (*schema.WithdrawalQueryResult, error) {
	db := entity.GetWithdrawalDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Withdrawals
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.WithdrawalQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaWithdrawals(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Withdrawal) Get(ctx context.Context, recordID string, opts ...schema.WithdrawalQueryOptions) (*schema.Withdrawal, error) {
	db := entity.GetWithdrawalDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Withdrawal
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaWithdrawal(), nil
}

// Create 创建数据
func (a *Withdrawal) Create(ctx context.Context, item schema.Withdrawal) error {
	Withdrawal := entity.SchemaWithdrawal(item).ToWithdrawal()
	result := entity.GetWithdrawalDB(ctx, a.db).Create(Withdrawal)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Withdrawal) Update(ctx context.Context, recordID string, item schema.Withdrawal) error {
	Withdrawal := entity.SchemaWithdrawal(item).ToWithdrawal()
	result := entity.GetWithdrawalDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Withdrawal)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Withdrawal) Delete(ctx context.Context, recordID string) error {
	result := entity.GetWithdrawalDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Withdrawal{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
