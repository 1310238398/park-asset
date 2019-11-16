package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IExpenditure 支出节点存储接口
type IExpenditure interface {
	// 查询数据
	Query(ctx context.Context, params schema.ExpenditureQueryParam, opts ...schema.ExpenditureQueryOptions) (*schema.ExpenditureQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ExpenditureQueryOptions) (*schema.Expenditure, error)
	// 创建数据
	Create(ctx context.Context, item schema.Expenditure) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Expenditure) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
