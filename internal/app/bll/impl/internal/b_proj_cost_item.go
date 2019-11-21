package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewProjCostItem 创建项目成本项
func NewProjCostItem(
	mProjBusinessFormat model.IProjBusinessFormat,
	mProjCostItem model.IProjCostItem,
	mCostItem model.ICostItem,
	mTaxCalculation model.ITaxCalculation,
	mCostBusiness model.ICostBusiness,
	mProjCostBusiness model.IProjCostBusiness,
	mTrans model.ITrans,
) *ProjCostItem {
	return &ProjCostItem{
		ProjBusinessFormatModel: mProjBusinessFormat,
		ProjCostItemModel:       mProjCostItem,
		CostItemModel:           mCostItem,
		TaxCalculationModel:     mTaxCalculation,
		CostBusinessModel:       mCostBusiness,
		ProjCostBusinessModel:   mProjCostBusiness,
		TransModel:              mTrans,
	}
}

// ProjCostItem 项目成本项业务逻辑
type ProjCostItem struct {
	ProjBusinessFormatModel model.IProjBusinessFormat
	ProjCostItemModel       model.IProjCostItem
	CostItemModel           model.ICostItem
	TaxCalculationModel     model.ITaxCalculation
	CostBusinessModel       model.ICostBusiness
	ProjCostBusinessModel   model.IProjCostBusiness
	TransModel              model.ITrans
}

// Init 项目成本项生成
func (a *ProjCostItem) Init(ctx context.Context, projectID string) error {

	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		if projectID == "" {
			return errors.ErrBadRequest
		}

		ps := schema.ProjCostItemQueryParam{}
		ps.ProjectID = projectID
		result, err := a.Query(ctx, ps)
		if err != nil {
			return err
		}

		//已有成本管理
		if len(result.Data) > 0 {
			return nil
		}
		return nil

		// 获取项目业态面积
		pbfqp := schema.ProjBusinessFormatQueryParam{}
		pbfqp.ProjectID = projectID
		pbfqr, err := a.ProjBusinessFormatModel.Query(ctx, pbfqp)
		if err != nil {
			return err
		}

		// 获取模板
		temp, err := GetCostTemplate(ctx, a.CostItemModel)
		if err != nil {
			return err
		}

		// 按照模板创建项目成本项 返回成本总价
		var create func(ci *schema.CostItem) (float64, float64, error)

		create = func(ci *schema.CostItem) (float64, float64, error) {
			var err error
			if ci.Status != 1 {
				return 0, 0, nil
			}
			//资本化利息特殊处理
			if ci.Name == "资本化利息" {
				item := schema.ProjCostItem{}
				item.CostID = ci.RecordID
				item.ProjectID = projectID
				//保存成本
				_, err = a.Create(ctx, item)
				if err != nil {
					return 0, 0, err
				}
				return 0, 0, nil
			}

			if ci.Children != nil || len(ci.Children) == 0 { //没有下级
				item := schema.ProjCostItem{}
				item.CostID = ci.RecordID
				item.ProjectID = projectID

				//取业态单价
				cbqp := schema.CostBusinessQueryParam{}
				cbqp.CostID = ci.RecordID
				cbqr, err := a.CostBusinessModel.Query(ctx, cbqp)

				pcbList := []*schema.ProjCostBusiness{}
				//计算总价
				for _, v := range pbfqr.Data {
					for _, w := range cbqr.Data {
						if v.BusinessFormatID == w.BusinessID {
							pcb := new(schema.ProjCostBusiness)
							pcb.UnitPrice = w.UnitPrice
							pcb.ProjBusinessID = v.RecordID
							pcbList = append(pcbList, pcb)
							item.Price += w.UnitPrice * v.FloorArea
							break
						}
					}
				}
				item.BusinessList = pcbList

				item.TaxPrice, item.TaxRate, err = GetTaxPrice(ctx,
					a.TaxCalculationModel, item.Price, ci.TaxID, 0)
				if err != nil {
					return 0, 0, err
				}

				//保存成本
				_, err = a.Create(ctx, item)
				if err != nil {
					return 0, 0, err
				}
				return item.Price, item.TaxPrice, nil
			} else { //存在下级

				item := schema.ProjCostItem{}
				item.CostID = ci.RecordID
				item.ProjectID = projectID

				for _, v := range ci.Children {
					total, tax, err := create(v)
					if err != nil {
						return 0, 0, err
					}
					item.Price += total
					item.TaxPrice += tax
				}
				//保存成本
				_, err = a.Create(ctx, item)
				if err != nil {
					return 0, 0, err
				}
				return item.Price, item.TaxPrice, nil
			}
			return 0, 0, nil
		}

		//执行
		for _, v := range temp {
			_, _, err = create(v)
			if err != nil {
				return err
			}
		}

		return nil
	})

}

// QueryTree 查询数据
func (a *ProjCostItem) QueryTree(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (schema.ProjCostItemShows, error) {

	//获取列表
	shows, err := a.ProjCostItemModel.QueryShow(ctx, params)
	if err != nil {
		return nil, err
	}

	//整理列表
	result := schema.ProjCostItemShows{}
	for _, v := range shows {
		if v.CostParentID == "" {
			result = append(result, v)
		} else {
			for _, k := range shows {
				if k.CostID == v.CostID {
					k.Children = append(k.Children, v)
				}
			}
		}

	}
	var check func(t *schema.ProjCostItemShow) (bool, error)

	check = func(t *schema.ProjCostItemShow) (bool, error) {
		var b = false
		var hasc = false
		if t.RecordID != "" {
			b = true
		}
		for _, v := range t.Children {
			i, _ := check(v)
			if i {
				hasc = true
			}
		}
		if b && !hasc {
			ps := schema.ProjCostBusinessQueryParam{}
			ps.ProjCostID = t.RecordID
			pcbqr, err := a.ProjCostBusinessModel.Query(ctx, ps)
			if err != nil {
				return b, err
			}
			t.BusinessList = pcbqr.Data
		}
		return b, nil
	}

	for _, v := range result {
		check(v)
	}

	return result, nil

	// if v.RecordID != "" {
	// 		//填写各业态单价
	// 		ps := schema.ProjCostBusinessQueryParam{}
	// 		ps.ProjCostID = v.RecordID
	// 		pcbqr, err := a.ProjCostBusinessModel.Query(ctx, ps)
	// 		if err != nil {
	// 			return nil, err
	// 		}
	// 		v.BusinessList = pcbqr.Data
	// 	}

	// // 获取模板
	// temp, err := GetCostTemplate(ctx, a.CostItemModel)
	// if err != nil {
	// 	return nil, err
	// }

	// //获取列表
	// pciqr, err := a.ProjCostItemModel.Query(ctx, params)
	// if err != nil {
	// 	return nil, err
	// }
	// //整合数据
	// var check func(t *schema.CostItem) *schema.ProjCostItemShow

	// check = func(t *schema.CostItem) *schema.ProjCostItemShow {
	// 	var show *schema.ProjCostItemShow
	// 	var b = false
	// 	show.CostID = t.RecordID
	// 	show.Label = t.Label
	// 	show.Name = t.Name
	// 	show.CalculateType = t.CalculateType
	// 	show.TaxID = t.TaxID

	// 	for _, v := range pciqr.Data {
	// 		if v.CostID == t.RecordID {
	// 			b = true
	// 			show.RecordID = v.RecordID
	// 			show.ProjectID = v.ProjectID
	// 			show.Price = v.Price
	// 			show.TaxPrice = v.TaxPrice
	// 			show.TaxRate = v.TaxRate
	// 			break
	// 		}
	// 	}

	// 	if len(t.Children) > 0 { //如果有下级
	// 		for _, v := range t.Children {
	// 			item := check(v)
	// 			show.Children = append(show.Children, item)
	// 		}
	// 	} else if b {
	// 		ps := schema.ProjCostBusinessQueryParam{}
	// 		ps.ProjCostID = show.RecordID
	// 		pcbqr, err := a.ProjCostBusinessModel.Query(ctx, ps)
	// 		if err != nil {
	// 			return show
	// 		}
	// 		show.BusinessList = pcbqr.Data
	// 	}

	// 	return show
	// }
	// result := []*schema.ProjCostItemShow{}
	// for _, v := range temp {
	// 	item := check(v)
	// 	result = append(result, item)
	// }

}

func (a *ProjCostItem) Query(ctx context.Context, params schema.ProjCostItemQueryParam, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItemQueryResult, error) {
	return a.ProjCostItemModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ProjCostItem) Get(ctx context.Context, recordID string, opts ...schema.ProjCostItemQueryOptions) (*schema.ProjCostItem, error) {
	item, err := a.ProjCostItemModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	return item, nil
}

func (a *ProjCostItem) getUpdate(ctx context.Context, recordID string) (*schema.ProjCostItem, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ProjCostItem) Create(ctx context.Context, item schema.ProjCostItem) (*schema.ProjCostItem, error) {
	item.RecordID = util.MustUUID()
	err := ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		if err := a.ProjCostItemModel.Create(ctx, item); err != nil {
			return err
		}
		if err := a.renew(ctx, item.ProjectID); err != nil {
			return err
		}
		for _, v := range item.BusinessList {
			err = a.ProjCostBusinessModel.Create(*v)
			if err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ProjCostItem) Update(ctx context.Context, recordID string, item schema.ProjCostItem) (*schema.ProjCostItem, error) {
	oldItem, err := a.ProjCostItemModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ProjCostItemModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ProjCostItem) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ProjCostItemModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ProjCostItemModel.Delete(ctx, recordID)
}

// 刷新项目成本项
func (a *ProjCostItem) Renew(ctx context.Context, projectID string) error {
	return ExecTrans(ctx, a.TransModel, func(ctx context.Context) error {
		return a.renew(ctx, projectID)
	})
}

func (a *ProjCostItem) renew(ctx context.Context, projectID string) error {
	//获取列表
	ps := schema.ProjCostItemQueryParam{}
	ps.ProjectID = projectID
	shows, err := a.ProjCostItemModel.QueryShow(ctx, ps)
	if err != nil {
		return err
	}

	//整理列表
	result := schema.ProjCostItemShows{}
	for _, v := range shows {
		if v.CostParentID == "" {
			result = append(result, v)
		} else {
			for _, k := range shows {
				if k.CostID == v.CostID {
					k.Children = append(k.Children, v)
				}
			}
		}

	}

	// 获取项目业态面积
	pbfqp := schema.ProjBusinessFormatQueryParam{}
	pbfqp.ProjectID = projectID
	pbfqr, err := a.ProjBusinessFormatModel.Query(ctx, pbfqp)
	if err != nil {
		return err
	}

	// 整理数据
	var check func(t *schema.ProjCostItemShow) (bool, float64, float64, error)

	check = func(t *schema.ProjCostItemShow) (bool, float64, float64, error) {
		var b = false
		var hasc = false
		var price float64
		var tax float64
		if t.RecordID != "" {
			b = true
		} else {
			return false, 0, 0, nil
		}
		for _, v := range t.Children {
			i, pr, ta, err := check(v)
			if err != nil {
				return i, pr, ta, err
			}
			if i {
				price += pr
				tax += tax
				hasc = true
			}
		}
		if !hasc { //没有下级，整理各个业态信息
			if t.CalculateType == 1 { //单价算总价
				ps := schema.ProjCostBusinessQueryParam{}
				ps.ProjCostID = t.RecordID
				pcbqr, err := a.ProjCostBusinessModel.Query(ctx, ps)
				if err != nil {
					return b, t.Price, t.TaxPrice, err
				}
				//更新业态信息
				//旧业态信息列表
				oldm := map[string]int{}
				for _, v := range pcbqr.Data {
					oldm[v.RecordID] = 0
				}
				for _, v := range pbfqr.Data { //整理成本项下各业态信息
					var b = true
					for _, w := range pcbqr.Data {
						if w.ProjBusinessID == v.RecordID {
							price += w.UnitPrice * v.FloorArea
							b = false
							oldm[w.RecordID] = 1
							break
						}
					}
					if b { //需要新增业态信息
						item := schema.ProjCostBusiness{}
						item.ProjBusinessID = v.RecordID
						item.ProjCostID = t.RecordID
						cbqp := schema.CostBusinessQueryParam{}
						cbqp.CostID = t.CostID
						cbqp.BusinessID = v.BusinessFormatID
						cbqr, err := a.CostBusinessModel.Query(ctx, cbqp)
						if err != nil {
							return b, t.Price, t.TaxPrice, err
						}
						if len(cbqr.Data) == 1 {
							item.UnitPrice = cbqr.Data[0].UnitPrice
						}
						if err := a.ProjCostBusinessModel.Create(ctx, item); err != nil {
							return b, t.Price, t.TaxPrice, err
						}
						price += item.UnitPrice * v.FloorArea
					}
					//删除旧业态信息
					for k, v := range oldm {
						if v == 0 {
							if err := a.ProjCostBusinessModel.Delete(ctx, k); err != nil {
								return b, t.Price, t.TaxPrice, err
							}
						}
					}
				}
			} else {
				price = t.Price
			}

			tax, _, err = GetTaxPrice(ctx, a.TaxCalculationModel, price, t.TaxID, t.TaxRate)
			if err != nil {
				return b, t.Price, t.TaxPrice, err
			}
		}

		//比对成本项数值
		if t.Price != price || t.TaxPrice != tax {
			//更新成本项
			item, err := a.ProjCostItemModel.Get(ctx, t.RecordID)
			if err != nil {
				return b, t.Price, t.TaxPrice, err
			}
			item.Price = price
			item.TaxPrice = tax

			if err := a.ProjCostItemModel.Update(ctx, item.RecordID, *item); err != nil {
				return b, t.Price, t.TaxPrice, err
			}
			t.Price = price
			t.TaxPrice = tax
		}
		return b, t.Price, t.TaxPrice, nil
	}
	for _, v := range result {
		check(v)
	}
	return nil
}