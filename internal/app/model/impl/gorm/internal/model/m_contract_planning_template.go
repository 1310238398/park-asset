package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewContractPlanningTemplate 创建合约规划模板存储实例
func NewContractPlanningTemplate(db *gorm.DB) *ContractPlanningTemplate {
	return &ContractPlanningTemplate{db}
}

// ContractPlanningTemplate 合约规划模板存储
type ContractPlanningTemplate struct {
	db *gorm.DB
}

func (a *ContractPlanningTemplate) getQueryOption(opts ...schema.ContractPlanningTemplateQueryOptions) schema.ContractPlanningTemplateQueryOptions {
	var opt schema.ContractPlanningTemplateQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ContractPlanningTemplate) Query(ctx context.Context, params schema.ContractPlanningTemplateQueryParam, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplateQueryResult, error) {
	db := entity.GetContractPlanningTemplateDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.CostID; v != "" {
		subQuery := entity.GetCostItemDB(ctx, a.db).Select("record_id").Where("parent_path LIKE ?", "%"+v+"%").Or("record_id = ?", v).SubQuery()
		db = db.Where("cost_id IN(?)", subQuery)
	}

	if v := params.CostIDs; len(v) > 0 {
		db = db.Where("cost_id IN(?)", v)
	}
	if v := params.ContractType; v != 0 {
		db = db.Where("contract_type = ?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ContractPlanningTemplates
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ContractPlanningTemplateQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaContractPlanningTemplates(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ContractPlanningTemplate) Get(ctx context.Context, recordID string, opts ...schema.ContractPlanningTemplateQueryOptions) (*schema.ContractPlanningTemplate, error) {
	db := entity.GetContractPlanningTemplateDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ContractPlanningTemplate
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaContractPlanningTemplate(), nil
}

// Create 创建数据
func (a *ContractPlanningTemplate) Create(ctx context.Context, item schema.ContractPlanningTemplate) error {
	ContractPlanningTemplate := entity.SchemaContractPlanningTemplate(item).ToContractPlanningTemplate()
	result := entity.GetContractPlanningTemplateDB(ctx, a.db).Create(ContractPlanningTemplate)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ContractPlanningTemplate) Update(ctx context.Context, recordID string, item schema.ContractPlanningTemplate) error {
	ContractPlanningTemplate := entity.SchemaContractPlanningTemplate(item).ToContractPlanningTemplate()
	result := entity.GetContractPlanningTemplateDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ContractPlanningTemplate)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ContractPlanningTemplate) Delete(ctx context.Context, recordID string) error {
	result := entity.GetContractPlanningTemplateDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ContractPlanningTemplate{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
