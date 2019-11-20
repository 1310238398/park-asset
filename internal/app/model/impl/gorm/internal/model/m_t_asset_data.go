package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewTAssetData 创建资产数据存储实例
func NewTAssetData(db *gormplus.DB) *TAssetData {
	return &TAssetData{db}
}

// TAssetData 资产数据存储
type TAssetData struct {
	db *gormplus.DB
}

func (a *TAssetData) getQueryOption(opts ...schema.TAssetDataQueryOptions) schema.TAssetDataQueryOptions {
	var opt schema.TAssetDataQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *TAssetData) Query(ctx context.Context, params schema.TAssetDataQueryParam, opts ...schema.TAssetDataQueryOptions) (*schema.TAssetDataQueryResult, error) {
	db := entity.GetTAssetDataDB(ctx, a.db).DB
	if v := params.LikeOrgName; v != "" {
		db = db.Where("org_name LIKE ?", "%"+v+"%")
	}
	if v := params.LikeProjectName; v != "" {
		db = db.Where("project_name LIKE ?", "%"+v+"%")
	}
	if v := params.AssetType; v != 0 {
		db = db.Where("asset_type=?", v)
	}
	db = db.Order("org_name,project_name,asset_type")

	opt := a.getQueryOption(opts...)
	var list entity.TAssetDatas
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.TAssetDataQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaTAssetData(),
	}

	return qr, nil
}

// QueryProjectName 查询项目名称列表
func (a *TAssetData) QueryProjectName(ctx context.Context, params schema.TAssetDataQueryProjectNameParam) ([]string, error) {
	db := entity.GetTAssetDataDB(ctx, a.db).DB
	if v := params.LikeProjectName; v != "" {
		db = db.Where("project_name LIKE ?", "%"+v+"%")
	}
	if v := params.Count; v > 0 {
		db = db.Limit(v)
	}
	db = db.Select("project_name").Group("project_name")

	var result []struct {
		ProjectName string `grom:"column:project_name"`
	}
	dbResult := db.Find(&result)
	if err := dbResult.Error; err != nil {
		return nil, errors.WithStack(err)
	}

	names := make([]string, len(result))
	for i, item := range result {
		names[i] = item.ProjectName
	}

	return names, nil
}

// Get 查询指定数据
func (a *TAssetData) Get(ctx context.Context, recordID string, opts ...schema.TAssetDataQueryOptions) (*schema.TAssetData, error) {
	db := entity.GetTAssetDataDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.TAssetData
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaTAssetData(), nil
}

// Create 创建数据
func (a *TAssetData) Create(ctx context.Context, item schema.TAssetData) error {
	TAssetData := entity.SchemaTAssetData(item).ToTAssetData()
	result := entity.GetTAssetDataDB(ctx, a.db).Create(TAssetData)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *TAssetData) Update(ctx context.Context, recordID string, item schema.TAssetData) error {
	TAssetData := entity.SchemaTAssetData(item).ToTAssetData()
	result := entity.GetTAssetDataDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(TAssetData)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *TAssetData) Delete(ctx context.Context, recordID string) error {
	result := entity.GetTAssetDataDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.TAssetData{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
