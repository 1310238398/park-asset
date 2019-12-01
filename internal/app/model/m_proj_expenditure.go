package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjExpenditure 项目支出节点存储接口
type IProjExpenditure interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditure, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjExpenditure) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjExpenditure) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 生成数据
	Generate(ctx context.Context, projectID string, list *schema.ProjExpenditures) error
}
