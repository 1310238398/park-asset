package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCapitalizedInterest 项目资本化利息测算业务逻辑接口
type IProjCapitalizedInterest interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterestQueryResult, error)
	// 查询整年数据
	QueryYearShow(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam) ([]*schema.ProjCapitalizedInterestYearShow, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterest, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error)
	// 更新整年数据
	UpdateYearShow(ctx context.Context, item schema.ProjCapitalizedInterestYearShow) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
