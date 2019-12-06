package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IProjIncomeCalculation 项目收益测算业务逻辑接口
type IProjIncomeCalculation interface {
	// 查询数据
	Query(ctx context.Context, params schema.ProjIncomeCalculationQueryParam, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculationQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ProjIncomeCalculationQueryOptions) (*schema.ProjIncomeCalculation, error)
	// 查询项目当前收益测算
	GetCurrent(ctx context.Context, projectID string) (*schema.ProjIncomeCalculation, error)
	// 创建数据
	Create(ctx context.Context, item schema.ProjIncomeCalculation) (*schema.ProjIncomeCalculation, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ProjIncomeCalculation) (*schema.ProjIncomeCalculation, error)
	// 更新备注
	UpdateMemo(ctx context.Context, recordID, index string, memo string) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error

	// 更新收益测算
	Renew(ctx context.Context, recordID string) error

	// 创建新版本
	CreateVersion(ctx context.Context, projectID string, data []*schema.ProjCompareItem) error
	// 更新旧版本
	UpdateVersion(ctx context.Context, projectID string, data []*schema.ProjCompareItem) error
	// 获取版本比对
	GetVersionComparison(ctx context.Context, projectID string, versions ...string) ([]*schema.ProjCompareItem, error)

	// 申请审批
	Apply(ctx context.Context, projectID string) error
	// 通过审批
	Pass(ctx context.Context, projectID string) error
	// 驳回审批
	Reject(ctx context.Context, projectID string) error
}
