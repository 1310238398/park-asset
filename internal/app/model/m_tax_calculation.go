package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ITaxCalculation 税目计算表存储接口
type ITaxCalculation interface {
	// 查询数据
	Query(ctx context.Context, params schema.TaxCalculationQueryParam, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculationQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.TaxCalculationQueryOptions) (*schema.TaxCalculation, error)
	// 根据名称查询指定数据
	GetByName(ctx context.Context, name string) (*schema.TaxCalculation, error)
	// 创建数据
	Create(ctx context.Context, item schema.TaxCalculation) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.TaxCalculation) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
