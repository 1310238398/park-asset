package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContractAttachment 合同-附件业务逻辑接口
type IComContractAttachment interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractAttachmentQueryParam, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachmentQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachment, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContractAttachment) (*schema.ComContractAttachment, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContractAttachment) (*schema.ComContractAttachment, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
