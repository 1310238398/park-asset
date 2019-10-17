package internal

import (
	"context"
	"fmt"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewApartment 创建公寓管理
func NewApartment(
	mTrans model.ITrans,
	mAsset model.IAsset,
	mApartment model.IApartment) *Apartment {
	return &Apartment{
		TransModel:     mTrans,
		AssetModel:     mAsset,
		ApartmentModel: mApartment,
	}
}

// Apartment 公寓管理业务逻辑
type Apartment struct {
	TransModel     model.ITrans
	AssetModel     model.IAsset
	ApartmentModel model.IApartment
}

// Query 查询数据
func (a *Apartment) Query(ctx context.Context, params schema.ApartmentQueryParam, opts ...schema.ApartmentQueryOptions) (*schema.ApartmentQueryResult, error) {
	return a.ApartmentModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Apartment) Get(ctx context.Context, recordID string, opts ...schema.ApartmentQueryOptions) (*schema.Apartment, error) {
	item, err := a.ApartmentModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Apartment) getUpdate(ctx context.Context, recordID string) (*schema.Apartment, error) {
	return a.Get(ctx, recordID)
}

func (a *Apartment) checkName(ctx context.Context, item schema.Apartment) error {
	result, err := a.ApartmentModel.Query(ctx, schema.ApartmentQueryParam{
		ProjectID: item.ProjectID,
		ParentID:  item.ParentID,
		Name:      item.Name,
	}, schema.ApartmentQueryOptions{
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
func (a *Apartment) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.ApartmentModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	return a.joinParentPath(pitem.ParentPath, pitem.RecordID), nil
}

func (a *Apartment) joinParentPath(parentPath, parentID string) string {
	if parentPath == "" && parentID == "" {
		return ""
	}

	if parentPath != "" {
		parentPath += "/"
	}
	return parentPath + parentID
}

// 基于父级数据创建写字楼
func (a *Apartment) createWithParentItem(ctx context.Context, pitem schema.Apartment, name string, btype int) (*schema.Apartment, error) {
	item := schema.Apartment{
		RecordID:     util.MustUUID(),
		ProjectID:    pitem.ProjectID,
		Name:         name,
		BuildingType: btype,
		ParentID:     pitem.RecordID,
		ParentPath:   a.joinParentPath(pitem.ParentPath, pitem.RecordID),
		Creator:      pitem.Creator,
	}
	err := a.ApartmentModel.Create(ctx, item)
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
func (a *Apartment) createAsset(ctx context.Context, item schema.Apartment) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    4,
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
func (a *Apartment) Create(ctx context.Context, item schema.Apartment) (*schema.Apartment, error) {
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
		err := a.ApartmentModel.Create(ctx, item)
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
func (a *Apartment) updateAsset(ctx context.Context, recordID string, item schema.Apartment) error {
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
func (a *Apartment) Update(ctx context.Context, recordID string, item schema.Apartment) (*schema.Apartment, error) {
	oldItem, err := a.ApartmentModel.Get(ctx, recordID)
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

		err := a.ApartmentModel.Update(ctx, recordID, newItem)
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
func (a *Apartment) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ApartmentModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	result, err := a.ApartmentModel.Query(ctx, schema.ApartmentQueryParam{
		ParentID: recordID,
	}, schema.ApartmentQueryOptions{
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

		return a.ApartmentModel.Delete(ctx, recordID)
	})

}
