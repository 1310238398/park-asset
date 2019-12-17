package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewComContractAttachment 创建合同-附件
func NewComContractAttachment(mComContractAttachment model.IComContractAttachment) *ComContractAttachment {
	return &ComContractAttachment{
		ComContractAttachmentModel: mComContractAttachment,
	}
}

// ComContractAttachment 合同-附件业务逻辑
type ComContractAttachment struct {
	ComContractAttachmentModel model.IComContractAttachment
}

// Query 查询数据
func (a *ComContractAttachment) Query(ctx context.Context, params schema.ComContractAttachmentQueryParam, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachmentQueryResult, error) {
	return a.ComContractAttachmentModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ComContractAttachment) Get(ctx context.Context, recordID string, opts ...schema.ComContractAttachmentQueryOptions) (*schema.ComContractAttachment, error) {
	item, err := a.ComContractAttachmentModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ComContractAttachment) getUpdate(ctx context.Context, recordID string) (*schema.ComContractAttachment, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ComContractAttachment) Create(ctx context.Context, item schema.ComContractAttachment) (*schema.ComContractAttachment, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAttachmentModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ComContractAttachment) Update(ctx context.Context, recordID string, item schema.ComContractAttachment) (*schema.ComContractAttachment, error) {
	oldItem, err := a.ComContractAttachmentModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAttachmentModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ComContractAttachment) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAttachmentModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAttachmentModel.Delete(ctx, recordID)
}
