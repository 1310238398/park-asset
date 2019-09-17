package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewSystemParameter 创建系统参数管理
func NewSystemParameter(mSystemParameter model.ISystemParameter) *SystemParameter {
	return &SystemParameter{
		SystemParameterModel: mSystemParameter,
	}
}

// SystemParameter 系统参数管理业务逻辑
type SystemParameter struct {
	SystemParameterModel model.ISystemParameter
}

// Query 查询数据
func (a *SystemParameter) Query(ctx context.Context, params schema.SystemParameterQueryParam, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameterQueryResult, error) {
	return a.SystemParameterModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *SystemParameter) Get(ctx context.Context, recordID string, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameter, error) {
	item, err := a.SystemParameterModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *SystemParameter) getUpdate(ctx context.Context, recordID string) (*schema.SystemParameter, error) {
	return a.Get(ctx, recordID)
}

func (a *SystemParameter) checkCode(ctx context.Context, code string) error {
	result, err := a.SystemParameterModel.Query(ctx, schema.SystemParameterQueryParam{
		Code: code,
	}, schema.SystemParameterQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

// Create 创建数据
func (a *SystemParameter) Create(ctx context.Context, item schema.SystemParameter) (*schema.SystemParameter, error) {
	err := a.checkCode(ctx, item.Code)
	if err != nil {
		return nil, err
	}

	item.RecordID = util.MustUUID()
	err = a.SystemParameterModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *SystemParameter) Update(ctx context.Context, recordID string, item schema.SystemParameter) (*schema.SystemParameter, error) {
	oldItem, err := a.SystemParameterModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if oldItem.Code != item.Code {
		err := a.checkCode(ctx, item.Code)
		if err != nil {
			return nil, err
		}
	}

	err = a.SystemParameterModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *SystemParameter) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.SystemParameterModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.SystemParameterModel.Delete(ctx, recordID)
}

// UpdateStatus 更新状态
func (a *SystemParameter) UpdateStatus(ctx context.Context, recordID string, status int) error {
	return a.SystemParameterModel.UpdateStatus(ctx, recordID, status)
}
