package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IBusinessFormat 业态业务逻辑接口
type IBusinessFormat interface {
	// 查询数据
	Query(ctx context.Context, params schema.BusinessFormatQueryParam, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormatQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.BusinessFormatQueryOptions) (*schema.BusinessFormat, error)
	// 创建数据
	Create(ctx context.Context, item schema.BusinessFormat) (*schema.BusinessFormat, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.BusinessFormat) (*schema.BusinessFormat, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
