package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewOfficeBuilding 创建写字楼管理
func NewOfficeBuilding(mOfficeBuilding model.IOfficeBuilding) *OfficeBuilding {
	return &OfficeBuilding{
		OfficeBuildingModel: mOfficeBuilding,
	}
}

// OfficeBuilding 写字楼管理业务逻辑
type OfficeBuilding struct {
	OfficeBuildingModel model.IOfficeBuilding
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

// Create 创建数据
func (a *OfficeBuilding) Create(ctx context.Context, item schema.OfficeBuilding) (*schema.OfficeBuilding, error) {
	item.RecordID = util.MustUUID()
	err := a.OfficeBuildingModel.Create(ctx, item)
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
	}

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

	return a.OfficeBuildingModel.Delete(ctx, recordID)
}
