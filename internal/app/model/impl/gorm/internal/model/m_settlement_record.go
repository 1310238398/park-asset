package model

import (
	"context"

	"github.com/jinzhu/gorm"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
)

// NewSettlementRecord 创建结算信息存储实例
func NewSettlementRecord(db *gorm.DB) *SettlementRecord {
	return &SettlementRecord{db}
}

// SettlementRecord 结算信息存储
type SettlementRecord struct {
	db *gorm.DB
}

func (a *SettlementRecord) getQueryOption(opts ...schema.SettlementRecordQueryOptions) schema.SettlementRecordQueryOptions {
	var opt schema.SettlementRecordQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *SettlementRecord) Query(ctx context.Context, params schema.SettlementRecordQueryParam, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecordQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetSettlementRecordDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Order("id DESC")

	var list entity.SettlementRecords
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.SettlementRecordQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaSettlementRecords(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *SettlementRecord) Get(ctx context.Context, recordID string, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecord, error) {
	db := entity.GetSettlementRecordDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.SettlementRecord
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaSettlementRecord(), nil
}

// Create 创建数据
func (a *SettlementRecord) Create(ctx context.Context, item schema.SettlementRecord) error {
	eitem := entity.SchemaSettlementRecord(item).ToSettlementRecord()
	result := entity.GetSettlementRecordDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *SettlementRecord) Update(ctx context.Context, recordID string, item schema.SettlementRecord) error {
	eitem := entity.SchemaSettlementRecord(item).ToSettlementRecord()
	result := entity.GetSettlementRecordDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *SettlementRecord) Delete(ctx context.Context, recordID string) error {
	result := entity.GetSettlementRecordDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.SettlementRecord{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
