package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjFile 创建成本项目文件管理
func NewProjFile(mProjFile model.IProjFile) *ProjFile {
	return &ProjFile{
		ProjFileModel: mProjFile,
	}
}

// ProjFile 成本项目文件管理业务逻辑
type ProjFile struct {
	ProjFileModel model.IProjFile
}

// Query 查询数据
func (a *ProjFile) Query(ctx context.Context, params schema.ProjFileQueryParam, opts ...schema.ProjFileQueryOptions) (*schema.ProjFileQueryResult, error) {
	return a.ProjFileModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjFile) Get(ctx context.Context, recordID string, opts ...schema.ProjFileQueryOptions) (*schema.ProjFile, error) {
	item, err := a.ProjFileModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjFile) getUpdate(ctx context.Context, recordID string) (*schema.ProjFile, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjFile) Create(ctx context.Context, item schema.ProjFile) (*schema.ProjFile, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjFileModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjFile) Update(ctx context.Context, recordID string, item schema.ProjFile) (*schema.ProjFile, error) {
	oldItem, err := a.ProjFileModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjFileModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjFile) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjFileModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjFileModel.Delete(ctx, recordID)
}
