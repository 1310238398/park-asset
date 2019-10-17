package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewFactoryBuilding 创建厂房管理
func NewFactoryBuilding(mTrans model.ITrans,
	mAsset model.IAsset,
	mFactoryBuilding model.IFactoryBuilding) *FactoryBuilding {
	return &FactoryBuilding{
		TransModel:           mTrans,
		AssetModel:           mAsset,
		FactoryBuildingModel: mFactoryBuilding,
	}
}

// FactoryBuilding 厂房管理业务逻辑
type FactoryBuilding struct {
	TransModel           model.ITrans
	AssetModel           model.IAsset
	FactoryBuildingModel model.IFactoryBuilding
}

// Query 查询数据
func (a *FactoryBuilding) Query(ctx context.Context, params schema.FactoryBuildingQueryParam, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuildingQueryResult, error) {
	return a.FactoryBuildingModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *FactoryBuilding) Get(ctx context.Context, recordID string, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuilding, error) {
	item, err := a.FactoryBuildingModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *FactoryBuilding) getUpdate(ctx context.Context, recordID string) (*schema.FactoryBuilding, error) {
	return a.Get(ctx, recordID)
}

func (a *FactoryBuilding) checkName(ctx context.Context, item schema.FactoryBuilding) error {
	result, err := a.FactoryBuildingModel.Query(ctx, schema.FactoryBuildingQueryParam{
		ProjectID: item.ProjectID,
		Name:      item.Name,
	}, schema.FactoryBuildingQueryOptions{
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
func (a *FactoryBuilding) createAsset(ctx context.Context, item schema.FactoryBuilding) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    3,
		Creator:      item.Creator,
		Name:         item.Name,
		BuildingArea: item.BuildingArea,
		RentArea:     item.RentArea,
		RentStatus:   item.RentStatus,
	})
}

// Create 创建数据
func (a *FactoryBuilding) Create(ctx context.Context, item schema.FactoryBuilding) (*schema.FactoryBuilding, error) {
	err := a.checkName(ctx, item)
	if err != nil {
		return nil, err
	}
	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.FactoryBuildingModel.Create(ctx, item)
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
func (a *FactoryBuilding) updateAsset(ctx context.Context, recordID string, item schema.FactoryBuilding) error {
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
func (a *FactoryBuilding) Update(ctx context.Context, recordID string, item schema.FactoryBuilding) (*schema.FactoryBuilding, error) {
	oldItem, err := a.FactoryBuildingModel.Get(ctx, recordID)
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
		err := a.FactoryBuildingModel.Update(ctx, recordID, item)
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
func (a *FactoryBuilding) Delete(ctx context.Context, recordID string) error {

	oldItem, err := a.FactoryBuildingModel.Get(ctx, recordID)
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

		return a.FactoryBuildingModel.Delete(ctx, recordID)
	})
}
