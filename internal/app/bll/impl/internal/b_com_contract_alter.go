package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewComContractAlter 创建变更管理
func NewComContractAlter(mComContractAlter model.IComContractAlter) *ComContractAlter {
	return &ComContractAlter{
		ComContractAlterModel: mComContractAlter,
	}
}

// ComContractAlter 变更管理业务逻辑
type ComContractAlter struct {
	ComContractAlterModel model.IComContractAlter
}

// Query 查询数据
func (a *ComContractAlter) Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error) {
	return a.ComContractAlterModel.Query(ctx, params, opts...)
}

// QueryDesignByComContractID 查询数据
func (a *ComContractAlter) QueryDesignByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error) {
	return a.ComContractAlterModel.QueryDesignByComContractID(ctx, ComContractID, params, opts...)
}

// QuerySignByComContractID 查询数据
func (a *ComContractAlter) QuerySignByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error) {
	return a.ComContractAlterModel.QuerySignByComContractID(ctx, ComContractID, params, opts...)
}

// QueryStuffPriceByComContractID 查询数据
func (a *ComContractAlter) QueryStuffPriceByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error) {
	return a.ComContractAlterModel.QueryStuffPriceByComContractID(ctx, ComContractID, params, opts...)
}

// Get 查询指定数据
func (a *ComContractAlter) Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error) {
	item, err := a.ComContractAlterModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ComContractAlter) getUpdate(ctx context.Context, recordID string) (*schema.ComContractAlter, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ComContractAlter) Create(ctx context.Context, item schema.ComContractAlter) (*schema.ComContractAlter, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ComContractAlter) Update(ctx context.Context, recordID string, item schema.ComContractAlter) (*schema.ComContractAlter, error) {
	oldItem, err := a.ComContractAlterModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ComContractAlter) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.Delete(ctx, recordID)
}
