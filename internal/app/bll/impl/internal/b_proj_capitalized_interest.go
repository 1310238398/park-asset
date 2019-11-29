package internal

import (
	"context"
	"time"

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
	mPcProject model.IPcProject,
) *ProjCapitalizedInterest {
	return &ProjCapitalizedInterest{
		TransModel:                   mTrans,
		ProjCapitalizedInterestModel: mProjCapitalizedInterest,
		ProjCostItemModel:            mProjCostItem,
		PcProjectModel:               mPcProject,
	}
}

// ProjCapitalizedInterest 项目资本化利息测算业务逻辑
type ProjCapitalizedInterest struct {
	TransModel                   model.ITrans
	ProjCapitalizedInterestModel model.IProjCapitalizedInterest
	ProjCostItemModel            model.IProjCostItem
	PcProjectModel               model.IPcProject
}

// renew 更新资本化利息（收入及支出）
func (a *ProjCapitalizedInterest) renew(ctx context.Context, projectID string) error {

	//获取项目
	project, err := a.PcProjectModel.Get(ctx, projectID)
	if err != nil {
		return err
	}

	//列表
	var start, end QuarterIndex

	start = NewQuarterIndexFromTime(project.StartTime)
	listMap := map[QuarterIndex]*schema.ProjCapitalizedInterest{}
	list := []*schema.ProjCapitalizedInterest{}
	//确认收入列表
	//确认支出列表
	//整合资本化利息
	var tr = 0.05375 //收入纳税比例
	var ir = 0.07    //资金成本率
	//整理列表
	for q := start; q <= end; q = q.Next() {
		item := listMap[q]
		if item == nil {
			item = new(schema.ProjCapitalizedInterest)
		}
		list = append(list, item)
	}
	//查询已有资本换利息
	pcqp := schema.ProjCapitalizedInterestQueryParam{}
	pcqp.ProjectID = projectID
	pcqr, err := a.ProjCapitalizedInterestModel.Query(ctx, pcqp)
	if err != nil {
		return err
	}
	oldlist := pcqr.Data
	delMap := map[string]bool{}
	for _, v := range oldlist {
		delMap[v.RecordID] = true //需要删除
	}
	//更新列表
	for _, v := range list {
		b := true //需要新增
		for _, w := range oldlist {
			if v.Year == w.Year && v.Quarter == w.Quarter {
				delMap[w.RecordID] = false
				b = false
				//更新
				if w.SalesPayback != v.SalesPayback || w.CostExpenditure != v.CostExpenditure {
					w.SalesPayback = v.SalesPayback
					w.CostExpenditure = v.CostExpenditure
					if err := a.ProjCapitalizedInterestModel.Update(ctx, w.RecordID, *w); err != nil {
						return err
					}
				}
				break
			}
		}
		if b {
			item := *v
			item.RecordID = util.MustUUID()
			item.SalesPayback = v.SalesPayback
			item.CostExpenditure = v.CostExpenditure
			item.TaxRate = tr
			item.InterestRate = ir

			if err := a.ProjCapitalizedInterestModel.Create(ctx, item); err != nil {
				return err
			}
		}
	}
	//删除数据
	for k, v := range delMap {
		if v {
			if err := a.ProjCapitalizedInterestModel.Delete(ctx, k); err != nil {
				return err
			}
		}
	}

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
	if err := a.calculate(ctx, projectID); err != nil {
		return err
	}
	return nil
}

// calculate 统计计算
func (a *ProjCapitalizedInterest) calculate(ctx context.Context, projectID string) error {

	// 资本化利息
	pciqp := schema.ProjCapitalizedInterestQueryParam{}
	pciqp.ProjectID = projectID
	pciqr, err := a.ProjCapitalizedInterestModel.Query(ctx, pciqp)
	if err != nil {
		return err
	}
	var total float64 //累计金额
	for _, v := range pciqr.Data {
		b := false //是否需要更新
		//缴纳税金
		tp := util.DecimalFloat64(v.SalesPayback * v.TaxRate)
		if v.TaxPayment != tp {
			v.TaxPayment = tp
			b = true
		}
		//占用金额
		funds := util.DecimalFloat64(v.SalesPayback - v.CostExpenditure -
			v.TaxPayment - v.MarginOut + v.MarginBack)
		if v.FundsOccupiedAmount != funds {
			v.FundsOccupiedAmount = funds
			b = true
		}
		//累计占用金额
		total += funds
		if v.AccumulativeOccupancyFunds != total {
			v.AccumulativeOccupancyFunds = total
			b = true
		}
		//资金占用费
		var fundCost float64
		if total < 0 {
			fundCost = util.DecimalFloat64(total * (-1) * v.InterestRate / 4)
		}
		if v.FundPossessionCost != fundCost {
			v.FundPossessionCost = fundCost
			b = true
		}
		//更新
		if b {
			if err := a.ProjCapitalizedInterestModel.Update(ctx, v.RecordID, *v); err != nil {
				return err
			}
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

func NewQuarterIndexFromTime(t time.Time) QuarterIndex {
	y := t.Year()
	m := t.Month()
	q := 0
	switch m {
	case time.January, time.February, time.March:
		q = 1
	case time.April, time.May, time.June:
		q = 2
	case time.July, time.August, time.September:
		q = 3
	case time.October, time.November, time.December:
		q = 4
	}
	return NewQuarterIndex(y, q)
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
