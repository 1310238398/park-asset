package impl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/bll/impl/internal"

	"go.uber.org/dig"
)

// Inject 注入bll实现
// 使用方式：
//   container := dig.New()
//   Inject(container)
//   container.Invoke(func(foo IDemo) {
//   })
func Inject(container *dig.Container) error {
	container.Provide(internal.NewTrans, dig.As(new(bll.ITrans)))
	container.Provide(internal.NewDemo, dig.As(new(bll.IDemo)))
	container.Provide(internal.NewLogin, dig.As(new(bll.ILogin)))
	container.Provide(internal.NewMenu, dig.As(new(bll.IMenu)))
	container.Provide(internal.NewRole, dig.As(new(bll.IRole)))
	container.Provide(internal.NewUser, dig.As(new(bll.IUser)))
	container.Provide(internal.NewDictionary, dig.As(new(bll.IDictionary)))
	container.Provide(internal.NewSystemParameter, dig.As(new(bll.ISystemParameter)))
	container.Provide(internal.NewOrganization, dig.As(new(bll.IOrganization)))
	container.Provide(internal.NewFile, dig.As(new(bll.IFile)))
	container.Provide(internal.NewProject, dig.As(new(bll.IProject)))
	container.Provide(internal.NewOfficeBuilding, dig.As(new(bll.IOfficeBuilding)))
	container.Provide(internal.NewShop, dig.As(new(bll.IShop)))
	container.Provide(internal.NewHotel, dig.As(new(bll.IHotel)))
	container.Provide(internal.NewApartment, dig.As(new(bll.IApartment)))
	container.Provide(internal.NewAgriculturalMarket, dig.As(new(bll.IAgriculturalMarket)))
	container.Provide(internal.NewCarChanger, dig.As(new(bll.ICarChanger)))
	container.Provide(internal.NewFactoryBuilding, dig.As(new(bll.IFactoryBuilding)))
	container.Provide(internal.NewPlot, dig.As(new(bll.IPlot)))
	container.Provide(internal.NewStatistic, dig.As(new(bll.IStatistic)))
	container.Provide(internal.NewBusinessFormat, dig.As(new(bll.IBusinessFormat)))
	container.Provide(internal.NewCostBusiness, dig.As(new(bll.ICostBusiness)))
	container.Provide(internal.NewCostItem, dig.As(new(bll.ICostItem)))
	container.Provide(internal.NewExpenditure, dig.As(new(bll.IExpenditure)))
	container.Provide(internal.NewLandAppreciationTax, dig.As(new(bll.ILandAppreciationTax)))
	container.Provide(internal.NewPcProject, dig.As(new(bll.IPcProject)))
	container.Provide(internal.NewProjBusinessFormat, dig.As(new(bll.IProjBusinessFormat)))
	container.Provide(internal.NewProjCapitalizedHis, dig.As(new(bll.IProjCapitalizedHis)))
	container.Provide(internal.NewProjCapitalizedInterest, dig.As(new(bll.IProjCapitalizedInterest)))
	container.Provide(internal.NewProjCostBusiness, dig.As(new(bll.IProjCostBusiness)))
	container.Provide(internal.NewProjCostHis, dig.As(new(bll.IProjCostHis)))
	container.Provide(internal.NewProjCostItem, dig.As(new(bll.IProjCostItem)))
	container.Provide(internal.NewProjDeliveryStandard, dig.As(new(bll.IProjDeliveryStandard)))
	container.Provide(internal.NewProjExpendCost, dig.As(new(bll.IProjExpendCost)))
	container.Provide(internal.NewProjExpenditureTime, dig.As(new(bll.IProjExpenditureTime)))
	container.Provide(internal.NewProjExpenditure, dig.As(new(bll.IProjExpenditure)))
	container.Provide(internal.NewProjFile, dig.As(new(bll.IProjFile)))
	container.Provide(internal.NewProjIncomeCalculation, dig.As(new(bll.IProjIncomeCalculation)))
	container.Provide(internal.NewProjSalesHis, dig.As(new(bll.IProjSalesHis)))
	container.Provide(internal.NewProjSalesPlan, dig.As(new(bll.IProjSalesPlan)))
	container.Provide(internal.NewTaxCalculation, dig.As(new(bll.ITaxCalculation)))
	container.Provide(internal.NewContractPlanningTemplate, dig.As(new(bll.IContractPlanningTemplate)))
	container.Provide(internal.NewBusinessPartner, dig.As(new(bll.IBusinessPartner)))
	container.Provide(internal.NewProjContractPlanning, dig.As(new(bll.IProjContractPlanning)))
	return nil
}
