package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewCarChanger 创建车改商管理存储实例
func NewCarChanger(db *gormplus.DB) *CarChanger {
	return &CarChanger{db}
}

// CarChanger 车改商管理存储
type CarChanger struct {
	db *gormplus.DB
}

func (a *CarChanger) getQueryOption(opts ...schema.CarChangerQueryOptions) schema.CarChangerQueryOptions {
	var opt schema.CarChangerQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *CarChanger) Query(ctx context.Context, params schema.CarChangerQueryParam, opts ...schema.CarChangerQueryOptions) (*schema.CarChangerQueryResult, error) {
	db := entity.GetCarChangerDB(ctx, a.db).DB
	if v := params.ProjectID; v != "" {
		db = db.Where("project_id=?", v)
	}
	if v := params.Name; v != "" {
		db = db.Where("name=?", v)
	}
	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.RentStatus; v != 0 {
		db = db.Where("rent_status=?", v)
	}
	db = db.Order("name, id DESC")
	opt := a.getQueryOption(opts...)

	var list entity.CarChangers
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.CarChangerQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaCarChangers(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *CarChanger) Get(ctx context.Context, recordID string, opts ...schema.CarChangerQueryOptions) (*schema.CarChanger, error) {
	db := entity.GetCarChangerDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.CarChanger
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaCarChanger(), nil
}

// Create 创建数据
func (a *CarChanger) Create(ctx context.Context, item schema.CarChanger) error {
	CarChanger := entity.SchemaCarChanger(item).ToCarChanger()
	result := entity.GetCarChangerDB(ctx, a.db).Create(CarChanger)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *CarChanger) Update(ctx context.Context, recordID string, item schema.CarChanger) error {
	CarChanger := entity.SchemaCarChanger(item).ToCarChanger()
	result := entity.GetCarChangerDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(CarChanger)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *CarChanger) Delete(ctx context.Context, recordID string) error {
	result := entity.GetCarChangerDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.CarChanger{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
