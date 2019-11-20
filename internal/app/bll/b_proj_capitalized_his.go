package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjCapitalizedHis 项目资本化利息测算历史业务逻辑接口
type IProjCapitalizedHis interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjCapitalizedHisQueryParam, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHisQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedHisQueryOptions) (*schema.ProjCapitalizedHis, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjCapitalizedHis) (*schema.ProjCapitalizedHis, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjCapitalizedHis) (*schema.ProjCapitalizedHis, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
