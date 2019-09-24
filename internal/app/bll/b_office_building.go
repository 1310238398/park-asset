package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IOfficeBuilding 写字楼管理业务逻辑接口
type IOfficeBuilding interface {
	// 查询数据
	Query(ctx context.Context, params schema.OfficeBuildingQueryParam, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuildingQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuilding, error)
	// 创建数据
	Create(ctx context.Context, item schema.OfficeBuilding) (*schema.OfficeBuilding, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.OfficeBuilding) (*schema.OfficeBuilding, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
