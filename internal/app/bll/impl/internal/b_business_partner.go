package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewBusinessPartner 创建业务往来企业
func NewBusinessPartner(mBusinessPartner model.IBusinessPartner) *BusinessPartner {
	return &BusinessPartner{
		BusinessPartnerModel: mBusinessPartner,
	}
}

// BusinessPartner 业务往来企业业务逻辑
type BusinessPartner struct {
	BusinessPartnerModel model.IBusinessPartner
}

// Query 查询数据
func (a *BusinessPartner) Query(ctx context.Context, params schema.BusinessPartnerQueryParam, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartnerQueryResult, error) {
	return a.BusinessPartnerModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *BusinessPartner) Get(ctx context.Context, recordID string, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartner, error) {
	item, err := a.BusinessPartnerModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *BusinessPartner) getUpdate(ctx context.Context, recordID string) (*schema.BusinessPartner, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *BusinessPartner) Create(ctx context.Context, item schema.BusinessPartner) (*schema.BusinessPartner, error) {
	item.RecordID = util.MustUUID()
	err := a.BusinessPartnerModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *BusinessPartner) Update(ctx context.Context, recordID string, item schema.BusinessPartner) (*schema.BusinessPartner, error) {
	oldItem, err := a.BusinessPartnerModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.BusinessPartnerModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *BusinessPartner) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.BusinessPartnerModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.BusinessPartnerModel.Delete(ctx, recordID)
}
