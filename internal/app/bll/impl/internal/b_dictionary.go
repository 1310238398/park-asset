package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewDictionary 创建字典管理
func NewDictionary(mDictionary model.IDictionary, mTrans model.ITrans) *Dictionary {
	return &Dictionary{
		DictionaryModel: mDictionary,
		TransModel:      mTrans,
	}
}

// Dictionary 字典管理业务逻辑
type Dictionary struct {
	DictionaryModel model.IDictionary
	TransModel      model.ITrans
}

// Query 查询数据
func (a *Dictionary) Query(ctx context.Context, params schema.DictionaryQueryParam, opts ...schema.DictionaryQueryOptions) (*schema.DictionaryQueryResult, error) {
	return a.DictionaryModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *Dictionary) Get(ctx context.Context, recordID string, opts ...schema.DictionaryQueryOptions) (*schema.Dictionary, error) {
	item, err := a.DictionaryModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Dictionary) getUpdate(ctx context.Context, recordID string) (*schema.Dictionary, error) {
	return a.Get(ctx, recordID)
}

func (a *Dictionary) checkCode(ctx context.Context, code, parentID string) error {
	result, err := a.DictionaryModel.Query(ctx, schema.DictionaryQueryParam{
		Code:     code,
		ParentID: &parentID,
	}, schema.DictionaryQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

func (a *Dictionary) getSep() string {
	return "$#"
}

// 获取父级路径
func (a *Dictionary) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.DictionaryModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	var parentPath string
	if v := pitem.ParentPath; v != "" {
		parentPath = v + a.getSep()
	}
	parentPath = parentPath + pitem.Code
	return parentPath, nil
}

// Create 创建数据
func (a *Dictionary) Create(ctx context.Context, item schema.Dictionary) (*schema.Dictionary, error) {
	err := a.checkCode(ctx, item.Code, item.ParentID)
	if err != nil {
		return nil, err
	}

	parentPath, err := a.getParentPath(ctx, item.ParentID)
	if err != nil {
		return nil, err
	}

	item.ParentPath = parentPath
	item.RecordID = util.MustUUID()
	err = a.DictionaryModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Dictionary) Update(ctx context.Context, recordID string, item schema.Dictionary) (*schema.Dictionary, error) {
	if recordID == item.ParentID {
		return nil, errors.ErrInvalidParent
	}

	oldItem, err := a.DictionaryModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if oldItem.Code != item.Code {
		err := a.checkCode(ctx, item.Code, item.ParentID)
		if err != nil {
			return nil, err
		}
	}
	item.ParentPath = oldItem.ParentPath

	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		// 如果父级更新，需要更新当前节点及节点下级的父级路径
		if item.ParentID != oldItem.ParentID ||
			item.Code != oldItem.Code {
			parentPath, err := a.getParentPath(ctx, item.ParentID)
			if err != nil {
				return err
			}
			item.ParentPath = parentPath

			opath := oldItem.ParentPath
			if opath != "" {
				opath += a.getSep()
			}
			opath += oldItem.Code

			result, err := a.DictionaryModel.Query(ctx, schema.DictionaryQueryParam{
				PrefixParentPath: opath,
			})
			if err != nil {
				return err
			}

			npath := item.ParentPath
			if npath != "" {
				npath += a.getSep()
			}
			npath += item.Code

			for _, menu := range result.Data {
				npath2 := npath + menu.ParentPath[len(opath):]
				err = a.DictionaryModel.UpdateParentPath(ctx, menu.RecordID, npath2)
				if err != nil {
					return err
				}
			}
		}

		return a.DictionaryModel.Update(ctx, recordID, item)
	})
	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Dictionary) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.DictionaryModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	// 检查是否包含子级数据
	result, err := a.DictionaryModel.Query(ctx, schema.DictionaryQueryParam{
		ParentID: &recordID,
	}, schema.DictionaryQueryOptions{PageParam: &schema.PaginationParam{PageSize: -1}})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrNotAllowDeleteWithChild
	}

	return a.DictionaryModel.Delete(ctx, recordID)
}
