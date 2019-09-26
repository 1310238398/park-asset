package gorm

import (
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	imodel "gxt-park-assets/internal/app/model/impl/gorm/internal/model"
	"gxt-park-assets/pkg/gormplus"

	"go.uber.org/dig"
)

// SetTablePrefix 设定表名前缀
func SetTablePrefix(prefix string) {
	entity.SetTablePrefix(prefix)
}

// AutoMigrate 自动映射数据表
func AutoMigrate(db *gormplus.DB) error {
	return db.AutoMigrate(
		new(entity.Demo),
		new(entity.User),
		new(entity.UserRole),
		new(entity.Role),
		new(entity.RoleMenu),
		new(entity.Menu),
		new(entity.MenuAction),
		new(entity.MenuResource),
		new(entity.Dictionary),
		new(entity.SystemParameter),
		new(entity.Organization),
		new(entity.Project),
		new(entity.OfficeBuilding),
		new(entity.Asset),
		new(entity.AssetHistory),
		new(entity.TenantCustomer),
		new(entity.Withdrawal),
		new(entity.Contract),
		new(entity.RentDetail),
		new(entity.AssetRentPayment),
		new(entity.Shop),
		new(entity.Hotel),
		new(entity.Apartment),
		new(entity.AgriculturalMarket),
		new(entity.CarChanger),
		new(entity.FactoryBuilding),
	).Error
}

// Inject 注入gorm实现
// 使用方式：
//   container := dig.New()
//   Inject(container)
//   container.Invoke(func(foo IDemo) {
//   })
func Inject(container *dig.Container) error {
	container.Provide(imodel.NewTrans, dig.As(new(model.ITrans)))
	container.Provide(imodel.NewDemo, dig.As(new(model.IDemo)))
	container.Provide(imodel.NewMenu, dig.As(new(model.IMenu)))
	container.Provide(imodel.NewRole, dig.As(new(model.IRole)))
	container.Provide(imodel.NewUser, dig.As(new(model.IUser)))
	container.Provide(imodel.NewDictionary, dig.As(new(model.IDictionary)))
	container.Provide(imodel.NewSystemParameter, dig.As(new(model.ISystemParameter)))
	container.Provide(imodel.NewOrganization, dig.As(new(model.IOrganization)))
	container.Provide(imodel.NewProject, dig.As(new(model.IProject)))
	container.Provide(imodel.NewOfficeBuilding, dig.As(new(model.IOfficeBuilding)))
	container.Provide(imodel.NewAsset, dig.As(new(model.IAsset)))
	container.Provide(imodel.NewAssetHistory, dig.As(new(model.IAssetHistory)))
	container.Provide(imodel.NewTenantCustomer, dig.As(new(model.ITenantCustomer)))
	container.Provide(imodel.NewWithdrawal, dig.As(new(model.IWithdrawal)))
	container.Provide(imodel.NewContract, dig.As(new(model.IContract)))
	container.Provide(imodel.NewRentDetail, dig.As(new(model.IRentDetail)))
	container.Provide(imodel.NewAssetRentPayment, dig.As(new(model.IAssetRentPayment)))
	container.Provide(imodel.NewShop, dig.As(new(model.IShop)))
	container.Provide(imodel.NewHotel, dig.As(new(model.IHotel)))
	container.Provide(imodel.NewApartment, dig.As(new(model.IApartment)))
	container.Provide(imodel.NewAgriculturalMarket, dig.As(new(model.IAgriculturalMarket)))
	container.Provide(imodel.NewCarChanger, dig.As(new(model.ICarChanger)))
	container.Provide(imodel.NewFactoryBuilding, dig.As(new(model.IFactoryBuilding)))
	return nil
}
