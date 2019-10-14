package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewShop 创建商铺管理
func NewShop(mTrans model.ITrans,
	mAsset model.IAsset,
	mShop model.IShop,
) *Shop {
	return &Shop{
		TransModel: mTrans,
		AssetModel: mAsset,
		ShopModel:  mShop,
	}
}

// Shop 商铺管理业务逻辑
type Shop struct {
	TransModel model.ITrans
	AssetModel model.IAsset
	ShopModel  model.IShop
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

func (a *Shop) checkName(ctx context.Context, item schema.Shop) error {
	result, err := a.ShopModel.Query(ctx, schema.ShopQueryParam{
		ProjectID: item.ProjectID,
		Name:      item.Name,
	}, schema.ShopQueryOptions{
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
func (a *Shop) createAsset(ctx context.Context, item schema.Shop) error {
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
func (a *Shop) Create(ctx context.Context, item schema.Shop) (*schema.Shop, error) {
	err := a.checkName(ctx, item)
	if err != nil {
		return nil, err
	}

	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.ShopModel.Create(ctx, item)
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
func (a *Shop) updateAsset(ctx context.Context, recordID string, item schema.Shop) error {
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
func (a *Shop) Update(ctx context.Context, recordID string, item schema.Shop) (*schema.Shop, error) {
	oldItem, err := a.ShopModel.Get(ctx, recordID)
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
		newItem.Business = item.Business
		err := a.ShopModel.Update(ctx, recordID, item)
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
func (a *Shop) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ShopModel.Get(ctx, recordID)
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

		return a.ShopModel.Delete(ctx, recordID)
	})
}
