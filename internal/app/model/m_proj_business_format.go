package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjBusinessFormat 项目业态存储接口
type IProjBusinessFormat interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjBusinessFormatQueryParam, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormatQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormat, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjBusinessFormat) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjBusinessFormat) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
