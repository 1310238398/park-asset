package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewSystemParameter 创建系统参数管理存储实例
func NewSystemParameter(db *gormplus.DB) *SystemParameter {
	return &SystemParameter{db}
}

// SystemParameter 系统参数管理存储
type SystemParameter struct {
	db *gormplus.DB
}

func (a *SystemParameter) getQueryOption(opts ...schema.SystemParameterQueryOptions) schema.SystemParameterQueryOptions {
	var opt schema.SystemParameterQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *SystemParameter) Query(ctx context.Context, params schema.SystemParameterQueryParam, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameterQueryResult, error) {
	db := entity.GetSystemParameterDB(ctx, a.db).DB
	if v := params.LikeCode; v != "" {
		db = db.Where("code LIKE ?", "%"+v+"%")
	}
	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.Code; v != "" {
		db = db.Where("code=?", v)
	}
	if v := params.Status; v > 0 {
		db = db.Where("status=?", v)
	}
	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.SystemParameters
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.SystemParameterQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaSystemParameters(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *SystemParameter) Get(ctx context.Context, recordID string, opts ...schema.SystemParameterQueryOptions) (*schema.SystemParameter, error) {
	db := entity.GetSystemParameterDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.SystemParameter
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaSystemParameter(), nil
}

// Create 创建数据
func (a *SystemParameter) Create(ctx context.Context, item schema.SystemParameter) error {
	SystemParameter := entity.SchemaSystemParameter(item).ToSystemParameter()
	result := entity.GetSystemParameterDB(ctx, a.db).Create(SystemParameter)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *SystemParameter) Update(ctx context.Context, recordID string, item schema.SystemParameter) error {
	SystemParameter := entity.SchemaSystemParameter(item).ToSystemParameter()
	result := entity.GetSystemParameterDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(SystemParameter)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *SystemParameter) Delete(ctx context.Context, recordID string) error {
	result := entity.GetSystemParameterDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.SystemParameter{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateStatus 更新状态
func (a *SystemParameter) UpdateStatus(ctx context.Context, recordID string, status int) error {
	result := entity.GetSystemParameterDB(ctx, a.db).Where("record_id=?", recordID).Update("status", status)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
