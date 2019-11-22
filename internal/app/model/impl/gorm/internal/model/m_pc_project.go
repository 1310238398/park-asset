package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewPcProject 创建成本项目管理存储实例
func NewPcProject(db *gorm.DB) *PcProject {
	return &PcProject{db}
}

// PcProject 成本项目管理存储
type PcProject struct {
	db *gorm.DB
}

func (a *PcProject) getQueryOption(opts ...schema.PcProjectQueryOptions) schema.PcProjectQueryOptions {
	var opt schema.PcProjectQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *PcProject) Query(ctx context.Context, params schema.PcProjectQueryParam, opts ...schema.PcProjectQueryOptions) (*schema.PcProjectQueryResult, error) {
	db := entity.GetPcProjectDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name like ?", "%"+v+"%")
	}
	if v := params.OrgID; v != "" {
		db = db.Where("org_id = ?", v)
	}
	if v := params.PlotID; v != "" {
		db = db.Where("plot_id = ?", v)
	}

	if v := params.OrgIDs; len(v) > 0 {
		db = db.Where("org_id IN (?)", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.PcProjects
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.PcProjectQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaPcProjects(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *PcProject) Get(ctx context.Context, recordID string, opts ...schema.PcProjectQueryOptions) (*schema.PcProject, error) {
	db := entity.GetPcProjectDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.PcProject
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaPcProject(), nil
}

// Create 创建数据
func (a *PcProject) Create(ctx context.Context, item schema.PcProject) error {
	PcProject := entity.SchemaPcProject(item).ToPcProject()
	result := entity.GetPcProjectDB(ctx, a.db).Create(PcProject)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *PcProject) Update(ctx context.Context, recordID string, item schema.PcProject) error {
	PcProject := entity.SchemaPcProject(item).ToPcProject()
	result := entity.GetPcProjectDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(PcProject)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *PcProject) Delete(ctx context.Context, recordID string) error {
	result := entity.GetPcProjectDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.PcProject{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
