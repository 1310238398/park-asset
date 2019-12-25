package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContract 合同管理存储接口
type IComContract interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractQueryParam, opts ...schema.ComContractQueryOptions) (*schema.ComContractQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractQueryOptions) (*schema.ComContract, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContract) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContract) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 提交审核
	Commit(ctx context.Context, recordID string) error
	// 通过审核
	PassCheck(ctx context.Context, recordID string) error
	// 取消提交审核
	CancelCommit(ctx context.Context, recordID string) error

	// 设置生效
	TakeEffect(ctx context.Context, recordID string, data schema.ComContractEffectInfo) error
	// 更新合同结算金额
	UpdateSettlementAmount(ctx context.Context, data schema.SettlementRecord) error
}
