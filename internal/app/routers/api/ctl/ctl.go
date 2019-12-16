package ctl

import (
	"go.uber.org/dig"
)

// Inject 注入ctl
// 使用方式：
//   container := dig.New()
//   Inject(container)
//   container.Invoke(func(foo *ctl.Demo) {
//   })
func Inject(container *dig.Container) error {
	container.Provide(NewDemo)
	container.Provide(NewLogin)
	container.Provide(NewMenu)
	container.Provide(NewRole)
	container.Provide(NewUser)
	container.Provide(NewDictionary)
	container.Provide(NewSystemParameter)
	container.Provide(NewOrganization)
	container.Provide(NewFile)
	container.Provide(NewProject)
	container.Provide(NewOfficeBuilding)
	container.Provide(NewShop)
	container.Provide(NewHotel)
	container.Provide(NewApartment)
	container.Provide(NewAgriculturalMarket)
	container.Provide(NewCarChanger)
	container.Provide(NewFactoryBuilding)
	container.Provide(NewPlot)
	container.Provide(NewStatistic)
	container.Provide(NewBusinessFormat)
	container.Provide(NewCostItem)
	container.Provide(NewExpenditure)
	container.Provide(NewLandAppreciationTax)
	container.Provide(NewPcProject)
	container.Provide(NewProjBusinessFormat)
	container.Provide(NewProjCapitalizedHis)
	container.Provide(NewProjCapitalizedInterest)
	container.Provide(NewProjCostHis)
	container.Provide(NewProjCostItem)
	container.Provide(NewProjDeliveryStandard)
	container.Provide(NewProjExpenditure)
	container.Provide(NewProjFile)
	container.Provide(NewProjIncomeCalculation)
	container.Provide(NewProjSalesHis)
	container.Provide(NewProjSalesPlan)
	container.Provide(NewTaxCalculation)
	container.Provide(NewComContract)
	container.Provide(NewSettlementRecord)
	container.Provide(NewComContractAlter)
	container.Provide(NewContractPlanningTemplate)
	container.Provide(NewBusinessPartner)
	container.Provide(NewProjContractPlanning)
	return nil
}
