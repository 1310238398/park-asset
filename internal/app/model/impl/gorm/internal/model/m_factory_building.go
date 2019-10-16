package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewFactoryBuilding 创建厂房管理存储实例
func NewFactoryBuilding(db *gormplus.DB) *FactoryBuilding {
	return &FactoryBuilding{db}
}

// FactoryBuilding 厂房管理存储
type FactoryBuilding struct {
	db *gormplus.DB
}

func (a *FactoryBuilding) getQueryOption(opts ...schema.FactoryBuildingQueryOptions) schema.FactoryBuildingQueryOptions {
	var opt schema.FactoryBuildingQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *FactoryBuilding) Query(ctx context.Context, params schema.FactoryBuildingQueryParam, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuildingQueryResult, error) {
	db := entity.GetFactoryBuildingDB(ctx, a.db).DB
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
	var list entity.FactoryBuildings
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.FactoryBuildingQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaFactoryBuildings(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *FactoryBuilding) Get(ctx context.Context, recordID string, opts ...schema.FactoryBuildingQueryOptions) (*schema.FactoryBuilding, error) {
	db := entity.GetFactoryBuildingDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.FactoryBuilding
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaFactoryBuilding(), nil
}

// Create 创建数据
func (a *FactoryBuilding) Create(ctx context.Context, item schema.FactoryBuilding) error {
	FactoryBuilding := entity.SchemaFactoryBuilding(item).ToFactoryBuilding()
	result := entity.GetFactoryBuildingDB(ctx, a.db).Create(FactoryBuilding)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *FactoryBuilding) Update(ctx context.Context, recordID string, item schema.FactoryBuilding) error {
	FactoryBuilding := entity.SchemaFactoryBuilding(item).ToFactoryBuilding()
	result := entity.GetFactoryBuildingDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(FactoryBuilding)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *FactoryBuilding) Delete(ctx context.Context, recordID string) error {
	result := entity.GetFactoryBuildingDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.FactoryBuilding{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
