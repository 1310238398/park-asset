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
	return nil
}
