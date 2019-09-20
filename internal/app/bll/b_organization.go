package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IOrganization 组织机构管理业务逻辑接口
type IOrganization interface {
	// 查询数据
	Query(ctx context.Context, params schema.OrganizationQueryParam, opts ...schema.OrganizationQueryOptions) (*schema.OrganizationQueryResult, error)
	// 查询用户的二级子公司
	QueryCompany(ctx context.Context, userID string) (*schema.OrganizationQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.OrganizationQueryOptions) (*schema.Organization, error)
	// 创建数据
	Create(ctx context.Context, item schema.Organization) (*schema.Organization, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Organization) (*schema.Organization, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
