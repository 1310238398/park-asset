package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewBusinessPartner 创建业务往来企业存储实例
func NewBusinessPartner(db *gorm.DB) *BusinessPartner {
	return &BusinessPartner{db}
}

// BusinessPartner 业务往来企业存储
type BusinessPartner struct {
	db *gorm.DB
}

func (a *BusinessPartner) getQueryOption(opts ...schema.BusinessPartnerQueryOptions) schema.BusinessPartnerQueryOptions {
	var opt schema.BusinessPartnerQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *BusinessPartner) Query(ctx context.Context, params schema.BusinessPartnerQueryParam, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartnerQueryResult, error) {
	db := entity.GetBusinessPartnerDB(ctx, a.db)

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.PartnerType; v != 0 {
		db = db.Where("partner_type = ?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.BusinessPartners
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.BusinessPartnerQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaBusinessPartners(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *BusinessPartner) Get(ctx context.Context, recordID string, opts ...schema.BusinessPartnerQueryOptions) (*schema.BusinessPartner, error) {
	db := entity.GetBusinessPartnerDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.BusinessPartner
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaBusinessPartner(), nil
}

// Create 创建数据
func (a *BusinessPartner) Create(ctx context.Context, item schema.BusinessPartner) error {
	BusinessPartner := entity.SchemaBusinessPartner(item).ToBusinessPartner()
	result := entity.GetBusinessPartnerDB(ctx, a.db).Create(BusinessPartner)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *BusinessPartner) Update(ctx context.Context, recordID string, item schema.BusinessPartner) error {
	BusinessPartner := entity.SchemaBusinessPartner(item).ToBusinessPartner()
	result := entity.GetBusinessPartnerDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(BusinessPartner)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *BusinessPartner) Delete(ctx context.Context, recordID string) error {
	result := entity.GetBusinessPartnerDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.BusinessPartner{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
