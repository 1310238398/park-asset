package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjExpenditureTime 创建项目支出节点时间表
func NewProjExpenditureTime(mProjExpenditureTime model.IProjExpenditureTime) *ProjExpenditureTime {
	return &ProjExpenditureTime{
		ProjExpenditureTimeModel: mProjExpenditureTime,
	}
}

// ProjExpenditureTime 项目支出节点时间表业务逻辑
type ProjExpenditureTime struct {
	ProjExpenditureTimeModel model.IProjExpenditureTime
}

// Query 查询数据
func (a *ProjExpenditureTime) Query(ctx context.Context, params schema.ProjExpenditureTimeQueryParam, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTimeQueryResult, error) {
	return a.ProjExpenditureTimeModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjExpenditureTime) Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureTimeQueryOptions) (*schema.ProjExpenditureTime, error) {
	item, err := a.ProjExpenditureTimeModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjExpenditureTime) getUpdate(ctx context.Context, recordID string) (*schema.ProjExpenditureTime, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjExpenditureTime) Create(ctx context.Context, item schema.ProjExpenditureTime) (*schema.ProjExpenditureTime, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjExpenditureTimeModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjExpenditureTime) Update(ctx context.Context, recordID string, item schema.ProjExpenditureTime) (*schema.ProjExpenditureTime, error) {
	oldItem, err := a.ProjExpenditureTimeModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjExpenditureTimeModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjExpenditureTime) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjExpenditureTimeModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjExpenditureTimeModel.Delete(ctx, recordID)
}
