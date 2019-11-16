package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewPcProject 创建成本项目管理
func NewPcProject(mPcProject model.IPcProject) *PcProject {
	return &PcProject{
		PcProjectModel: mPcProject,
	}
}

// PcProject 成本项目管理业务逻辑
type PcProject struct {
	PcProjectModel model.IPcProject
}

// Query 查询数据
func (a *PcProject) Query(ctx context.Context, params schema.PcProjectQueryParam, opts ...schema.PcProjectQueryOptions) (*schema.PcProjectQueryResult, error) {
	return a.PcProjectModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *PcProject) Get(ctx context.Context, recordID string, opts ...schema.PcProjectQueryOptions) (*schema.PcProject, error) {
	item, err := a.PcProjectModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *PcProject) getUpdate(ctx context.Context, recordID string) (*schema.PcProject, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *PcProject) Create(ctx context.Context, item schema.PcProject) (*schema.PcProject, error) {
	item.RecordID = util.MustUUID()
	err := a.PcProjectModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *PcProject) Update(ctx context.Context, recordID string, item schema.PcProject) (*schema.PcProject, error) {
	oldItem, err := a.PcProjectModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.PcProjectModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *PcProject) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.PcProjectModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.PcProjectModel.Delete(ctx, recordID)
}
