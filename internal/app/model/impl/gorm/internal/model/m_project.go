package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewProject 创建项目管理存储实例
func NewProject(db *gormplus.DB) *Project {
	return &Project{db}
}

// Project 项目管理存储
type Project struct {
	db *gormplus.DB
}

func (a *Project) getQueryOption(opts ...schema.ProjectQueryOptions) schema.ProjectQueryOptions {
	var opt schema.ProjectQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Project) Query(ctx context.Context, params schema.ProjectQueryParam, opts ...schema.ProjectQueryOptions) (*schema.ProjectQueryResult, error) {
	db := entity.GetProjectDB(ctx, a.db).DB

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.Nature; v != "" {
		db = db.Where("nature=?", v)
	}
	if v := params.Name; v != "" {
		db = db.Where("name=?", v)
	}
	if v := params.OrgID; v != "" {
		db = db.Where("org_id=?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Projects
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjectQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjects(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Project) Get(ctx context.Context, recordID string, opts ...schema.ProjectQueryOptions) (*schema.Project, error) {
	db := entity.GetProjectDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Project
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProject(), nil
}

// Create 创建数据
func (a *Project) Create(ctx context.Context, item schema.Project) error {
	Project := entity.SchemaProject(item).ToProject()
	result := entity.GetProjectDB(ctx, a.db).Create(Project)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Project) Update(ctx context.Context, recordID string, item schema.Project) error {
	Project := entity.SchemaProject(item).ToProject()
	result := entity.GetProjectDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Project)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Project) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjectDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Project{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
