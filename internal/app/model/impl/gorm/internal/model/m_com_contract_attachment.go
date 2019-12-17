package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewComContractAttachment 创建合同-附件存储实例
func NewComContractAttachment(db *gorm.DB) *ComContractAttachment {
	return &ComContractAttachment{db}
}

// ComContractAttachment 合同-附件存储
type ComContractAttachment struct {
	db *gorm.DB
}

func (a *ComContractAttachment) getQueryOption(opts ...schema.ComContractAttachmentQueryOptions) schema.ComContractAttachmentQueryOptions {
	var opt schema.ComContractAttachmentQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ComContractAttachment) Query(ctx context.Context, params schema.ComContractAttachmentQueryParam, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachmentQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractAttachmentDB(ctx, a.db)
	// TODO: 查询条件
	db = db.Order("id DESC")

	var list entity.ComContractAttachments
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractAttachmentQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContractAttachments(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ComContractAttachment) Get(ctx context.Context, recordID string, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachment, error) {
	db := entity.GetComContractAttachmentDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContractAttachment
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaComContractAttachment(), nil
}

// Create 创建数据
func (a *ComContractAttachment) Create(ctx context.Context, item schema.ComContractAttachment) error {
	eitem := entity.SchemaComContractAttachment(item).ToComContractAttachment()
	result := entity.GetComContractAttachmentDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ComContractAttachment) Update(ctx context.Context, recordID string, item schema.ComContractAttachment) error {
	eitem := entity.SchemaComContractAttachment(item).ToComContractAttachment()
	result := entity.GetComContractAttachmentDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ComContractAttachment) Delete(ctx context.Context, recordID string) error {
	result := entity.GetComContractAttachmentDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContractAttachment{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// DeleteByBizID 删除数据
func (a *ComContractAttachment) DeleteByBizID(ctx context.Context, recordID string) error {
	result := entity.GetComContractAttachmentDB(ctx, a.db).Where("biz_id=?", recordID).Delete(entity.ComContractAttachment{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// QueryByBizID 通过bizid查询附件数据
func (a *ComContractAttachment) QueryByBizID(ctx context.Context, recordID string) ([]*schema.ComContractAttachment, error) {
	var attasM entity.ComContractAttachments
	result := entity.GetComContractAttachmentDB(ctx, a.db).Where("biz_id=?", recordID).Find(&attasM)
	if err := result.Error; err != nil {
		return nil, errors.WithStack(err)
	}
	attasS := attasM.ToSchemaComContractAttachments()
	return attasS, nil
}
