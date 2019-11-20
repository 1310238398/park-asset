package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ILandAppreciationTax 土地增值税业务逻辑接口
type ILandAppreciationTax interface {
	// 查询数据
	Query(ctx context.Context, params schema.LandAppreciationTaxQueryParam, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTaxQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.LandAppreciationTaxQueryOptions) (*schema.LandAppreciationTax, error)
	// 创建数据
	Create(ctx context.Context, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.LandAppreciationTax) (*schema.LandAppreciationTax, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
