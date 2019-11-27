package model

import (
	"context"
	"fmt"
	"strings"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
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

//QueryShow 查询展示数据
func (a *ProjCostItem) QueryShow(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (schema.ProjCostItemShows, error) {
	db := entity.GetDB(ctx, a.db)
	cit := "pc_cost_item"
	pcit := "pc_proj_cost_item"
	db = db.Table(cit).Joins(fmt.Sprintf("LEFT JOIN %s ON %s.record_id=%s.cost_id AND %s.deleted_at IS NULL AND %s.project_id=?",
		pcit, cit, pcit, pcit, pcit), params.ProjectID)
	// select列表
	selectlist := []string{
		fmt.Sprintf("%s.record_id AS record_id", pcit),
		fmt.Sprintf("%s.project_id AS project_id", pcit),
		fmt.Sprintf("%s.record_id AS cost_id", cit),
		fmt.Sprintf("%s.parent_id AS cost_parent_id", cit),
		fmt.Sprintf("%s.parent_path AS cost_parent_path", cit),
		fmt.Sprintf("%s.name AS name", cit),
		fmt.Sprintf("%s.tax_id AS tax_id", cit),
		fmt.Sprintf("%s.label AS label", cit),
		fmt.Sprintf("%s.calculate_type AS calculate_type", cit),
		fmt.Sprintf("%s.tax_rate AS tax_rate", pcit),
		fmt.Sprintf("%s.tax_price AS tax_price", pcit),
		fmt.Sprintf("%s.price AS price", pcit),
		fmt.Sprintf("%s.memo AS memo", pcit),
		fmt.Sprintf("%s.principal AS principal", pcit),
		fmt.Sprintf("%s.proj_income_id AS proj_income_id", pcit),
	}
	db = db.Select(strings.Join(selectlist, ","))
	db = db.Where(fmt.Sprintf("%s.deleted_at IS NULL", cit))
	//仅查询土增相关成本项
	if params.InLandTax == 1 {
		db = db.Where(fmt.Sprintf("%s.in_land_tax = ?", cit), 1)
	}
	var list entity.ProjCostItemShows
	if re := db.Find(&list); re.Error != nil {
		return nil, re.Error
	}

	return list.ToSchemaProjCostItemShows(), nil
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
