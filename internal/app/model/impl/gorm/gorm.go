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
		new(entity.Plot),
		new(entity.AssetGroup),
		new(entity.AssetGroupDetail),
		new(entity.TAssetData),
		new(entity.BusinessFormat),
		new(entity.CostBusiness),
		new(entity.CostItem),
		new(entity.Expenditure),
		new(entity.LandAppreciationTax),
		new(entity.PcProject),
		new(entity.ProjBusinessFormat),
		new(entity.ProjCapitalizedHis),
		new(entity.ProjCapitalizedInterest),
		new(entity.ProjCostBusiness),
		new(entity.ProjCostHis),
		new(entity.ProjCostItem),
		new(entity.ProjDeliveryStandard),
		new(entity.ProjExpendCost),
		new(entity.ProjExpenditureTime),
		new(entity.ProjExpenditure),
		new(entity.ProjFile),
		new(entity.ProjIncomeCalculation),
		new(entity.ProjSalesHis),
		new(entity.ProjSalesPlan),
		new(entity.TaxCalculation),
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
	container.Provide(imodel.NewPlot, dig.As(new(model.IPlot)))
	container.Provide(imodel.NewStatistic, dig.As(new(model.IStatistic)))
	container.Provide(imodel.NewAssetGroup, dig.As(new(model.IAssetGroup)))
	container.Provide(imodel.NewAssetGroupDetail, dig.As(new(model.IAssetGroupDetail)))
	container.Provide(imodel.NewTAssetData, dig.As(new(model.ITAssetData)))
	container.Provide(imodel.NewBusinessFormat, dig.As(new(model.IBusinessFormat)))
	container.Provide(imodel.NewCostBusiness, dig.As(new(model.ICostBusiness)))
	container.Provide(imodel.NewCostItem, dig.As(new(model.ICostItem)))
	container.Provide(imodel.NewExpenditure, dig.As(new(model.IExpenditure)))
	container.Provide(imodel.NewLandAppreciationTax, dig.As(new(model.ILandAppreciationTax)))
	container.Provide(imodel.NewPcProject, dig.As(new(model.IPcProject)))
	container.Provide(imodel.NewProjBusinessFormat, dig.As(new(model.IProjBusinessFormat)))
	container.Provide(imodel.NewProjCapitalizedHis, dig.As(new(model.IProjCapitalizedHis)))
	container.Provide(imodel.NewProjCapitalizedInterest, dig.As(new(model.IProjCapitalizedInterest)))
	container.Provide(imodel.NewProjCostBusiness, dig.As(new(model.IProjCostBusiness)))
	container.Provide(imodel.NewProjCostHis, dig.As(new(model.IProjCostHis)))
	container.Provide(imodel.NewProjCostItem, dig.As(new(model.IProjCostItem)))
	container.Provide(imodel.NewProjDeliveryStandard, dig.As(new(model.IProjDeliveryStandard)))
	container.Provide(imodel.NewProjExpendCost, dig.As(new(model.IProjExpendCost)))
	container.Provide(imodel.NewProjExpenditureTime, dig.As(new(model.IProjExpenditureTime)))
	container.Provide(imodel.NewProjExpenditure, dig.As(new(model.IProjExpenditure)))
	container.Provide(imodel.NewProjFile, dig.As(new(model.IProjFile)))
	container.Provide(imodel.NewProjIncomeCalculation, dig.As(new(model.IProjIncomeCalculation)))
	container.Provide(imodel.NewProjSalesHis, dig.As(new(model.IProjSalesHis)))
	container.Provide(imodel.NewProjSalesPlan, dig.As(new(model.IProjSalesPlan)))
	container.Provide(imodel.NewTaxCalculation, dig.As(new(model.ITaxCalculation)))
	return nil
}
