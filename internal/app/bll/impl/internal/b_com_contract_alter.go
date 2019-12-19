package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewComContractAlter 创建变更管理
func NewComContractAlter(mComContractAlter model.IComContractAlter) *ComContractAlter {
	return &ComContractAlter{
		ComContractAlterModel: mComContractAlter,
	}
}

// ComContractAlter 变更管理业务逻辑
type ComContractAlter struct {
	ComContractAlterModel model.IComContractAlter
}

// Query 查询数据
func (a *ComContractAlter) Query(ctx context.Context, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterQueryResult, error) {
	return a.ComContractAlterModel.Query(ctx, params, opts...)
}

// QueryDesignByComContractID 查询数据
func (a *ComContractAlter) QueryDesignByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesignQueryResult, error) {
	return a.ComContractAlterModel.QueryDesignByComContractID(ctx, ComContractID, params, opts...)
}

// QuerySignByComContractID 查询数据
func (a *ComContractAlter) QuerySignByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSignQueryResult, error) {
	return a.ComContractAlterModel.QuerySignByComContractID(ctx, ComContractID, params, opts...)
}

// QueryStuffPriceByComContractID 查询数据
func (a *ComContractAlter) QueryStuffPriceByComContractID(ctx context.Context, ComContractID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceQueryResult, error) {
	return a.ComContractAlterModel.QueryStuffPriceByComContractID(ctx, ComContractID, params, opts...)
}

// QueryStuffPriceItemByComContractID 查询数据
func (a *ComContractAlter) QueryStuffPriceItemByStuffPriceID(ctx context.Context, stuffPriceID string, params schema.ComContractAlterQueryParam, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItemQueryResult, error) {
	return a.ComContractAlterModel.QueryStuffPriceItemByStuffPriceID(ctx, stuffPriceID, params, opts...)
}

// Get 查询指定数据
func (a *ComContractAlter) Get(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlter, error) {
	item, err := a.ComContractAlterModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

// GetDesign 查询指定数据
func (a *ComContractAlter) GetDesign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterDesign, error) {
	item, err := a.ComContractAlterModel.GetDesign(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

// GetSign 查询指定数据
func (a *ComContractAlter) GetSign(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterSign, error) {
	item, err := a.ComContractAlterModel.GetSign(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}
	return item, nil
}

// GetStuffPrice 查询指定数据
func (a *ComContractAlter) GetStuffPrice(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPrice, error) {
	item, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

// GetStuffPriceItem 查询指定数据
func (a *ComContractAlter) GetStuffPriceItem(ctx context.Context, recordID string, opts ...schema.ComContractAlterQueryOptions) (*schema.ComContractAlterStuffPriceItem, error) {
	item, err := a.ComContractAlterModel.GetStuffPriceItem(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ComContractAlter) getUpdate(ctx context.Context, recordID string) (*schema.ComContractAlter, error) {
	return a.Get(ctx, recordID)
}

func (a *ComContractAlter) getUpdateDesign(ctx context.Context, recordID string) (*schema.ComContractAlterDesign, error) {
	return a.GetDesign(ctx, recordID)
}

func (a *ComContractAlter) getUpdateSign(ctx context.Context, recordID string) (*schema.ComContractAlterSign, error) {
	return a.GetSign(ctx, recordID)
}

func (a *ComContractAlter) getUpdateStuffPrice(ctx context.Context, recordID string) (*schema.ComContractAlterStuffPrice, error) {
	return a.GetStuffPrice(ctx, recordID)
}
func (a *ComContractAlter) getUpdateStuffPriceItem(ctx context.Context, recordID string) (*schema.ComContractAlterStuffPriceItem, error) {
	return a.GetStuffPriceItem(ctx, recordID)
}

/*           新建部分             */

// Create 创建数据
func (a *ComContractAlter) Create(ctx context.Context, item schema.ComContractAlter) (*schema.ComContractAlter, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// CreateDesign 创建设计变更数据
func (a *ComContractAlter) CreateDesign(ctx context.Context, item schema.ComContractAlterDesign) (*schema.ComContractAlterDesign, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.CreateDesign(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateDesign(ctx, item.RecordID)
}

// CreateSign 创建设计变更数据
func (a *ComContractAlter) CreateSign(ctx context.Context, item schema.ComContractAlterSign) (*schema.ComContractAlterSign, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.CreateSign(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateSign(ctx, item.RecordID)
}

// CreateStuffPrice 创建设计变更数据
func (a *ComContractAlter) CreateStuffPrice(ctx context.Context, item schema.ComContractAlterStuffPrice) (*schema.ComContractAlterStuffPrice, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.CreateStuffPrice(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateStuffPrice(ctx, item.RecordID)
}

// CreateStuffPriceItem 创建设计变更数据
func (a *ComContractAlter) CreateStuffPriceItem(ctx context.Context, item schema.ComContractAlterStuffPriceItem) (*schema.ComContractAlterStuffPriceItem, error) {
	item.RecordID = util.MustUUID()
	err := a.ComContractAlterModel.CreateStuffPriceItem(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateStuffPriceItem(ctx, item.RecordID)
}

/*           更新部分             */

// Update 更新数据
func (a *ComContractAlter) Update(ctx context.Context, recordID string, item schema.ComContractAlter) (*schema.ComContractAlter, error) {
	oldItem, err := a.ComContractAlterModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// UpdateDesign 更新数据
func (a *ComContractAlter) UpdateDesign(ctx context.Context, recordID string, item schema.ComContractAlterDesign) (*schema.ComContractAlterDesign, error) {
	oldItem, err := a.ComContractAlterModel.GetDesign(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.UpdateDesign(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateDesign(ctx, recordID)
}

// UpdateSign 更新数据
func (a *ComContractAlter) UpdateSign(ctx context.Context, recordID string, item schema.ComContractAlterSign) (*schema.ComContractAlterSign, error) {
	oldItem, err := a.ComContractAlterModel.GetSign(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.UpdateSign(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateSign(ctx, recordID)
}

// UpdateStuffPrice 更新数据
func (a *ComContractAlter) UpdateStuffPrice(ctx context.Context, recordID string, item schema.ComContractAlterStuffPrice) (*schema.ComContractAlterStuffPrice, error) {
	oldItem, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.UpdateStuffPrice(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateStuffPrice(ctx, recordID)
}

// UpdateStuffPriceItem 更新数据
func (a *ComContractAlter) UpdateStuffPriceItem(ctx context.Context, recordID string, item schema.ComContractAlterStuffPriceItem) (*schema.ComContractAlterStuffPriceItem, error) {
	oldItem, err := a.ComContractAlterModel.GetStuffPriceItem(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractAlterModel.UpdateStuffPriceItem(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdateStuffPriceItem(ctx, recordID)
}

/*           删除部分             */

// Delete 删除数据
func (a *ComContractAlter) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.Delete(ctx, recordID)
}

// DeleteDesign 删除数据
func (a *ComContractAlter) DeleteDesign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetDesign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.DeleteDesign(ctx, recordID)
}

// DeleteSign 删除数据
func (a *ComContractAlter) DeleteSign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetSign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.DeleteSign(ctx, recordID)
}

// DeleteStuffPrice 删除数据
func (a *ComContractAlter) DeleteStuffPrice(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.DeleteStuffPrice(ctx, recordID)
}

// DeleteStuffPriceItem 删除数据
func (a *ComContractAlter) DeleteStuffPriceItem(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetStuffPriceItem(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractAlterModel.DeleteStuffPriceItem(ctx, recordID)
}

// CommitDesign 提交审核
func (a *ComContractAlter) CommitDesign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetDesign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetDesignStatus(ctx, recordID, 1)
	if err != nil {
		return err
	}
	return nil
}

// CommitSign 提交审核
func (a *ComContractAlter) CommitSign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetSign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetSignStatus(ctx, recordID, 1)
	if err != nil {
		return err
	}
	return nil
}

// CommitStuffPrice 提交审核
func (a *ComContractAlter) CommitStuffPrice(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetStuffPriceStatus(ctx, recordID, 1)
	if err != nil {
		return err
	}
	return nil
}

// PassCheckDesign 提交审核
func (a *ComContractAlter) PassCheckDesign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetDesign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetDesignStatus(ctx, recordID, 2)
	if err != nil {
		return err
	}
	return nil
}

// PassCheckSign 提交审核
func (a *ComContractAlter) PassCheckSign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetSign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetSignStatus(ctx, recordID, 2)
	if err != nil {
		return err
	}
	return nil
}

// PassCheckStuffPrice 提交审核
func (a *ComContractAlter) PassCheckStuffPrice(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetStuffPriceStatus(ctx, recordID, 2)
	if err != nil {
		return err
	}
	return nil
}

// RebackDesign 提交审核
func (a *ComContractAlter) RebackDesign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetDesign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetDesignStatus(ctx, recordID, 0)
	if err != nil {
		return err
	}
	return nil
}

// RebackSign 提交审核
func (a *ComContractAlter) RebackSign(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetSign(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetSignStatus(ctx, recordID, 0)
	if err != nil {
		return err
	}
	return nil
}

// RebackStuffPrice 提交审核
func (a *ComContractAlter) RebackStuffPrice(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractAlterModel.GetStuffPrice(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	err = a.ComContractAlterModel.SetStuffPriceStatus(ctx, recordID, 0)
	if err != nil {
		return err
	}
	return nil
}
