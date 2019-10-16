package internal

import (
	"context"
	"fmt"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewHotel 创建酒店管理
func NewHotel(
	mTrans model.ITrans,
	mAsset model.IAsset,
	mHotel model.IHotel) *Hotel {
	return &Hotel{
		TransModel: mTrans,
		AssetModel: mAsset,
		HotelModel: mHotel,
	}
}

// Hotel 酒店管理业务逻辑
type Hotel struct {
	TransModel model.ITrans
	AssetModel model.IAsset
	HotelModel model.IHotel
}

// Query 查询数据
func (a *Hotel) Query(ctx context.Context, params schema.HotelQueryParam, opts ...schema.HotelQueryOptions) (*schema.HotelQueryResult, error) {
	return a.HotelModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Hotel) Get(ctx context.Context, recordID string, opts ...schema.HotelQueryOptions) (*schema.Hotel, error) {
	item, err := a.HotelModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Hotel) getUpdate(ctx context.Context, recordID string) (*schema.Hotel, error) {
	return a.Get(ctx, recordID)
}

func (a *Hotel) checkName(ctx context.Context, item schema.Hotel) error {
	result, err := a.HotelModel.Query(ctx, schema.HotelQueryParam{
		ProjectID: item.ProjectID,
		ParentID:  item.ParentID,
		Name:      item.Name,
	}, schema.HotelQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

// 获取父级路径
func (a *Hotel) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.HotelModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	return a.joinParentPath(pitem.ParentPath, pitem.RecordID), nil
}

func (a *Hotel) joinParentPath(parentPath, parentID string) string {
	if parentPath == "" && parentID == "" {
		return ""
	}

	if parentPath != "" {
		parentPath += "/"
	}
	return parentPath + parentID
}

// 基于父级数据创建写字楼
func (a *Hotel) createWithParentItem(ctx context.Context, pitem schema.Hotel, name string, btype int) (*schema.Hotel, error) {
	item := schema.Hotel{
		RecordID:     util.MustUUID(),
		ProjectID:    pitem.ProjectID,
		Name:         name,
		BuildingType: btype,
		ParentID:     pitem.RecordID,
		ParentPath:   a.joinParentPath(pitem.ParentPath, pitem.RecordID),
		Creator:      pitem.Creator,
	}
	err := a.HotelModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}

	err = a.createAsset(ctx, item)
	if err != nil {
		return nil, err
	}

	return &item, nil
}

// 创建资产数据
func (a *Hotel) createAsset(ctx context.Context, item schema.Hotel) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    1,
		Creator:      item.Creator,
		Name:         item.Name,
		BuildingArea: item.BuildingArea,
		RentArea:     item.RentArea,
		RentStatus:   item.RentStatus,
		ParentID:     item.ParentID,
		ParentPath:   item.ParentPath,
	})
}

// Create 创建数据
func (a *Hotel) Create(ctx context.Context, item schema.Hotel) (*schema.Hotel, error) {
	err := a.checkName(ctx, item)
	if err != nil {
		return nil, err
	}

	item.ParentPath, err = a.getParentPath(ctx, item.ParentID)
	if err != nil {
		return nil, err
	}
	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.HotelModel.Create(ctx, item)
		if err != nil {
			return err
		}

		err = a.createAsset(ctx, item)
		if err != nil {
			return err
		}

		// 如果是非整栋出租，则创建单元、楼层
		if item.IsAllRent == 2 {
			if item.UnitNum > 0 {
				for i := 1; i <= item.UnitNum; i++ {
					unitName := fmt.Sprintf("%s-%s%s", item.Name, util.FillZero(i), item.UnitNaming)
					unitItem, err := a.createWithParentItem(ctx, item, unitName, 2)
					if err != nil {
						return err
					}

					for j := 1; j <= item.LayerNum; j++ {
						layerName := fmt.Sprintf("%s-%s%s", unitItem.Name, util.FillZero(j), item.LayerNaming)
						_, err := a.createWithParentItem(ctx, *unitItem, layerName, 3)
						if err != nil {
							return err
						}
					}
				}
			} else if item.LayerNum > 0 {
				for j := 1; j <= item.LayerNum; j++ {
					layerName := fmt.Sprintf("%s-%s%s", item.Name, util.FillZero(j), item.LayerNaming)
					_, err := a.createWithParentItem(ctx, item, layerName, 3)
					if err != nil {
						return err
					}
				}
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, item.RecordID)
}

// 更新资产数据
func (a *Hotel) updateAsset(ctx context.Context, recordID string, item schema.Hotel) error {
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
func (a *Hotel) Update(ctx context.Context, recordID string, item schema.Hotel) (*schema.Hotel, error) {
	oldItem, err := a.HotelModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if item.Name != oldItem.Name {
		err := a.checkName(ctx, item)
		if err != nil {
			return nil, err
		}
	}

	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		newItem := *oldItem
		newItem.Name = item.Name
		newItem.BuildingArea = item.BuildingArea
		newItem.RentArea = item.RentArea
		newItem.Decoration = item.Decoration

		err := a.HotelModel.Update(ctx, recordID, newItem)
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
func (a *Hotel) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.HotelModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	result, err := a.HotelModel.Query(ctx, schema.HotelQueryParam{
		ParentID: recordID,
	}, schema.HotelQueryOptions{
		PageParam: &schema.PaginationParam{
			PageSize: -1,
		},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrNotAllowDeleteWithChild
	}

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		err := a.AssetModel.Delete(ctx, recordID)
		if err != nil {
			return err
		}

		return a.HotelModel.Delete(ctx, recordID)
	})
}
