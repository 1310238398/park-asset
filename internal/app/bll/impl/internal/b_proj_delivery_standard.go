package internal

import (
	"context"
	"fmt"
	"gxt-park-assets/internal/app/bll"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjDeliveryStandard 创建成本项目交付标准
func NewProjDeliveryStandard(mProjDeliveryStandard model.IProjDeliveryStandard, mTrans model.ITrans) bll.IProjDeliveryStandard {
	return &ProjDeliveryStandard{
		ProjDeliveryStandardModel: mProjDeliveryStandard,
		Trans:                     mTrans,
	}
}

// ProjDeliveryStandard 成本项目交付标准业务逻辑
type ProjDeliveryStandard struct {
	ProjDeliveryStandardModel model.IProjDeliveryStandard
	Trans                     model.ITrans
}

// UpdateList 整体更新
func (a *ProjDeliveryStandard) UpdateList(ctx context.Context, projectID string, list []*schema.ProjDeliveryStandard) error {

	return ExecTrans(ctx, a.Trans, func(ctx context.Context) error {
		var err error
		param := schema.ProjDeliveryStandardQueryParam{}
		param.ProjectID = projectID
		orglist, err := a.Query(ctx, param)

		var update func(pds *schema.ProjDeliveryStandard) error

		update = func(pds *schema.ProjDeliveryStandard) error {
			var n = true

			for k, v := range orglist.Data {
				if v.RecordID == pds.RecordID {
					//更新
					n = false
					if _, err = a.Update(ctx, v.RecordID, *pds); err != nil {
						return err
					}
					orglist.Data = append(orglist.Data[:k], orglist.Data[k+1:]...)
					break
				}
			}
			if n {
				//
				item, err := a.Create(ctx, *pds)
				if err != nil {
					return err
				}
				pds.RecordID = item.RecordID
			}
			//处理下级
			for _, v := range pds.Children {
				v.ParentID = pds.RecordID
				if err := update(v); err != nil {
					return err
				}
			}
			return nil
		}

		//执行
		for _, v := range list {
			if err := update(v); err != nil {
				return err
			}
		}
		return nil
	})
}

// Query 查询数据
func (a *ProjDeliveryStandard) Query(ctx context.Context, params schema.ProjDeliveryStandardQueryParam, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandardQueryResult, error) {
	return a.ProjDeliveryStandardModel.Query(ctx, params, opts...)
}

// QueryTree 查询树结构
func (a *ProjDeliveryStandard) QueryTree(ctx context.Context, params schema.ProjDeliveryStandardQueryParam) (schema.ProjDeliveryStandards, error) {
	result, err := a.ProjDeliveryStandardModel.Query(ctx, params)
	if err != nil {
		return nil, err
	}
	return a.toTree(result.Data), nil
}

// Get 查询指定数据
func (a *ProjDeliveryStandard) Get(ctx context.Context, recordID string, opts ...schema.ProjDeliveryStandardQueryOptions) (*schema.ProjDeliveryStandard, error) {
	item, err := a.ProjDeliveryStandardModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjDeliveryStandard) getUpdate(ctx context.Context, recordID string) (*schema.ProjDeliveryStandard, error) {
	return a.Get(ctx, recordID)
}

func (a *ProjDeliveryStandard) getPath(ctx context.Context, recordID string) (string, error) {
	result := recordID
	for {
		item, err := a.Get(ctx, recordID)
		if err != nil {
			return "", err
		}
		if item == nil {
			return result, nil
		}
		if item.ParentID == "" || item.ParentID == recordID {
			return result, nil
		}
		recordID = item.ParentID
		result = fmt.Sprintf("%s/%s", recordID, result)
	}
}

func (a *ProjDeliveryStandard) toTree(data schema.ProjDeliveryStandards) schema.ProjDeliveryStandards {
	result := schema.ProjDeliveryStandards{}
	for _, v := range data {
		if v.ParentID == "" {
			result = append(result, v)
		} else {
			for _, k := range data {
				if k.RecordID == v.ParentID {
					k.Children = append(k.Children, k)
				}
				break
			}
		}
	}
	return result
}

// Create 创建数据
func (a *ProjDeliveryStandard) Create(ctx context.Context, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjDeliveryStandardModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	item.ParentPath, err = a.getPath(ctx, item.ParentID)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjDeliveryStandard) Update(ctx context.Context, recordID string, item schema.ProjDeliveryStandard) (*schema.ProjDeliveryStandard, error) {
	oldItem, err := a.ProjDeliveryStandardModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjDeliveryStandardModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjDeliveryStandard) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjDeliveryStandardModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjDeliveryStandardModel.Delete(ctx, recordID)
}