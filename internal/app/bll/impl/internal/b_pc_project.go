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
	mProjExpenditure model.IProjExpenditure,
	mExpenditure model.IExpenditure,

) *PcProject {
	return &PcProject{
		TransModel:           mTrans,
		PcProjectModel:       mPcProject,
		ProjFileModel:        mProjFile,
		OrganizationModel:    mOrganization,
		PlotModel:            mPlot,
		ProjExpenditureModel: mProjExpenditure,
		ExpenditureModel:     mExpenditure,
	}
}

// PcProject 成本项目管理业务逻辑
type PcProject struct {
	PcProjectModel       model.IPcProject
	TransModel           model.ITrans
	ProjFileModel        model.IProjFile
	OrganizationModel    model.IOrganization
	PlotModel            model.IPlot
	ProjExpenditureModel model.IProjExpenditure
	ExpenditureModel     model.IExpenditure
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

	fResult, err := a.ProjFileModel.Query(ctx, schema.ProjFileQueryParam{})
	if err != nil {
		return nil, err
	}

	result.Data.FillFiles(fResult.Data)
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
	err := a.checkName(ctx, item.Name, item.OrgID)
	if err != nil {
		return nil, err
	}

	err = a.create(ctx, item)
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

	err = a.update(ctx, recordID, item)
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

		eResult, err := a.ExpenditureModel.Query(ctx, schema.ExpenditureQueryParam{})
		if err != nil {
			return err
		}

		var projExpendlist schema.ProjExpenditures
		projExpendlist = *eResult.Data.ToTrees().ToTree().ToProjExpendList(&projExpendlist)
		for i, projExpendItem := range projExpendlist {
			projExpendItem.ProjectID = item.RecordID
			projExpendItem.Sequence = float64(i) + 1
			err = a.ProjExpenditureModel.Create(ctx, *projExpendItem)
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

func (a *PcProject) checkName(ctx context.Context, name, orgID string) error {
	result, err := a.PcProjectModel.Query(ctx, schema.PcProjectQueryParam{
		Name:   name,
		OrgIDs: []string{orgID},
	}, schema.PcProjectQueryOptions{
		PageParam: &schema.PaginationParam{PageSize: -1},
	})
	if err != nil {
		return err
	} else if result.PageResult.Total > 0 {
		return errors.ErrResourceExists
	}
	return nil
}

func (a *PcProject) update(ctx context.Context, recordID string, item schema.PcProject) error {
	fResult, err := a.ProjFileModel.Query(ctx, schema.ProjFileQueryParam{
		ProjectID: recordID,
	})
	if err != nil {
		return err
	}
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		addItems := a.compare(ctx, item.Files, fResult.Data)
		delItems := a.compare(ctx, fResult.Data, item.Files)
		for _, addItem := range addItems {
			err = a.ProjFileModel.Create(ctx, *addItem)
			if err != nil {
				return err
			}
		}

		for _, delItem := range delItems {
			err = a.ProjFileModel.Delete(ctx, delItem.RecordID)
			if err != nil {
				return err
			}
		}

		err = a.PcProjectModel.Update(ctx, recordID, item)
		if err != nil {
			return err
		}

		return nil
	})

}

func (a *PcProject) compare(ctx context.Context, sitems, titems schema.ProjFiles) schema.ProjFiles {
	var nitems schema.ProjFiles
	for _, fitem := range sitems {
		exists := false
		for _, ofitem := range titems {
			if fitem.RecordID == ofitem.RecordID {
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
