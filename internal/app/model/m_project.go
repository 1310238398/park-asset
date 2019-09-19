package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProject 项目管理存储接口
type IProject interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjectQueryParam, opts ...schema.ProjectQueryOptions) (*schema.ProjectQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjectQueryOptions) (*schema.Project, error)
	// 创建数据
	Create(ctx context.Context, item schema.Project) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Project) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
