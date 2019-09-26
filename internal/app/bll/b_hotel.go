package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IHotel 酒店管理业务逻辑接口
type IHotel interface {
	// 查询数据
	Query(ctx context.Context, params schema.HotelQueryParam, opts ...schema.HotelQueryOptions) (*schema.HotelQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.HotelQueryOptions) (*schema.Hotel, error)
	// 创建数据
	Create(ctx context.Context, item schema.Hotel) (*schema.Hotel, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Hotel) (*schema.Hotel, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
