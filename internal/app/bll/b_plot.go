package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IPlot 地块管理业务逻辑接口
type IPlot interface {
	// 查询数据
	Query(ctx context.Context, params schema.PlotQueryParam, opts ...schema.PlotQueryOptions) (*schema.PlotQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.PlotQueryOptions) (*schema.Plot, error)
	// 创建数据
	Create(ctx context.Context, item schema.Plot) (*schema.Plot, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Plot) (*schema.Plot, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
