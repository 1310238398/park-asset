package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewPcProject 创建成本项目管理
func NewPcProject(
	mPcProject model.IPcProject,
	mTrans model.ITrans,
	mProjFile model.IProjFile,
	mOrganization model.IOrganization,
	mPlot model.IPlot,
) *PcProject {
	return &PcProject{
		TransModel:        mTrans,
		PcProjectModel:    mPcProject,
		ProjFileModel:     mProjFile,
		OrganizationModel: mOrganization,
		PlotModel:         mPlot,
	}
}

// PcProject 成本项目管理业务逻辑
type PcProject struct {
	PcProjectModel    model.IPcProject
	TransModel        model.ITrans
	ProjFileModel     model.IProjFile
	OrganizationModel model.IOrganization
	PlotModel         model.IPlot
}

// Query 查询数据
func (a *PcProject) Query(ctx context.Context, params schema.PcProjectQueryParam, opts ...schema.PcProjectQueryOptions) (*schema.PcProjectQueryResult, error) {
	result, err := a.PcProjectModel.Query(ctx, params, opts...)
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
func (a *PcProject) Get(ctx context.Context, recordID string, opts ...schema.PcProjectQueryOptions) (*schema.PcProject, error) {
	item, err := a.PcProjectModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	err = a.fillFiles(ctx, item)
	if err != nil {
		return nil, err
	}
	return item, nil
}

func (a *PcProject) getUpdate(ctx context.Context, recordID string) (*schema.PcProject, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *PcProject) Create(ctx context.Context, item schema.PcProject) (*schema.PcProject, error) {
	item.RecordID = util.MustUUID()
	err := a.create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *PcProject) Update(ctx context.Context, recordID string, item schema.PcProject) (*schema.PcProject, error) {
	oldItem, err := a.PcProjectModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.PcProjectModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *PcProject) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.PcProjectModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.PcProjectModel.Delete(ctx, recordID)
}

func (a *PcProject) create(ctx context.Context, item schema.PcProject) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		err := a.PcProjectModel.Create(ctx, item)
		if err != nil {
			return err
		}

		for _, file := range item.Files {
			err := a.ProjFileModel.Create(ctx, *file)
			if err != nil {
				return err
			}
		}

		return nil
	})
}

func (a *PcProject) fillFiles(ctx context.Context, item *schema.PcProject) error {
	filesResult, err := a.ProjFileModel.Query(ctx, schema.ProjFileQueryParam{
		ProjectID: item.RecordID,
	})
	if err != nil {
		return err
	} else if len(filesResult.Data) == 0 {
		return nil
	}
	item.Files = filesResult.Data
	return nil
}
