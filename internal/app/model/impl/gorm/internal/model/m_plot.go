package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewPlot 创建地块管理存储实例
func NewPlot(db *gormplus.DB) *Plot {
	return &Plot{db}
}

// Plot 地块管理存储
type Plot struct {
	db *gormplus.DB
}

func (a *Plot) getQueryOption(opts ...schema.PlotQueryOptions) schema.PlotQueryOptions {
	var opt schema.PlotQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Plot) Query(ctx context.Context, params schema.PlotQueryParam, opts ...schema.PlotQueryOptions) (*schema.PlotQueryResult, error) {
	db := entity.GetPlotDB(ctx, a.db).DB

	if v := params.Name; v != "" {
		db = db.Where("name=?", v)
	}
	if v := params.RecordIDs; len(v) > 0 {
		db = db.Where("record_id IN(?)", v)
	}
	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Plots
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.PlotQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaPlots(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Plot) Get(ctx context.Context, recordID string, opts ...schema.PlotQueryOptions) (*schema.Plot, error) {
	db := entity.GetPlotDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Plot
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaPlot(), nil
}

// Create 创建数据
func (a *Plot) Create(ctx context.Context, item schema.Plot) error {
	Plot := entity.SchemaPlot(item).ToPlot()
	result := entity.GetPlotDB(ctx, a.db).Create(Plot)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Plot) Update(ctx context.Context, recordID string, item schema.Plot) error {
	Plot := entity.SchemaPlot(item).ToPlot()
	result := entity.GetPlotDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Plot)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Plot) Delete(ctx context.Context, recordID string) error {
	result := entity.GetPlotDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Plot{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
