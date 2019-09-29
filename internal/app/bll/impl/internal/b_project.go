package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProject 创建项目管理
func NewProject(
	mProject model.IProject,
	mOrganization model.IOrganization,
	mPlot model.IPlot,
) *Project {
	return &Project{
		ProjectModel:      mProject,
		OrganizationModel: mOrganization,
		PlotModel:         mPlot,
	}
}

// Project 项目管理业务逻辑
type Project struct {
	ProjectModel      model.IProject
	OrganizationModel model.IOrganization
	PlotModel         model.IPlot
}

// Query 查询数据
func (a *Project) Query(ctx context.Context, params schema.ProjectQueryParam, opts ...schema.ProjectQueryOptions) (*schema.ProjectQueryResult, error) {
	result, err := a.ProjectModel.Query(ctx, params, opts...)
	if err != nil {
		return nil, err
	}

	orgIDs := result.Data.ToOrgIDs()
	if len(orgIDs) > 0 {
		orgResult, err := a.OrganizationModel.Query(ctx, schema.OrganizationQueryParam{
			RecordIDs: orgIDs,
		})
		if err != nil {
			return nil, err
		}
		result.Data.FillOrgData(orgResult.Data.ToMap())
	}

	plotIDs := result.Data.ToPlotIDs()
	if len(plotIDs) > 0 {
		plotResult, err := a.PlotModel.Query(ctx, schema.PlotQueryParam{
			RecordIDs: plotIDs,
		})
		if err != nil {
			return nil, err
		}
		result.Data.FillPlotData(plotResult.Data.ToMap())
	}

	return result, nil
}

// Get 查询指定数据
func (a *Project) Get(ctx context.Context, recordID string, opts ...schema.ProjectQueryOptions) (*schema.Project, error) {
	item, err := a.ProjectModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *Project) checkName(ctx context.Context, name, orgID string) error {
	result, err := a.ProjectModel.Query(ctx, schema.ProjectQueryParam{
		Name:   name,
		OrgIDs: []string{orgID},
	}, schema.ProjectQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

func (a *Project) getUpdate(ctx context.Context, recordID string) (*schema.Project, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *Project) Create(ctx context.Context, item schema.Project) (*schema.Project, error) {
	err := a.checkName(ctx, item.Name, item.OrgID)
	if err != nil {
		return nil, err
	}

	item.RecordID = util.MustUUID()
	err = a.ProjectModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *Project) Update(ctx context.Context, recordID string, item schema.Project) (*schema.Project, error) {
	oldItem, err := a.ProjectModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	} else if oldItem.Name != item.Name ||
		oldItem.OrgID != item.OrgID {
		err := a.checkName(ctx, item.Name, item.OrgID)
		if err != nil {
			return nil, err
		}
	}

	err = a.ProjectModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *Project) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjectModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	// TODO: 检查项目下的资产数据，如果存在，则不允许删除

	return a.ProjectModel.Delete(ctx, recordID)
}
