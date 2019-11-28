package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCapitalizedInterest 创建项目资本化利息测算
func NewProjCapitalizedInterest(
	mTrans model.ITrans,
	mProjCapitalizedInterest model.IProjCapitalizedInterest,
	mProjCostItem model.IProjCostItem,

) *ProjCapitalizedInterest {
	return &ProjCapitalizedInterest{
		TransModel:                   mTrans,
		ProjCapitalizedInterestModel: mProjCapitalizedInterest,
		ProjCostItemModel:            mProjCostItem,
	}
}

// ProjCapitalizedInterest 项目资本化利息测算业务逻辑
type ProjCapitalizedInterest struct {
	TransModel                   model.ITrans
	ProjCapitalizedInterestModel model.IProjCapitalizedInterest
	ProjCostItemModel            model.IProjCostItem
}

// renew 更新资本化利息
func (a *ProjCapitalizedInterest) renew(ctx context.Context, projectID string) error {

	//列表
	var start, end QuarterIndex
	listMap := map[QuarterIndex]*schema.ProjCapitalizedInterest{}
	list := []*schema.ProjCapitalizedInterest{}
	//确认收入列表
	//确认支出列表
	//整合资本化利息
	var ir = 0.05375  //收入纳税比例
	var cr = 0.07 / 4 //资金成本率
	var total float64 //累计金额
	for q := start; q <= end; q = q.Next() {
		item := listMap[q]
		if item == nil {
			item = new(schema.ProjCapitalizedInterest)
		}
		item.TaxPayment = item.SalesPayback * ir
		item.FundsOccupiedAmount = item.SalesPayback - item.CostExpenditure - item.TaxPayment
		total += item.FundsOccupiedAmount
		item.AccumulativeOccupancyFunds = total
		if total < 0 {
			item.FundPossessionCost = total * (-1) * cr
		}
		list = append(list, item)
	}
	//查询已有资本换利息
	//更新列表

	//统计资本化利息
	var totalInterest float64
	for _, v := range list {
		totalInterest += v.FundPossessionCost
	}

	//更新成本测算中的资本化利息
	pciqp := schema.ProjCostItemQueryParam{}
	pciqp.Name = "资本化利息"
	pciqp.ProjectID = projectID
	pciqr, err := a.ProjCostItemModel.QueryShow(ctx, pciqp)
	if err != nil {
		return err
	}
	if len(pciqr) > 0 {
		pci, err := a.ProjCostItemModel.Get(ctx, pciqr[0].RecordID)
		if err != nil {
			return err
		}
		pci.Price = totalInterest
		err = a.ProjCostItemModel.Update(ctx, pciqr[0].RecordID, *pci)
		if err != nil {
			return err
		}
	}
	return nil
}

// Query 查询数据
func (a *ProjCapitalizedInterest) Query(ctx context.Context, params schema.ProjCapitalizedInterestQueryParam, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterestQueryResult, error) {
	return a.ProjCapitalizedInterestModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCapitalizedInterest) Get(ctx context.Context, recordID string, opts ...schema.ProjCapitalizedInterestQueryOptions) (*schema.ProjCapitalizedInterest, error) {
	item, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCapitalizedInterest) getUpdate(ctx context.Context, recordID string) (*schema.ProjCapitalizedInterest, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCapitalizedInterest) Create(ctx context.Context, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error) {
	item.RecordID = util.MustUUID()
	err := a.ProjCapitalizedInterestModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCapitalizedInterest) Update(ctx context.Context, recordID string, item schema.ProjCapitalizedInterest) (*schema.ProjCapitalizedInterest, error) {
	oldItem, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCapitalizedInterestModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCapitalizedInterest) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCapitalizedInterestModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCapitalizedInterestModel.Delete(ctx, recordID)
}

type QuarterIndex int

// NewQuarterIndex 获取新的季度索引
func NewQuarterIndex(year, quarter int) QuarterIndex {

	if quarter > 4 { //进位
		year += (quarter - 1) / 4
		quarter = (quarter-1)%4 + 1
	} else if quarter <= 0 { //退位
		year += (quarter / 4) - 1
		quarter = 4 - (quarter % 4)
	}

	return QuarterIndex(year*10 + quarter)
}

// Next下个季度索引
func (a QuarterIndex) Next() QuarterIndex {
	i, j := a.Split()
	return NewQuarterIndex(i, j+1)
}

func (a QuarterIndex) Last() QuarterIndex {
	i, j := a.Split()
	return NewQuarterIndex(i, j-1)
}

// Split下个季度索引
func (a QuarterIndex) Split() (int, int) {
	return int(a / 10), int(a % 10)
}
