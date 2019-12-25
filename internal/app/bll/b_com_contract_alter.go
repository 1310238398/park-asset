package bll

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContractAlter 变更管理业务逻辑接口
type IComContractAlter interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error)
	// 查询设计变更数据
	QueryDesignByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error)
	// 查询签证变更数据
	QuerySignByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error)
	// 查询材料批价数据
	QueryStuffPriceByProjectID(ctx context.Context, projectID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error)
	// 查询设计变更数据
	QueryDesignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error)
	// 查询签证变更数据
	QuerySignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error)
	// 查询材料批价数据
	QueryStuffPriceByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error)
	// 查询材料批价数据
	QueryStuffPriceItemByStuffPriceID(ctx context.Context, stuffPriceID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItemQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContractAlter) (*schema.ComContractAlter, error)
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContractAlter) (*schema.ComContractAlter, error)
	// 删除数据
	Delete(ctx context.Context, recordID string) error

	// 查询指定数据
	GetDesign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesign, error)
	// 创建数据
	CreateDesign(ctx context.Context, item schema.ComContractAlterDesign) (*schema.ComContractAlterDesign, error)
	// 更新数据
	UpdateDesign(ctx context.Context, recordID string, item schema.ComContractAlterDesign) (*schema.ComContractAlterDesign, error)
	// 删除数据
	DeleteDesign(ctx context.Context, recordID string) error
	// 提交审核
	CommitDesign(ctx context.Context, recordID string) error
	// 通过审核
	PassCheckDesign(ctx context.Context, recordID string) error
	// 审核退回
	RebackDesign(ctx context.Context, recordID string) error
	// 确认
	AffirmDesign(ctx context.Context, recordID string, info schema.ComContractAlterDesignAffirmInfo) error
	// 查询指定数据
	GetSign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSign, error)
	// 创建数据
	CreateSign(ctx context.Context, item schema.ComContractAlterSign) (*schema.ComContractAlterSign, error)
	// 更新数据
	UpdateSign(ctx context.Context, recordID string, item schema.ComContractAlterSign) (*schema.ComContractAlterSign, error)
	// 删除数据
	DeleteSign(ctx context.Context, recordID string) error
	// 提交审核
	CommitSign(ctx context.Context, recordID string) error
	// 通过审核
	PassCheckSign(ctx context.Context, recordID string) error
	// 审核退回
	RebackSign(ctx context.Context, recordID string) error
	// 确认
	AffirmSign(ctx context.Context, recordID string, info schema.ComContractAlterSignAffirmInfo) error
	// 查询指定数据
	GetStuffPrice(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPrice, error)
	// 创建数据
	CreateStuffPrice(ctx context.Context, item schema.ComContractAlterStuffPrice) (*schema.ComContractAlterStuffPrice, error)
	// 更新数据
	UpdateStuffPrice(ctx context.Context, recordID string, item schema.ComContractAlterStuffPrice) (*schema.ComContractAlterStuffPrice, error)
	// 删除数据
	DeleteStuffPrice(ctx context.Context, recordID string) error
	// 提交审核
	CommitStuffPrice(ctx context.Context, recordID string) error
	// 通过审核
	PassCheckStuffPrice(ctx context.Context, recordID string) error
	// 审核退回
	RebackStuffPrice(ctx context.Context, recordID string) error
	// 查询指定数据
	GetStuffPriceItem(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItem, error)
	// 创建数据
	CreateStuffPriceItem(ctx context.Context, item schema.ComContractAlterStuffPriceItem) (*schema.ComContractAlterStuffPriceItem, error)
	// 更新数据
	UpdateStuffPriceItem(ctx context.Context, recordID string, item schema.ComContractAlterStuffPriceItem) (*schema.ComContractAlterStuffPriceItem, error)
	// 删除数据
	DeleteStuffPriceItem(ctx context.Context, recordID string) error
}
