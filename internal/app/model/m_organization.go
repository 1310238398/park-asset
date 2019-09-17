package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IOrganization 组织机构管理存储接口
type IOrganization interface {
	// 查询数据
	Query(ctx context.Context, params schema.OrganizationQueryParam, opts ...schema.OrganizationQueryOptions) (*schema.OrganizationQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.OrganizationQueryOptions) (*schema.Organization, error)
	// 创建数据
	Create(ctx context.Context, item schema.Organization) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.Organization) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 更新父级路径
	UpdateParentPath(ctx context.Context, recordID, parentPath string) error
}
