package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewContract 创建合同信息管理存储实例
func NewContract(db *gormplus.DB) *Contract {
	return &Contract{db}
}

// Contract 合同信息管理存储
type Contract struct {
	db *gormplus.DB
}

func (a *Contract) getQueryOption(opts ...schema.ContractQueryOptions) schema.ContractQueryOptions {
	var opt schema.ContractQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Contract) Query(ctx context.Context, params schema.ContractQueryParam, opts ...schema.ContractQueryOptions) (*schema.ContractQueryResult, error) {
	db := entity.GetContractDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Contracts
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ContractQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaContracts(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Contract) Get(ctx context.Context, recordID string, opts ...schema.ContractQueryOptions) (*schema.Contract, error) {
	db := entity.GetContractDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Contract
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaContract(), nil
}

// Create 创建数据
func (a *Contract) Create(ctx context.Context, item schema.Contract) error {
	Contract := entity.SchemaContract(item).ToContract()
	result := entity.GetContractDB(ctx, a.db).Create(Contract)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Contract) Update(ctx context.Context, recordID string, item schema.Contract) error {
	Contract := entity.SchemaContract(item).ToContract()
	result := entity.GetContractDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Contract)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Contract) Delete(ctx context.Context, recordID string) error {
	result := entity.GetContractDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Contract{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
