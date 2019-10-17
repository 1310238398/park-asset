package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewCarChanger 创建车改商管理
func NewCarChanger(mTrans model.ITrans, mAsset model.IAsset, mCarChanger model.ICarChanger) *CarChanger {
	return &CarChanger{
		TransModel:      mTrans,
		AssetModel:      mAsset,
		CarChangerModel: mCarChanger,
	}
}

// CarChanger 车改商管理业务逻辑
type CarChanger struct {
	TransModel      model.ITrans
	AssetModel      model.IAsset
	CarChangerModel model.ICarChanger
}

// Query 查询数据
func (a *CarChanger) Query(ctx context.Context, params schema.CarChangerQueryParam, opts ...schema.CarChangerQueryOptions) (*schema.CarChangerQueryResult, error) {
	return a.CarChangerModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *CarChanger) Get(ctx context.Context, recordID string, opts ...schema.CarChangerQueryOptions) (*schema.CarChanger, error) {
	item, err := a.CarChangerModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *CarChanger) getUpdate(ctx context.Context, recordID string) (*schema.CarChanger, error) {
	return a.Get(ctx, recordID)
}

func (a *CarChanger) checkName(ctx context.Context, item schema.CarChanger) error {
	result, err := a.CarChangerModel.Query(ctx, schema.CarChangerQueryParam{
		ProjectID: item.ProjectID,
		Name:      item.Name,
	}, schema.CarChangerQueryOptions{
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
func (a *CarChanger) createAsset(ctx context.Context, item schema.CarChanger) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    7,
		Creator:      item.Creator,
		Name:         item.Name,
		BuildingArea: item.BuildingArea,
		RentArea:     item.RentArea,
		RentStatus:   item.RentStatus,
	})
}

// Create 创建数据
func (a *CarChanger) Create(ctx context.Context, item schema.CarChanger) (*schema.CarChanger, error) {
	err := a.checkName(ctx, item)
	if err != nil {
		return nil, err
	}
	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.CarChangerModel.Create(ctx, item)
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
func (a *CarChanger) updateAsset(ctx context.Context, recordID string, item schema.CarChanger) error {
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
func (a *CarChanger) Update(ctx context.Context, recordID string, item schema.CarChanger) (*schema.CarChanger, error) {
	oldItem, err := a.CarChangerModel.Get(ctx, recordID)
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
		err := a.CarChangerModel.Update(ctx, recordID, item)
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
func (a *CarChanger) Delete(ctx context.Context, recordID string) error {

	oldItem, err := a.CarChangerModel.Get(ctx, recordID)
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

		return a.CarChangerModel.Delete(ctx, recordID)
	})
}
