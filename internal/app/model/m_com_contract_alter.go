package model

import (
	"context"

	"gxt-park-assets/internal/app/schema"
)

// IComContractAlter 变更管理存储接口
type IComContractAlter interface {
	// 查询数据
	Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error)
	// 查询设计变更数据
	QueryDesignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error)
	// 查询签证变更数据
	QuerySignByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error)
	// 查询材料批价数据
	QueryStuffPriceByComContractID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error)
	// 查询材料批价数据
	QueryStuffPriceItemByStuffPriceID(ctx context.Context, comContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItemQueryResult, error)
	// 查询指定数据
	Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error)
	// 查询指定设计变更数据
	GetDesign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesign, error)
	// 查询指定签证变更数据
	GetSign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSign, error)
	// 查询指定签证变更数据
	GetStuffPrice(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPrice, error)
	// 查询指定签证变更数据
	GetStuffPriceItem(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItem, error)
	// 创建数据
	Create(ctx context.Context, item schema.ComContractAlter) error
	// 创建数据
	CreateDesign(ctx context.Context, item schema.ComContractAlterDesign) error
	// 创建数据
	CreateSign(ctx context.Context, item schema.ComContractAlterSign) error
	// 创建数据
	CreateStuffPrice(ctx context.Context, item schema.ComContractAlterStuffPrice) error
	// 创建数据
	CreateStuffPriceItem(ctx context.Context, item schema.ComContractAlterStuffPriceItem) error
	// 更新数据
	Update(ctx context.Context, recordID string, item schema.ComContractAlter) error
	// 更新数据
	UpdateDesign(ctx context.Context, recordID string, item schema.ComContractAlterDesign) error
	// 更新数据
	UpdateSign(ctx context.Context, recordID string, item schema.ComContractAlterSign) error
	// 更新数据
	UpdateStuffPrice(ctx context.Context, recordID string, item schema.ComContractAlterStuffPrice) error
	// 更新数据
	UpdateStuffPriceItem(ctx context.Context, recordID string, item schema.ComContractAlterStuffPriceItem) error
	// 设置status值
	SetDesignStatus(ctx context.Context, recordID string, val uint8) error
	SetSignStatus(ctx context.Context, recordID string, val uint8) error
	SetStuffPriceStatus(ctx context.Context, recordID string, val uint8) error
	// 删除数据
	Delete(ctx context.Context, recordID string) error
	// 删除数据
	DeleteDesign(ctx context.Context, recordID string) error
	// 删除数据
	DeleteSign(ctx context.Context, recordID string) error
	// 删除数据
	DeleteStuffPrice(ctx context.Context, recordID string) error
	// 删除数据
	DeleteStuffPriceItem(ctx context.Context, recordID string) error
}
