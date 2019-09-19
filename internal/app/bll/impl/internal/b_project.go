package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProject 创建项目管理
func NewProject(mProject model.IProject) *Project {
	return &Project{
		ProjectModel: mProject,
	}
}

// Project 项目管理业务逻辑
type Project struct {
	ProjectModel model.IProject
}

// Query 查询数据
func (a *Project) Query(ctx context.Context, params schema.ProjectQueryParam, opts ...schema.ProjectQueryOptions) (*schema.ProjectQueryResult, error) {

	return a.ProjectModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Project) Get(ctx context.Context, recordID string, opts ...schema.ProjectQueryOptions) (*schema.Project, error) {
	item, err := a.ProjectModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Project) getUpdate(ctx context.Context, recordID string) (*schema.Project, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Project) Create(ctx context.Context, item schema.Project) (*schema.Project, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjectModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Project) Update(ctx context.Context, recordID string, item schema.Project) (*schema.Project, error) {
	oldItem, err := a.ProjectModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjectModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Project) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjectModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjectModel.Delete(ctx, recordID)
}
