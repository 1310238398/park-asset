package internal

import (
	"context"
	"fmt"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewOfficeBuilding 创建写字楼管理
func NewOfficeBuilding(
	mTrans model.ITrans,
	mOfficeBuilding model.IOfficeBuilding,
	mAsset model.IAsset,
) *OfficeBuilding {
	return &OfficeBuilding{
		TransModel:          mTrans,
		OfficeBuildingModel: mOfficeBuilding,
		AssetModel:          mAsset,
	}
}

// OfficeBuilding 写字楼管理业务逻辑
type OfficeBuilding struct {
	TransModel          model.ITrans
	OfficeBuildingModel model.IOfficeBuilding
	AssetModel          model.IAsset
}

// Query 查询数据
func (a *OfficeBuilding) Query(ctx context.Context, params schema.OfficeBuildingQueryParam, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuildingQueryResult, error) {
	return a.OfficeBuildingModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *OfficeBuilding) Get(ctx context.Context, recordID string, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuilding, error) {
	item, err := a.OfficeBuildingModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *OfficeBuilding) getUpdate(ctx context.Context, recordID string) (*schema.OfficeBuilding, error) {
	return a.Get(ctx, recordID)
}

func (a *OfficeBuilding) checkName(ctx context.Context, item schema.OfficeBuilding) error {
	result, err := a.OfficeBuildingModel.Query(ctx, schema.OfficeBuildingQueryParam{
		ProjectID:    item.ProjectID,
		Name:         item.Name,
		BuildingType: item.BuildingType,
	}, schema.OfficeBuildingQueryOptions{
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
func (a *OfficeBuilding) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.OfficeBuildingModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	return a.joinParentPath(pitem.ParentPath, pitem.RecordID), nil
}

func (a *OfficeBuilding) joinParentPath(parentPath, parentID string) string {
	if parentPath == "" && parentID == "" {
		return ""
	}

	if parentPath != "" {
		parentPath += "/"
	}
	return parentPath + parentID
}

// 基于父级数据创建写字楼
func (a *OfficeBuilding) createWithParentItem(ctx context.Context, pitem schema.OfficeBuilding, name string, btype int) (*schema.OfficeBuilding, error) {
	item := schema.OfficeBuilding{
		RecordID:     util.MustUUID(),
		ProjectID:    pitem.ProjectID,
		Name:         name,
		BuildingType: btype,
		ParentID:     pitem.RecordID,
		ParentPath:   a.joinParentPath(pitem.ParentPath, pitem.RecordID),
		Creator:      pitem.Creator,
	}
	err := a.OfficeBuildingModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}

	err = a.createAsset(ctx, item, "")
	if err != nil {
		return nil, err
	}

	return &item, nil
}

// 创建资产数据
func (a *OfficeBuilding) createAsset(ctx context.Context, item schema.OfficeBuilding, historyID string) error {
	return a.AssetModel.Create(ctx, schema.Asset{
		RecordID:     item.RecordID,
		ProjectID:    item.ProjectID,
		AssetType:    1,
		Creator:      item.Creator,
		HistoryID:    historyID,
		Name:         item.Name,
		BuildingArea: item.BuildingArea,
		RentArea:     item.RentArea,
		RentStatus:   item.RentStatus,
	})
}

// Create 创建数据
func (a *OfficeBuilding) Create(ctx context.Context, item schema.OfficeBuilding) (*schema.OfficeBuilding, error) {
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
		err := a.OfficeBuildingModel.Create(ctx, item)
		if err != nil {
			return err
		}

		err = a.createAsset(ctx, item, "")
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

// Update 更新数据
func (a *OfficeBuilding) Update(ctx context.Context, recordID string, item schema.OfficeBuilding) (*schema.OfficeBuilding, error) {
	oldItem, err := a.OfficeBuildingModel.Get(ctx, recordID)
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

	item.ParentPath = oldItem.ParentPath
	err = a.OfficeBuildingModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *OfficeBuilding) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.OfficeBuildingModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	result, err := a.OfficeBuildingModel.Query(ctx, schema.OfficeBuildingQueryParam{
		ParentID: recordID,
	}, schema.OfficeBuildingQueryOptions{
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

		return a.OfficeBuildingModel.Delete(ctx, recordID)
	})
}
