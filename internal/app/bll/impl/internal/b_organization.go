package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewOrganization 创建组织机构管理
func NewOrganization(mOrganization model.IOrganization,
	mTrans model.ITrans,
	mUser model.IUser,
	mPcProject model.IPcProject,
) *Organization {
	return &Organization{
		OrganizationModel: mOrganization,
		TransModel:        mTrans,
		UserModel:         mUser,
		PcProjectModel:    mPcProject,
	}
}

// Organization 组织机构管理业务逻辑
type Organization struct {
	OrganizationModel model.IOrganization
	UserModel         model.IUser
	TransModel        model.ITrans
	PcProjectModel    model.IPcProject
}

// QueryCompany 查询用户的二级子公司
func (a *Organization) QueryCompany(ctx context.Context, userID string) (*schema.OrganizationQueryResult, error) {
	if CheckIsRootUser(ctx, userID) {
		return a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{OrgType: 2})
	}

	result, err := a.UserModel.Query(ctx, schema.UserQueryParam{
		RecordIDs: []string{userID},
	})
	if err != nil {
		return nil, nil
	} else if len(result.Data) == 0 || len(result.Data.ToOrgIDs()) == 0 {
		return nil, nil
	}

	orgItem, err := a.OrganizationModel.Get(ctx, result.Data[0].OrgID)
	if err != nil {
		return nil, err
	} else if orgItem == nil {
		return nil, nil
	} else if orgItem.OrgType == 1 {
		return a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{OrgType: 2})
	}

	return a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
		RecordIDs: result.Data.ToOrgIDs(),
		OrgType:   2,
	})
}

// Query 查询数据
func (a *Organization) Query(ctx context.Context, params schema.OrganizationQueryParam, opts ...schema.OrganizationQueryOptions) (*schema.OrganizationQueryResult, error) {
	result, err := a.OrganizationModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Get 查询指定数据
func (a *Organization) Get(ctx context.Context, recordID string, opts ...schema.OrganizationQueryOptions) (*schema.Organization, error) {
	item, err := a.OrganizationModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Organization) getUpdate(ctx context.Context, recordID string) (*schema.Organization, error) {
	return a.Get(ctx, recordID)
}

func (a *Organization) checkName(ctx context.Context, name, parentID string) error {
	result, err := a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
		Name:     name,
		ParentID: &parentID,
	}, schema.OrganizationQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

func (a *Organization) getSep() string {
	return "/"
}

// 获取父级路径
func (a *Organization) getParentPath(ctx context.Context, parentID string) (string, error) {
	if parentID == "" {
		return "", nil
	}

	pitem, err := a.OrganizationModel.Get(ctx, parentID)
	if err != nil {
		return "", err
	} else if pitem == nil {
		return "", errors.ErrInvalidParent
	}

	var parentPath string
	if v := pitem.ParentPath; v != "" {
		parentPath = v + a.getSep()
	}
	parentPath = parentPath + pitem.RecordID
	return parentPath, nil
}

// Create 创建数据
func (a *Organization) Create(ctx context.Context, item schema.Organization) (*schema.Organization, error) {
	err := a.checkName(ctx, item.Name, item.ParentID)
	if err != nil {
		return nil, err
	}

	parentPath, err := a.getParentPath(ctx, item.ParentID)
	if err != nil {
		return nil, err
	}

	item.ParentPath = parentPath
	item.RecordID = util.MustUUID()
	err = a.OrganizationModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Organization) Update(ctx context.Context, recordID string, item schema.Organization) (*schema.Organization, error) {
	if recordID == item.ParentID {
		return nil, errors.ErrInvalidParent
	}

	oldItem, err := a.OrganizationModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if oldItem.Name != item.Name {
		err := a.checkName(ctx, item.Name, item.ParentID)
		if err != nil {
			return nil, err
		}
	}
	item.ParentPath = oldItem.ParentPath

	err = ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		// 如果父级更新，需要更新当前节点及节点下级的父级路径
		if item.ParentID != oldItem.ParentID {
			parentPath, err := a.getParentPath(ctx, item.ParentID)
			if err != nil {
				return err
			}
			item.ParentPath = parentPath

			opath := oldItem.ParentPath
			if opath != "" {
				opath += a.getSep()
			}
			opath += oldItem.RecordID

			result, err := a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
				PrefixParentPath: opath,
			})
			if err != nil {
				return err
			}

			npath := item.ParentPath
			if npath != "" {
				npath += a.getSep()
			}
			npath += item.RecordID

			for _, menu := range result.Data {
				npath2 := npath + menu.ParentPath[len(opath):]
				err = a.OrganizationModel.UpdateParentPath(ctx, menu.RecordID, npath2)
				if err != nil {
					return err
				}
			}
		}

		return a.OrganizationModel.Update(ctx, recordID, item)
	})
	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Organization) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.OrganizationModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	// 检查是否包含子级数据
	result, err := a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
		ParentID: &recordID,
	}, schema.OrganizationQueryOptions{PageParam: &schema.PaginationParam{PageSize: -1}})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrNotAllowDeleteWithChild
	}

	return a.OrganizationModel.Delete(ctx, recordID)
}
