package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewPlot 创建地块管理
func NewPlot(mPlot model.IPlot) *Plot {
	return &Plot{
		PlotModel: mPlot,
	}
}

// Plot 地块管理业务逻辑
type Plot struct {
	PlotModel model.IPlot
}

// Query 查询数据
func (a *Plot) Query(ctx context.Context, params schema.PlotQueryParam, opts ...schema.PlotQueryOptions) (*schema.PlotQueryResult, error) {
	return a.PlotModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Plot) Get(ctx context.Context, recordID string, opts ...schema.PlotQueryOptions) (*schema.Plot, error) {
	item, err := a.PlotModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Plot) getUpdate(ctx context.Context, recordID string) (*schema.Plot, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Plot) Create(ctx context.Context, item schema.Plot) (*schema.Plot, error) {
	item.RecordID = util.MustUUID()
	err := a.PlotModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Plot) Update(ctx context.Context, recordID string, item schema.Plot) (*schema.Plot, error) {
	oldItem, err := a.PlotModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.PlotModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Plot) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.PlotModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.PlotModel.Delete(ctx, recordID)
}
