package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewProjFile 创建成本项目文件管理存储实例
func NewProjFile(db *gorm.DB) *ProjFile {
	return &ProjFile{db}
}

// ProjFile 成本项目文件管理存储
type ProjFile struct {
	db *gorm.DB
}

func (a *ProjFile) getQueryOption(opts ...schema.ProjFileQueryOptions) schema.ProjFileQueryOptions {
	var opt schema.ProjFileQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ProjFile) Query(ctx context.Context, params schema.ProjFileQueryParam, opts ...schema.ProjFileQueryOptions) (*schema.ProjFileQueryResult, error) {
	db := entity.GetProjFileDB(ctx, a.db)

	if v := params.ProjectID; v != "" {
		db = db.Where("project_id = ?", v)
	}

	db = db.Order("id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.ProjFiles
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ProjFileQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaProjFiles(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ProjFile) Get(ctx context.Context, recordID string, opts ...schema.ProjFileQueryOptions) (*schema.ProjFile, error) {
	db := entity.GetProjFileDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ProjFile
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaProjFile(), nil
}

// Create 创建数据
func (a *ProjFile) Create(ctx context.Context, item schema.ProjFile) error {
	ProjFile := entity.SchemaProjFile(item).ToProjFile()
	result := entity.GetProjFileDB(ctx, a.db).Create(ProjFile)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ProjFile) Update(ctx context.Context, recordID string, item schema.ProjFile) error {
	ProjFile := entity.SchemaProjFile(item).ToProjFile()
	result := entity.GetProjFileDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(ProjFile)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ProjFile) Delete(ctx context.Context, recordID string) error {
	result := entity.GetProjFileDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ProjFile{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
