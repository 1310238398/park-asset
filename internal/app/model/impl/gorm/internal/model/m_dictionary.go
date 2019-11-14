package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewDictionary 创建字典管理存储实例
func NewDictionary(db *gormplus.DB) *Dictionary {
	return &Dictionary{db}
}

// Dictionary 字典管理存储
type Dictionary struct {
	db *gormplus.DB
}

func (a *Dictionary) getQueryOption(opts ...schema.DictionaryQueryOptions) schema.DictionaryQueryOptions {
	var opt schema.DictionaryQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Dictionary) Query(ctx context.Context, params schema.DictionaryQueryParam, opts ...schema.DictionaryQueryOptions) (*schema.DictionaryQueryResult, error) {
	db := entity.GetDictionaryDB(ctx, a.db).DB

	if v := params.LikeCode; v != "" {
		db = db.Where("code LIKE ?", "%"+v+"%")
	}
	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.Code; v != "" {
		db = db.Where("code=?", v)
	}
	if v := params.ParentID; v != nil {
		db = db.Where("parent_id=?", *v)
	}
	if v := params.ParentPath; v != "" {
		db = db.Where("parent_path=?", v)
	}
	if v := params.PrefixParentPath; v != "" {
		db = db.Where("parent_path LIKE ?", v+"%")
	}
	db = db.Order("sequence DESC,id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Dictionaries
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.DictionaryQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaDictionaries(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Dictionary) Get(ctx context.Context, recordID string, opts ...schema.DictionaryQueryOptions) (*schema.Dictionary, error) {
	db := entity.GetDictionaryDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Dictionary
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaDictionary(), nil
}

// Create 创建数据
func (a *Dictionary) Create(ctx context.Context, item schema.Dictionary) error {
	Dictionary := entity.SchemaDictionary(item).ToDictionary()
	result := entity.GetDictionaryDB(ctx, a.db).Create(Dictionary)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Dictionary) Update(ctx context.Context, recordID string, item schema.Dictionary) error {
	Dictionary := entity.SchemaDictionary(item).ToDictionary()
	result := entity.GetDictionaryDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Dictionary)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Dictionary) Delete(ctx context.Context, recordID string) error {
	result := entity.GetDictionaryDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Dictionary{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateParentPath 更新父级路径
func (a *Dictionary) UpdateParentPath(ctx context.Context, recordID, parentPath string) error {
	result := entity.GetDictionaryDB(ctx, a.db).Where("record_id=?", recordID).Update("parent_path", parentPath)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
