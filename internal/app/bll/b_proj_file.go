package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjFile 成本项目文件管理业务逻辑接口
type IProjFile interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjFileQueryParam, opts ...schema.ProjFileQueryOptions) (*schema.ProjFileQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjFileQueryOptions) (*schema.ProjFile, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjFile) (*schema.ProjFile, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjFile) (*schema.ProjFile, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
