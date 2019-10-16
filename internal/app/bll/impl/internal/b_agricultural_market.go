package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewAgriculturalMarket 创建农贸市场管理
func NewAgriculturalMarket(mTrans model.ITrans, mAsset model.IAsset, mAgriculturalMarket model.IAgriculturalMarket) *AgriculturalMarket {
	return &AgriculturalMarket{
		TransModel:              mTrans,
		AssetModel:              mAsset,
		AgriculturalMarketModel: mAgriculturalMarket,
	}
}

// AgriculturalMarket 农贸市场管理业务逻辑
type AgriculturalMarket struct {
	TransModel              model.ITrans
	AssetModel              model.IAsset
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

func (a *AgriculturalMarket) checkName(ctx context.Context, item schema.AgriculturalMarket) error {
	result, err := a.AgriculturalMarketModel.Query(ctx, schema.AgriculturalMarketQueryParam{
		ProjectID: item.ProjectID,
		Name:      item.Name,
	}, schema.AgriculturalMarketQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

// 创建资产数据
func (a *AgriculturalMarket) createAsset(ctx context.Context, item schema.AgriculturalMarket) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    2,
		Creator:      item.Creator,
		Name:         item.Name,
		BuildingArea: item.BuildingArea,
		RentArea:     item.RentArea,
		RentStatus:   item.RentStatus,
	})
}

// Create 创建数据
func (a *AgriculturalMarket) Create(ctx context.Context, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error) {
	err := a.checkName(ctx, item)
	if err != nil {
		return nil, err
	}
	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.AgriculturalMarketModel.Create(ctx, item)
		if err != nil {
			return err
		}

		err = a.createAsset(ctx, item)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// 更新资产数据
func (a *AgriculturalMarket) updateAsset(ctx context.Context, recordID string, item schema.AgriculturalMarket) error {
	oldAssetItem, err := a.AssetModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldAssetItem == nil {
		return errors.ErrNotFound
	}

	newAssetItem := *oldAssetItem
	newAssetItem.Name = item.Name
	newAssetItem.BuildingArea = item.BuildingArea
	newAssetItem.RentArea = item.RentArea
	err = a.AssetModel.Update(ctx, recordID, newAssetItem)
	if err != nil {
		return err
	}

	return nil
}

// Update 更新数据
func (a *AgriculturalMarket) Update(ctx context.Context, recordID string, item schema.AgriculturalMarket) (*schema.AgriculturalMarket, error) {

	oldItem, err := a.AgriculturalMarketModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if oldItem.Name != item.Name {
		if err := a.checkName(ctx, item); err != nil {
			return nil, err
		}
	}

	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		newItem := *oldItem
		newItem.Name = item.Name
		newItem.BuildingArea = item.BuildingArea
		newItem.RentArea = item.RentArea
		err := a.AgriculturalMarketModel.Update(ctx, recordID, item)
		if err != nil {
			return err
		}

		err = a.updateAsset(ctx, recordID, item)
		if err != nil {
			return err
		}

		return nil
	})

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

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		err := a.AssetModel.Delete(ctx, recordID)
		if err != nil {
			return err
		}

		return a.AgriculturalMarketModel.Delete(ctx, recordID)
	})
}
