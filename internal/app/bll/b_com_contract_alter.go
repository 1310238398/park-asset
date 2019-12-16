package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContractAlter 变更管理业务逻辑接口
type IComContractAlter interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContractAlter) (*schema.ComContractAlter, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContractAlter) (*schema.ComContractAlter, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error
}
