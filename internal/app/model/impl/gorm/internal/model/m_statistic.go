package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewStatistic 创建统计查询存储实例
func NewStatistic(db *gormplus.DB) *Statistic {
	return &Statistic{db}
}

// Statistic 统计查询存储
type Statistic struct {
	db *gormplus.DB
}

func (a *Statistic) getQueryOption(opts ...schema.StatisticQueryOptions) schema.StatisticQueryOptions {
	var opt schema.StatisticQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Statistic) Query(ctx context.Context, params schema.StatisticQueryParam, opts ...schema.StatisticQueryOptions) (*schema.StatisticQueryResult, error) {
	db := entity.GetStatisticDB(ctx, a.db).DB

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Statistics
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.StatisticQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaStatistics(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Statistic) Get(ctx context.Context, recordID string, opts ...schema.StatisticQueryOptions) (*schema.Statistic, error) {
	db := entity.GetStatisticDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Statistic
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaStatistic(), nil
}

// Create 创建数据
func (a *Statistic) Create(ctx context.Context, item schema.Statistic) error {
	Statistic := entity.SchemaStatistic(item).ToStatistic()
	result := entity.GetStatisticDB(ctx, a.db).Create(Statistic)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Statistic) Update(ctx context.Context, recordID string, item schema.Statistic) error {
	Statistic := entity.SchemaStatistic(item).ToStatistic()
	result := entity.GetStatisticDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Statistic)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Statistic) Delete(ctx context.Context, recordID string) error {
	result := entity.GetStatisticDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Statistic{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
