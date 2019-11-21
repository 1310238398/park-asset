package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewCostItem 创建成本项存储实例
func NewCostItem(db *gorm.DB) *CostItem {
	return &CostItem{db}
}

// CostItem 成本项存储
type CostItem struct {
	db *gorm.DB
}

func (a *CostItem) getQueryOption(opts ...schema.CostItemQueryOptions) schema.CostItemQueryOptions {
	var opt schema.CostItemQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *CostItem) Query(ctx context.Context, params schema.CostItemQueryParam, opts ...schema.CostItemQueryOptions) (*schema.CostItemQueryResult, error) {
	db := entity.GetCostItemDB(ctx, a.db)

	if v := params.Name; v != "" {
		db = db.Where("name=?", v)
	}

	if v := params.ParentID; v != "" {
		db = db.Where("parent_id=?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.CostItems
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.CostItemQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaCostItems(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *CostItem) Get(ctx context.Context, recordID string, opts ...schema.CostItemQueryOptions) (*schema.CostItem, error) {
	db := entity.GetCostItemDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.CostItem
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaCostItem(), nil
}

// Create 创建数据
func (a *CostItem) Create(ctx context.Context, item schema.CostItem) error {
	CostItem := entity.SchemaCostItem(item).ToCostItem()
	result := entity.GetCostItemDB(ctx, a.db).Create(CostItem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *CostItem) Update(ctx context.Context, recordID string, item schema.CostItem) error {
	CostItem := entity.SchemaCostItem(item).ToCostItem()
	result := entity.GetCostItemDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(CostItem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *CostItem) Delete(ctx context.Context, recordID string) error {
	result := entity.GetCostItemDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.CostItem{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
