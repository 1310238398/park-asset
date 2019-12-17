package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewSettlementRecord 创建结算信息
func NewSettlementRecord(mSettlementRecord model.ISettlementRecord, mComContract model.IComContract) *SettlementRecord {
	return &SettlementRecord{
		SettlementRecordModel: mSettlementRecord,
		ComContractModel:      mComContract,
	}
}

// SettlementRecord 结算信息业务逻辑
type SettlementRecord struct {
	SettlementRecordModel model.ISettlementRecord
	ComContractModel      model.IComContract
}

// Query 查询数据
func (a *SettlementRecord) Query(ctx context.Context, params schema.SettlementRecordQueryParam, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecordQueryResult, error) {
	return a.SettlementRecordModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *SettlementRecord) Get(ctx context.Context, recordID string, opts ...schema.SettlementRecordQueryOptions) (*schema.SettlementRecord, error) {
	item, err := a.SettlementRecordModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *SettlementRecord) getUpdate(ctx context.Context, recordID string) (*schema.SettlementRecord, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *SettlementRecord) Create(ctx context.Context, item schema.SettlementRecord) (*schema.SettlementRecord, error) {
	item.RecordID = util.MustUUID()
	// 检查是否存在合同信息
	contractInfo, err := a.ComContractModel.Get(ctx, item.ComContractID)
	if err != nil {
		return nil, err
	}
	if contractInfo == nil {
		return nil, errors.ErrNoComContract
	}
	// 检查合同是否结算完 是否选择结算
	if contractInfo.Settlement != 1 {
		return nil, errors.ErrNoSettlement
	}
	err = a.SettlementRecordModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *SettlementRecord) Update(ctx context.Context, recordID string, item schema.SettlementRecord) (*schema.SettlementRecord, error) {
	oldItem, err := a.SettlementRecordModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.SettlementRecordModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *SettlementRecord) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.SettlementRecordModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.SettlementRecordModel.Delete(ctx, recordID)
}
