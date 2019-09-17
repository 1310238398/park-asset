package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// ISystemParameter 系统参数管理存储接口
type ISystemParameter interface {
	// 查询数据
	Query(ctx context.Context, params schema.SystemParameterQueryParam, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameterQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameter, error)
	// 创建数据
	Create(ctx context.Context, item schema.SystemParameter) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.SystemParameter) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 更新状态
	UpdateStatus(ctx context.Context, recordID string, status int) error
}
