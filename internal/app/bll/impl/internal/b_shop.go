package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewShop 创建商铺管理
func NewShop(mShop model.IShop) *Shop {
	return &Shop{
		ShopModel: mShop,
	}
}

// Shop 商铺管理业务逻辑
type Shop struct {
	ShopModel model.IShop
}

// Query 查询数据
func (a *Shop) Query(ctx context.Context, params schema.ShopQueryParam, opts ...schema.ShopQueryOptions) (*schema.ShopQueryResult, error) {
	return a.ShopModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Shop) Get(ctx context.Context, recordID string, opts ...schema.ShopQueryOptions) (*schema.Shop, error) {
	item, err := a.ShopModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Shop) getUpdate(ctx context.Context, recordID string) (*schema.Shop, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Shop) Create(ctx context.Context, item schema.Shop) (*schema.Shop, error) {
	item.RecordID = util.MustUUID()
	err := a.ShopModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Shop) Update(ctx context.Context, recordID string, item schema.Shop) (*schema.Shop, error) {
	oldItem, err := a.ShopModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ShopModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Shop) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ShopModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ShopModel.Delete(ctx, recordID)
}
