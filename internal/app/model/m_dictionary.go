package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IDictionary 字典管理存储接口
type IDictionary interface {
	// 查询数据
	Query(ctx context.Context, params schema.DictionaryQueryParam, opts ...schema.DictionaryQueryOptions) (*schema.DictionaryQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.DictionaryQueryOptions) (*schema.Dictionary, error)
	// 创建数据
	Create(ctx context.Context, item schema.Dictionary) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Dictionary) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 更新父级路径
	UpdateParentPath(ctx context.Context, recordID, parentPath string) error
}
