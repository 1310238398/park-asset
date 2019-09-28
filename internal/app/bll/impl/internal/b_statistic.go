package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewStatistic 创建统计查询
func NewStatistic(mStatistic model.IStatistic) *Statistic {
	return &Statistic{
		StatisticModel: mStatistic,
	}
}

// Statistic 统计查询业务逻辑
type Statistic struct {
	StatisticModel model.IStatistic
}

// Query 查询数据
func (a *Statistic) Query(ctx context.Context, params schema.StatisticQueryParam, opts ...schema.StatisticQueryOptions) (*schema.StatisticQueryResult, error) {
	return a.StatisticModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Statistic) Get(ctx context.Context, recordID string, opts ...schema.StatisticQueryOptions) (*schema.Statistic, error) {
	item, err := a.StatisticModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Statistic) getUpdate(ctx context.Context, recordID string) (*schema.Statistic, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Statistic) Create(ctx context.Context, item schema.Statistic) (*schema.Statistic, error) {
	item.RecordID = util.MustUUID()
	err := a.StatisticModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Statistic) Update(ctx context.Context, recordID string, item schema.Statistic) (*schema.Statistic, error) {
	oldItem, err := a.StatisticModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.StatisticModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Statistic) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.StatisticModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.StatisticModel.Delete(ctx, recordID)
}
