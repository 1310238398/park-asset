package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContractAttachment 合同-附件存储接口
type IComContractAttachment interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractAttachmentQueryParam, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachmentQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachment, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContractAttachment) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContractAttachment) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// DeleteByBizID
	DeleteByBizID(ctx context.Context, recordID string) error
	// 通过bizid查询附件列表
	QueryByBizID(ctx context.Context, recordID string) ([]*schema.ComContractAttachment, error)
}
