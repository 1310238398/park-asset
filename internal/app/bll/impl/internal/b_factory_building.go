package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewFactoryBuilding 创建厂房管理
func NewFactoryBuilding(mFactoryBuilding model.IFactoryBuilding) *FactoryBuilding {
	return &FactoryBuilding{
		FactoryBuildingModel: mFactoryBuilding,
	}
}

// FactoryBuilding 厂房管理业务逻辑
type FactoryBuilding struct {
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

// Create 创建数据
func (a *FactoryBuilding) Create(ctx context.Context, item schema.FactoryBuilding) (*schema.FactoryBuilding, error) {
	item.RecordID = util.MustUUID()
	err := a.FactoryBuildingModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *FactoryBuilding) Update(ctx context.Context, recordID string, item schema.FactoryBuilding) (*schema.FactoryBuilding, error) {
	oldItem, err := a.FactoryBuildingModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.FactoryBuildingModel.Update(ctx, recordID, item)
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

	return a.FactoryBuildingModel.Delete(ctx, recordID)
}
