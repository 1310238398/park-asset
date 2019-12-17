package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjContractPlanning 创建项目合约规划存储实例
func NewProjContractPlanning(db *gorm.DB) *ProjContractPlanning {
	return &ProjContractPlanning{db}
}

// ProjContractPlanning 项目合约规划存储
type ProjContractPlanning struct {
	db *gorm.DB
}

func (a *ProjContractPlanning) getQueryOption(opts ...schema.ProjContractPlanningQueryOptions) schema.ProjContractPlanningQueryOptions {
	var opt schema.ProjContractPlanningQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjContractPlanning) Query(ctx context.Context, params schema.ProjContractPlanningQueryParam, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanningQueryResult, error) {
	db := entity.GetProjContractPlanningDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.CostID; v != "" {
		// subQuery1 := entity.GetCostItemDB(ctx, a.db).Select.("parent_path").Where("record_id = ?")

		subQuery := entity.GetCostItemDB(ctx, a.db).Select("record_id").Where("parent_path LIKE ? or record_id = ?", v+"%", v).SubQuery()

		// subQuery2 := entity.GetCostItemDB(ctx, a.db).Select("record_id").Where("parent_path LIKE ? or record_id = ?", v+"%", v).SubQuery()

		db = db.Where("cost_id IN(?)", subQuery)
	}
	if v := params.ContractType; v != 0 {
		db = db.Where("contract_type = ?", v)
	}
	if v := params.ProjectID; v != "" {
		db = db.Where("project_id = ?", v)
	}
	if v := params.CostIDs; len(v) > 0 {
		db = db.Where("cost_id IN(?)", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjContractPlannings
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjContractPlanningQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjContractPlannings(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjContractPlanning) Get(ctx context.Context, recordID string, opts ...schema.ProjContractPlanningQueryOptions) (*schema.ProjContractPlanning, error) {
	db := entity.GetProjContractPlanningDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjContractPlanning
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjContractPlanning(), nil
}

// Create 创建数据
func (a *ProjContractPlanning) Create(ctx context.Context, item schema.ProjContractPlanning) error {
	ProjContractPlanning := entity.SchemaProjContractPlanning(item).ToProjContractPlanning()
	result := entity.GetProjContractPlanningDB(ctx, a.db).Create(ProjContractPlanning)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjContractPlanning) Update(ctx context.Context, recordID string, item schema.ProjContractPlanning) error {
	ProjContractPlanning := entity.SchemaProjContractPlanning(item).ToProjContractPlanning()
	result := entity.GetProjContractPlanningDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjContractPlanning)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjContractPlanning) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjContractPlanningDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjContractPlanning{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// // QueryStatistic 查询规划
// func (a *ProjContractPlanning) QueryStatistic(ctx context.Context, params schema.ProjContractPlanningQueryParam) error {
// 	db := entity.GetProjContractPlanningDB(ctx, a.db)

// 	if v := params.CostID; v != "" {
// 		subQuery := entity.GetCostItemDB(ctx, a.db).Select("record_id").Where("parent_path LIKE ?", v+"%").Or("record_id = ?", v).SubQuery()
// 		db = db.Where("cost_id IN(?)", subQuery)
// 	}

// 	priceQuery := "SUM(PlanningPrice)''"
// 	priceQuery = ""

// }
