package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjExpenditure 创建项目支出节点存储实例
func NewProjExpenditure(db *gorm.DB) *ProjExpenditure {
	return &ProjExpenditure{db}
}

// ProjExpenditure 项目支出节点存储
type ProjExpenditure struct {
	db *gorm.DB
}

func (a *ProjExpenditure) getQueryOption(opts ...schema.ProjExpenditureQueryOptions) schema.ProjExpenditureQueryOptions {
	var opt schema.ProjExpenditureQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjExpenditure) Query(ctx context.Context, params schema.ProjExpenditureQueryParam, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditureQueryResult, error) {
	db := entity.GetProjExpenditureDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name like ?", "%"+v+"%")
	}

	if v := params.BeforeStartTime; !v.IsZero() {
		db = db.Where("start_time  < ?", v)
	}

	if v := params.ExpenditureTimeType; v != 0 {
		db = db.Where("expenditure_time_type = ?", v)
	}

	if v := params.ParentPath; v != "" {
		db = db.Where("parent_path = ?", v)
	}

	if v := params.ProjectID; v != "" {
		db = db.Where("project_id = ?", v)
	}

	if v := params.ParentID; v != "" {
		db = db.Where("parent_id = ?", v)

	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjExpenditures
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjExpenditureQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjExpenditures(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjExpenditure) Get(ctx context.Context, recordID string, opts ...schema.ProjExpenditureQueryOptions) (*schema.ProjExpenditure, error) {
	db := entity.GetProjExpenditureDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjExpenditure
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjExpenditure(), nil
}

// Create 创建数据
func (a *ProjExpenditure) Create(ctx context.Context, item schema.ProjExpenditure) error {
	ProjExpenditure := entity.SchemaProjExpenditure(item).ToProjExpenditure()
	result := entity.GetProjExpenditureDB(ctx, a.db).Create(ProjExpenditure)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjExpenditure) Update(ctx context.Context, recordID string, item schema.ProjExpenditure) error {
	ProjExpenditure := entity.SchemaProjExpenditure(item).ToProjExpenditure()
	result := entity.GetProjExpenditureDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjExpenditure)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjExpenditure) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjExpenditureDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjExpenditure{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
