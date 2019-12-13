package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IBusinessPartner 业务往来企业业务逻辑接口
type IBusinessPartner interface {
	// 查询数据
	Query(ctx context.Context, params schema.BusinessPartnerQueryParam, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartnerQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartner, error)
	// 创建数据
	Create(ctx context.Context, item schema.BusinessPartner) (*schema.BusinessPartner, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.BusinessPartner) (*schema.BusinessPartner, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
