package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewOfficeBuilding 创建写字楼管理存储实例
func NewOfficeBuilding(db *gormplus.DB) *OfficeBuilding {
	return &OfficeBuilding{db}
}

// OfficeBuilding 写字楼管理存储
type OfficeBuilding struct {
	db *gormplus.DB
}

func (a *OfficeBuilding) getQueryOption(opts ...schema.OfficeBuildingQueryOptions) schema.OfficeBuildingQueryOptions {
	var opt schema.OfficeBuildingQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *OfficeBuilding) Query(ctx context.Context, params schema.OfficeBuildingQueryParam, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuildingQueryResult, error) {
	db := entity.GetOfficeBuildingDB(ctx, a.db).DB

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.BuildingType; v != 0 {
		db = db.Where("building_type=?", v)
	}
	if v := params.IsAllRent; v != 0 {
		db = db.Where("is_all_rent=?", v)
	}
	if v := params.RentStatus; v != 0 {
		db = db.Where("rent_status=?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.OfficeBuildings
	pr, err := WrapPageQuery(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.OfficeBuildingQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaOfficeBuildings(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *OfficeBuilding) Get(ctx context.Context, recordID string, opts ...schema.OfficeBuildingQueryOptions) (*schema.OfficeBuilding, error) {
	db := entity.GetOfficeBuildingDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.OfficeBuilding
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaOfficeBuilding(), nil
}

// Create 创建数据
func (a *OfficeBuilding) Create(ctx context.Context, item schema.OfficeBuilding) error {
	OfficeBuilding := entity.SchemaOfficeBuilding(item).ToOfficeBuilding()
	result := entity.GetOfficeBuildingDB(ctx, a.db).Create(OfficeBuilding)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *OfficeBuilding) Update(ctx context.Context, recordID string, item schema.OfficeBuilding) error {
	OfficeBuilding := entity.SchemaOfficeBuilding(item).ToOfficeBuilding()
	result := entity.GetOfficeBuildingDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(OfficeBuilding)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *OfficeBuilding) Delete(ctx context.Context, recordID string) error {
	result := entity.GetOfficeBuildingDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.OfficeBuilding{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
