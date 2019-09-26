package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IWithdrawal 退租管理存储接口
type IWithdrawal interface {
	// 查询数据
	Query(ctx context.Context, params schema.WithdrawalQueryParam, opts ...schema.WithdrawalQueryOptions) (*schema.WithdrawalQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.WithdrawalQueryOptions) (*schema.Withdrawal, error)
	// 创建数据
	Create(ctx context.Context, item schema.Withdrawal) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Withdrawal) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
