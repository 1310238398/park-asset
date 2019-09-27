package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IFactoryBuilding 厂房管理业务逻辑接口
type IFactoryBuilding interface {
	// 查询数据
	Query(ctx context.Context, params schema.FactoryBuildingQueryParam, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuildingQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuilding, error)
	// 创建数据
	Create(ctx context.Context, item schema.FactoryBuilding) (*schema.FactoryBuilding, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.FactoryBuilding) (*schema.FactoryBuilding, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
