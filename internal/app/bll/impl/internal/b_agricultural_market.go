package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewAgriculturalMarket 创建农贸市场管理
func NewAgriculturalMarket(mAgriculturalMarket model.IAgriculturalMarket) *AgriculturalMarket {
	return &AgriculturalMarket{
		AgriculturalMarketModel: mAgriculturalMarket,
	}
}

// AgriculturalMarket 农贸市场管理业务逻辑
type AgriculturalMarket struct {
	AgriculturalMarketModel model.IAgriculturalMarket
}

// Query 查询数据
func (a *AgriculturalMarket) Query(ctx context.Context, params schema.AgriculturalMarketQueryParam, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarketQueryResult, error) {
	return a.AgriculturalMarketModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *AgriculturalMarket) Get(ctx context.Context, recordID string, opts ...schema.AgriculturalMarketQueryOptions) (*schema.AgriculturalMarket, error) {
	item, err := a.AgriculturalMarketModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *AgriculturalMarket) getUpdate(ctx context.Context, recordID string) (*schema.AgriculturalMarket, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *AgriculturalMarket) Create(ctx context.Context, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error) {
	item.RecordID = util.MustUUID()
	err := a.AgriculturalMarketModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *AgriculturalMarket) Update(ctx context.Context, recordID string, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error) {
	oldItem, err := a.AgriculturalMarketModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.AgriculturalMarketModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *AgriculturalMarket) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.AgriculturalMarketModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.AgriculturalMarketModel.Delete(ctx, recordID)
}
