package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ISettlementRecord 结算信息业务逻辑接口
type ISettlementRecord interface {
	// 查询数据
	Query(ctx context.Context, params schema.SettlementRecordQueryParam, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecordQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecord, error)
	// 创建数据
	Create(ctx context.Context, item schema.SettlementRecord) (*schema.SettlementRecord, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.SettlementRecord) (*schema.SettlementRecord, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
