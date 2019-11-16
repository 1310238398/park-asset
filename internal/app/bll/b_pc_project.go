package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IPcProject 成本项目管理业务逻辑接口
type IPcProject interface {
	// 查询数据
	Query(ctx context.Context, params schema.PcProjectQueryParam, opts ...schema.PcProjectQueryOptions) (*schema.PcProjectQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.PcProjectQueryOptions) (*schema.PcProject, error)
	// 创建数据
	Create(ctx context.Context, item schema.PcProject) (*schema.PcProject, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.PcProject) (*schema.PcProject, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
