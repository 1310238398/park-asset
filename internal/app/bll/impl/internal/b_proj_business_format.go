package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjBusinessFormat 创建项目业态
func NewProjBusinessFormat(mProjBusinessFormat model.IProjBusinessFormat,
	mTrans model.ITrans, mBusinessFormat model.IBusinessFormat) *ProjBusinessFormat {
	return &ProjBusinessFormat{
		TransModel:              mTrans,
		ProjBusinessFormatModel: mProjBusinessFormat,
		BusinessFormatModel:     mBusinessFormat,
	}
}

// ProjBusinessFormat 项目业态业务逻辑
type ProjBusinessFormat struct {
	TransModel              model.ITrans
	BusinessFormatModel     model.IBusinessFormat
	ProjBusinessFormatModel model.IProjBusinessFormat
}

// Query 查询数据
func (a *ProjBusinessFormat) Query(ctx context.Context, params schema.ProjBusinessFormatQueryParam, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormatQueryResult, error) {
	result, err := a.ProjBusinessFormatModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	businResult, err := a.BusinessFormatModel.Query(ctx, schema.BusinessFormatQueryParam{})
	if err != nil {
		return nil, err
	}

	// 填充数据
	result.Data.FillData(businResult.Data)

	return result, nil
}

// Get 查询指定数据
func (a *ProjBusinessFormat) Get(ctx context.Context, recordID string, opts ...schema.ProjBusinessFormatQueryOptions) (*schema.ProjBusinessFormat, error) {
	item, err := a.ProjBusinessFormatModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjBusinessFormat) getUpdate(ctx context.Context, recordID string) (*schema.ProjBusinessFormat, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjBusinessFormat) Create(ctx context.Context, item schema.ProjBusinessFormat) (*schema.ProjBusinessFormat, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjBusinessFormatModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjBusinessFormat) Update(ctx context.Context, recordID string, item schema.ProjBusinessFormat) (*schema.ProjBusinessFormat, error) {
	oldItem, err := a.ProjBusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjBusinessFormatModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjBusinessFormat) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjBusinessFormatModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjBusinessFormatModel.Delete(ctx, recordID)
}

// UpdateList 批量更新数据
func (a *ProjBusinessFormat) UpdateList(ctx context.Context, projectID string, items schema.ProjBusinessFormats) error {
	err := a.update(ctx, projectID, items)
	if err != nil {
		return err
	}

	return nil
}

// 批量更新项目业态
func (a *ProjBusinessFormat) update(ctx context.Context, projectID string, list schema.ProjBusinessFormats) error {
	result, err := a.ProjBusinessFormatModel.Query(ctx, schema.ProjBusinessFormatQueryParam{
		ProjectID: projectID,
	})
	if err != nil {
		return err
	}

	m := result.Data.ToMap()
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {

		addItems := a.compare(ctx, list, result.Data)
		delItems := a.compare(ctx, result.Data, list)
		updateItems := a.compare(ctx, list, append(addItems, delItems...))

		// 删除
		for _, delItem := range delItems {
			err := a.ProjBusinessFormatModel.Delete(ctx, delItem.RecordID)
			if err != nil {
				return err
			}

		}

		// 新增
		for _, addItem := range addItems {
			addItem.RecordID = util.MustUUID()
			err := a.ProjBusinessFormatModel.Create(ctx, *addItem)
			if err != nil {
				return err
			}

		}

		// 更新
		for _, updateItem := range updateItems {
			oldItem, ok := m[updateItem.RecordID]
			if !ok {
				continue
			}

			switch {
			case updateItem.ProjectID == "":
				updateItem.ProjectID = oldItem.ProjectID
				fallthrough
			case updateItem.FloorArea == 0:
				updateItem.FloorArea = oldItem.FloorArea
				fallthrough
			case updateItem.Name == "":
				updateItem.Name = oldItem.Name
			}

			err := a.ProjBusinessFormatModel.Update(ctx, updateItem.RecordID, *updateItem)
			if err != nil {
				return err
			}
		}

		return nil
	})

}

// 比较获得新项目业态 旧项目业态
func (a *ProjBusinessFormat) compare(ctx context.Context, sitems, titems schema.ProjBusinessFormats) schema.ProjBusinessFormats {
	var nitems schema.ProjBusinessFormats
	for _, fitem := range sitems {
		exists := false
		for _, ofitem := range titems {
			if fitem.BusinessFormatID == ofitem.BusinessFormatID {
				exists = true
				break
			}
		}
		if !exists {
			nitems = append(nitems, fitem)
		}
	}

	return nitems
}
