package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjDeliveryStandard 创建成本项目交付标准
func NewProjDeliveryStandard(mProjDeliveryStandard model.IProjDeliveryStandard) *ProjDeliveryStandard {
	return &ProjDeliveryStandard{
		ProjDeliveryStandardModel: mProjDeliveryStandard,
	}
}

// ProjDeliveryStandard 成本项目交付标准业务逻辑
type ProjDeliveryStandard struct {
	ProjDeliveryStandardModel model.IProjDeliveryStandard
}

// Query 查询数据
func (a *ProjDeliveryStandard) Query(ctx context.Context, params schema.ProjDeliveryStandardQueryParam, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandardQueryResult, error) {
	return a.ProjDeliveryStandardModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjDeliveryStandard) Get(ctx context.Context, recordID string, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandard, error) {
	item, err := a.ProjDeliveryStandardModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjDeliveryStandard) getUpdate(ctx context.Context, recordID string) (*schema.ProjDeliveryStandard, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjDeliveryStandard) Create(ctx context.Context, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjDeliveryStandardModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjDeliveryStandard) Update(ctx context.Context, recordID string, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error) {
	oldItem, err := a.ProjDeliveryStandardModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjDeliveryStandardModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjDeliveryStandard) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjDeliveryStandardModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjDeliveryStandardModel.Delete(ctx, recordID)
}
