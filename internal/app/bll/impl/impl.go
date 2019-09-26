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
	return nil
}
