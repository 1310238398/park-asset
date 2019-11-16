package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewProjCostItem 创建项目成本项存储实例
func NewProjCostItem(db *gorm.DB) *ProjCostItem {
	return &ProjCostItem{db}
}

// ProjCostItem 项目成本项存储
type ProjCostItem struct {
	db *gorm.DB
}

func (a *ProjCostItem) getQueryOption(opts ...schema.ProjCostItemQueryOptions) schema.ProjCostItemQueryOptions {
	var opt schema.ProjCostItemQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjCostItem) Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error) {
	db := entity.GetProjCostItemDB(ctx, a.db)

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjCostItems
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjCostItemQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjCostItems(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjCostItem) Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error) {
	db := entity.GetProjCostItemDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjCostItem
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjCostItem(), nil
}

// Create 创建数据
func (a *ProjCostItem) Create(ctx context.Context, item schema.ProjCostItem) error {
	ProjCostItem := entity.SchemaProjCostItem(item).ToProjCostItem()
	result := entity.GetProjCostItemDB(ctx, a.db).Create(ProjCostItem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjCostItem) Update(ctx context.Context, recordID string, item schema.ProjCostItem) error {
	ProjCostItem := entity.SchemaProjCostItem(item).ToProjCostItem()
	result := entity.GetProjCostItemDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjCostItem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjCostItem) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjCostItemDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjCostItem{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
