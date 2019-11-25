package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjExpenditureTime 项目支出节点时间表存储接口
type IProjExpenditureTime interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjExpenditureTimeQueryParam, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTimeQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTime, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjExpenditureTime) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjExpenditureTime) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 通过项目支出节点ID删除
	DeleteByProjExpendID(ctx context.Context, projExpenditureID string) error
}
