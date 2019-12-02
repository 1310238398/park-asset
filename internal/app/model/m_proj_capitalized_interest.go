package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCapitalizedInterest 项目资本化利息测算存储接口
type IProjCapitalizedInterest interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterestQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterest, error)
	// 按季度查询数据
	GetByQuarterIndex(ctx context.Context, projectID string, year int, quarter int) (*schema.ProjCapitalizedInterest, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCapitalizedInterest) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCapitalizedInterest) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
