package model

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// NewOrganization 创建组织机构管理存储实例
func NewOrganization(db *gormplus.DB) *Organization {
	return &Organization{db}
}

// Organization 组织机构管理存储
type Organization struct {
	db *gormplus.DB
}

func (a *Organization) getQueryOption(opts ...schema.OrganizationQueryOptions) schema.OrganizationQueryOptions {
	var opt schema.OrganizationQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *Organization) Query(ctx context.Context, params schema.OrganizationQueryParam, opts ...schema.OrganizationQueryOptions) (*schema.OrganizationQueryResult, error) {
	db := entity.GetOrganizationDB(ctx, a.db).DB

	if v := params.LikeName; v != "" {
		db = db.Where("name LIKE ?", "%"+v+"%")
	}
	if v := params.Name; v != "" {
		db = db.Where("name=?", v)
	}
	if v := params.OrgType; v != 0 {
		db = db.Where("org_type=?", v)
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
	if v := params.RecordIDs; len(v) > 0 {
		db = db.Where("record_id IN(?)", v)
	}
	db = db.Order("sequence DESC,id DESC")

	opt := a.getQueryOption(opts...)
	var list entity.Organizations
	pr, err := WrapPageQueryNC(db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.OrganizationQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaOrganizations(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *Organization) Get(ctx context.Context, recordID string, opts ...schema.OrganizationQueryOptions) (*schema.Organization, error) {
	db := entity.GetOrganizationDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.Organization
	ok, err := a.db.FindOne(db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}

	return item.ToSchemaOrganization(), nil
}

// Create 创建数据
func (a *Organization) Create(ctx context.Context, item schema.Organization) error {
	Organization := entity.SchemaOrganization(item).ToOrganization()
	result := entity.GetOrganizationDB(ctx, a.db).Create(Organization)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *Organization) Update(ctx context.Context, recordID string, item schema.Organization) error {
	Organization := entity.SchemaOrganization(item).ToOrganization()
	result := entity.GetOrganizationDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id", "creator").Updates(Organization)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *Organization) Delete(ctx context.Context, recordID string) error {
	result := entity.GetOrganizationDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.Organization{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateParentPath 更新父级路径
func (a *Organization) UpdateParentPath(ctx context.Context, recordID, parentPath string) error {
	result := entity.GetOrganizationDB(ctx, a.db).Where("record_id=?", recordID).Update("parent_path", parentPath)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
