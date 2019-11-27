package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewCostItem 创建成本项
func NewCostItem(mTran model.ITrans, mCostItem model.ICostItem, mCostBusiness model.ICostBusiness) *CostItem {
	return &CostItem{
		TransModel:        mTran,
		CostItemModel:     mCostItem,
		CostBusinessModel: mCostBusiness,
	}
}

// CostItem 成本项业务逻辑
type CostItem struct {
	TransModel        model.ITrans
	CostItemModel     model.ICostItem
	CostBusinessModel model.ICostBusiness
}

// Query 查询数据
func (a *CostItem) Query(ctx context.Context, params schema.CostItemQueryParam, opts ...schema.CostItemQueryOptions) (*schema.CostItemQueryResult, error) {
	return a.CostItemModel.Query(ctx, params, opts...)
}

// QueryTree 查询树结构
func (a *CostItem) QueryTree(ctx context.Context, params schema.CostItemQueryParam) (schema.CostItems, error) {
	list, err := a.CostItemModel.Query(ctx, params)
	if err != nil {
		return nil, err
	}
	result := schema.CostItems{}
	for _, v := range list.Data {
		if v.ParentID != "" {
			for _, w := range list.Data {
				if w.RecordID == v.ParentID {
					w.Children = append(w.Children, v)
				}
			}
		} else {
			result = append(result, v)
		}
		//补充业态信息
		cbqp := schema.CostBusinessQueryParam{}
		cbqp.CostID = v.RecordID
		cbqr, err := a.CostBusinessModel.Query(ctx, cbqp)
		if err != nil {
			return nil, err
		}
		v.BusinessList = cbqr.Data
	}

	return result, nil
}

// Get 查询指定数据
func (a *CostItem) Get(ctx context.Context, recordID string, opts ...schema.CostItemQueryOptions) (*schema.CostItem, error) {
	item, err := a.CostItemModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *CostItem) getUpdate(ctx context.Context, recordID string) (*schema.CostItem, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *CostItem) Create(ctx context.Context, item schema.CostItem) (*schema.CostItem, error) {
	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		item.RecordID = util.MustUUID()
		err := a.CostItemModel.Create(ctx, item)
		if err != nil {
			return nil
		}

		//创建相应业态单价
		for _, v := range item.BusinessList {
			v.CostID = item.RecordID
			v.RecordID = util.MustUUID()
			a.CostBusinessModel.Create(ctx, *v)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *CostItem) Update(ctx context.Context, recordID string, item schema.CostItem) (*schema.CostItem, error) {
	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		oldItem, err := a.CostItemModel.Get(ctx, recordID)
		if err != nil {
			return err
		} else if oldItem == nil {
			return errors.ErrNotFound
		}

		//查询已有业态列表
		cbqp := schema.CostBusinessQueryParam{}
		cbqp.CostID = recordID
		cbqr, err := a.CostBusinessModel.Query(ctx, cbqp)
		if err != nil {
			return err
		}
		deleteM := map[string]int{}
		for _, v := range cbqr.Data {
			deleteM[v.RecordID] = 0
		}
		//遍历新业态列表
		for _, v := range item.BusinessList {
			n := true
			for _, w := range cbqr.Data {
				//更新
				if v.BusinessID == w.BusinessID && v.CostID == w.CostID {
					n = false
					deleteM[w.RecordID] = 1
					w.UnitPrice = v.UnitPrice
					if err := a.CostBusinessModel.Update(ctx, w.RecordID, *w); err != nil {
						return err
					}
					break
				}
			}
			//新建
			if n {
				v.RecordID = util.MustUUID()
				if err := a.CostBusinessModel.Create(ctx, *v); err != nil {
					return err
				}
			}
		}

		//删除
		for k, v := range deleteM {
			if v == 0 {
				if err := a.CostBusinessModel.Delete(ctx, k); err != nil {
					return err
				}
			}
		}

		err = a.CostItemModel.Update(ctx, recordID, item)
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *CostItem) Delete(ctx context.Context, recordID string) error {

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		oldItem, err := a.CostItemModel.Get(ctx, recordID)
		if err != nil {
			return err
		} else if oldItem == nil {
			return errors.ErrNotFound
		}

		// 确认下级
		ciqp := schema.CostItemQueryParam{}
		ciqp.ParentID = recordID
		ciqr, err := a.CostItemModel.Query(ctx, ciqp)
		if err != nil {
			return err
		}
		if len(ciqr.Data) > 0 {
			return errors.New("存在下级，不可删除")
		}
		// 删除相关业态数据
		cbqp := schema.CostBusinessQueryParam{}
		cbqp.CostID = recordID
		cbqr, err := a.CostBusinessModel.Query(ctx, cbqp)
		if err != nil {
			return err
		}
		for _, v := range cbqr.Data {
			if err := a.CostBusinessModel.Delete(ctx, v.RecordID); err != nil {
				return err
			}
		}

		return a.CostItemModel.Delete(ctx, recordID)
	})
}
