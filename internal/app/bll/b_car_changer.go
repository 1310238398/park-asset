package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ICarChanger 车改商管理业务逻辑接口
type ICarChanger interface {
	// 查询数据
	Query(ctx context.Context, params schema.CarChangerQueryParam, opts ...schema.CarChangerQueryOptions) (*schema.CarChangerQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.CarChangerQueryOptions) (*schema.CarChanger, error)
	// 创建数据
	Create(ctx context.Context, item schema.CarChanger) (*schema.CarChanger, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.CarChanger) (*schema.CarChanger, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
