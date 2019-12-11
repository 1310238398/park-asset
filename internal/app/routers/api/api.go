package api

import (
	"gxt-park-assets/internal/app/middleware"
	"gxt-park-assets/internal/app/routers/api/ctl"
	"gxt-park-assets/pkg/auth"

	"github.com/casbin/casbin"
	"github.com/gin-gonic/gin"
	"go.uber.org/dig"
)

// RegisterRouter 注册/api路由
func RegisterRouter(app *gin.Engine, container *dig.Container) error {
	err := ctl.Inject(container)
	if err != nil {
		return err
	}

	return container.Invoke(func(
		a auth.Auther,
		e *casbin.Enforcer,
		cDemo *ctl.Demo,
		cLogin *ctl.Login,
		cMenu *ctl.Menu,
		cRole *ctl.Role,
		cUser *ctl.User,
		cDictionary *ctl.Dictionary,
		cSystemParameter *ctl.SystemParameter,
		cOrganization *ctl.Organization,
		cFile *ctl.File,
		cProject *ctl.Project,
		cOfficeBuilding *ctl.OfficeBuilding,
		cShop *ctl.Shop,
		cHotel *ctl.Hotel,
		cApartment *ctl.Apartment,
		cAgriculturalMarket *ctl.AgriculturalMarket,
		cCarChanger *ctl.CarChanger,
		cFactoryBuilding *ctl.FactoryBuilding,
		cPlot *ctl.Plot,
		cStatistic *ctl.Statistic,
		cBusinessFormat *ctl.BusinessFormat,
		cCostItem *ctl.CostItem,
		cExpenditure *ctl.Expenditure,
		cLandAppreciationTax *ctl.LandAppreciationTax,
		cPcProject *ctl.PcProject,
		cProjBusinessFormat *ctl.ProjBusinessFormat,
		cProjCapitalizedHis *ctl.ProjCapitalizedHis,
		cProjCapitalizedInterest *ctl.ProjCapitalizedInterest,
		cProjCostHis *ctl.ProjCostHis,
		cProjCostItem *ctl.ProjCostItem,
		cProjDeliveryStandard *ctl.ProjDeliveryStandard,
		cProjExpenditure *ctl.ProjExpenditure,
		cProjFile *ctl.ProjFile,
		cProjIncomeCalculation *ctl.ProjIncomeCalculation,
		cProjSalesHis *ctl.ProjSalesHis,
		cProjSalesPlan *ctl.ProjSalesPlan,
		cTaxCalculation *ctl.TaxCalculation,
	) error {

		g := app.Group("/api")

		// 用户身份授权
		g.Use(middleware.UserAuthMiddleware(
			a,
			cUser.UserBll,
			middleware.AllowMethodAndPathPrefixSkipper(
				middleware.JoinRouter("GET", "/api/v1/pub/login"),
				middleware.JoinRouter("GET", "/api/v1/pub/statistics"),
				middleware.JoinRouter("POST", "/api/v1/pub/login"),
			),
		))

		// casbin权限校验中间件
		g.Use(middleware.CasbinMiddleware(e,
			middleware.AllowMethodAndPathPrefixSkipper(
				middleware.JoinRouter("GET", "/api/v1/pub"),
				middleware.JoinRouter("POST", "/api/v1/pub"),
			),
		))

		// 请求频率限制中间件
		g.Use(middleware.RateLimiterMiddleware())

		v1 := g.Group("/v1")
		{
			pub := v1.Group("/pub")
			{
				// 注册/api/v1/pub/login
				pub.GET("/login/captchaid", cLogin.GetCaptcha)
				pub.GET("/login/captcha", cLogin.ResCaptcha)
				pub.POST("/login", cLogin.Login)
				pub.POST("/login/exit", cLogin.Logout)

				// 注册/api/v1/pub/refresh_token
				pub.POST("/refresh_token", cLogin.RefreshToken)

				// 注册/api/v1/pub/current
				pub.PUT("/current/password", cLogin.UpdatePassword)
				pub.GET("/current/user", cLogin.GetUserInfo)
				pub.GET("/current/menutree", cLogin.QueryUserMenuTree)

				// 注册/api/v1/pub/statistics
				pub.GET("/statistics/plots", cPlot.Query)
				pub.GET("/statistics/income_classification", cStatistic.QueryIncomeClassification)
				pub.GET("/statistics/operational_indicator", cStatistic.QueryOperationalIndicator)
				pub.GET("/statistics/overview", cStatistic.QueryOverview)
				pub.GET("/statistics/quarter_financiall_indicator", cStatistic.QueryQuarterFinanciallIndicator)
				pub.GET("/statistics/financiall_indicator", cStatistic.QueryFinanciallIndicator)
				pub.GET("/statistics/company", cStatistic.QueryCompany)
			}

			// 注册/api/v1/demos
			v1.GET("/demos", cDemo.Query)
			v1.GET("/demos/:id", cDemo.Get)
			v1.POST("/demos", cDemo.Create)
			v1.PUT("/demos/:id", cDemo.Update)
			v1.DELETE("/demos/:id", cDemo.Delete)
			v1.PATCH("/demos/:id/enable", cDemo.Enable)
			v1.PATCH("/demos/:id/disable", cDemo.Disable)

			// 注册/api/v1/menus
			v1.GET("/menus", cMenu.Query)
			v1.GET("/menus/:id", cMenu.Get)
			v1.POST("/menus", cMenu.Create)
			v1.PUT("/menus/:id", cMenu.Update)
			v1.DELETE("/menus/:id", cMenu.Delete)

			// 注册/api/v1/roles
			v1.GET("/roles", cRole.Query)
			v1.GET("/roles/:id", cRole.Get)
			v1.POST("/roles", cRole.Create)
			v1.PUT("/roles/:id", cRole.Update)
			v1.DELETE("/roles/:id", cRole.Delete)

			// 注册/api/v1/users
			v1.GET("/users", cUser.Query)
			v1.GET("/users/:id", cUser.Get)
			v1.POST("/users", cUser.Create)
			v1.PUT("/users/:id", cUser.Update)
			v1.DELETE("/users/:id", cUser.Delete)
			v1.PATCH("/users/:id/enable", cUser.Enable)
			v1.PATCH("/users/:id/disable", cUser.Disable)

			// 注册/api/v1/dictionaries
			v1.GET("/dictionaries", cDictionary.Query)
			v1.GET("/dictionaries/:id", cDictionary.Get)
			v1.POST("/dictionaries", cDictionary.Create)
			v1.PUT("/dictionaries/:id", cDictionary.Update)
			v1.DELETE("/dictionaries/:id", cDictionary.Delete)

			// 注册/api/v1/system_parameters
			v1.GET("/system_parameters", cSystemParameter.Query)
			v1.GET("/system_parameters/:id", cSystemParameter.Get)
			v1.POST("/system_parameters", cSystemParameter.Create)
			v1.PUT("/system_parameters/:id", cSystemParameter.Update)
			v1.DELETE("/system_parameters/:id", cSystemParameter.Delete)
			v1.PATCH("/system_parameters/:id/enable", cSystemParameter.Enable)
			v1.PATCH("/system_parameters/:id/disable", cSystemParameter.Disable)

			// 注册/api/v1/organizations
			v1.GET("/organizations", cOrganization.Query)
			v1.GET("/organizations/:id", cOrganization.Get)
			v1.POST("/organizations", cOrganization.Create)
			v1.PUT("/organizations/:id", cOrganization.Update)
			v1.DELETE("/organizations/:id", cOrganization.Delete)

			// 注册/api/v1/files
			v1.POST("/files", cFile.Upload)

			// 注册/api/v1/projects
			v1.GET("/projects", cProject.Query)
			v1.GET("/projects/:id", cProject.Get)
			v1.POST("/projects", cProject.Create)
			v1.PUT("/projects/:id", cProject.Update)
			v1.DELETE("/projects/:id", cProject.Delete)

			// 注册/api/v1/office_buildings
			v1.GET("/office_buildings", cOfficeBuilding.Query)
			v1.GET("/office_buildings/:id", cOfficeBuilding.Get)
			v1.POST("/office_buildings", cOfficeBuilding.Create)
			v1.PUT("/office_buildings/:id", cOfficeBuilding.Update)
			v1.DELETE("/office_buildings/:id", cOfficeBuilding.Delete)

			// 注册/api/v1/shops
			v1.GET("/shops", cShop.Query)
			v1.GET("/shops/:id", cShop.Get)
			v1.POST("/shops", cShop.Create)
			v1.PUT("/shops/:id", cShop.Update)
			v1.DELETE("/shops/:id", cShop.Delete)

			// 注册/api/v1/hotels
			v1.GET("/hotels", cHotel.Query)
			v1.GET("/hotels/:id", cHotel.Get)
			v1.POST("/hotels", cHotel.Create)
			v1.PUT("/hotels/:id", cHotel.Update)
			v1.DELETE("/hotels/:id", cHotel.Delete)

			// 注册/api/v1/apartments
			v1.GET("/apartments", cApartment.Query)
			v1.GET("/apartments/:id", cApartment.Get)
			v1.POST("/apartments", cApartment.Create)
			v1.PUT("/apartments/:id", cApartment.Update)
			v1.DELETE("/apartments/:id", cApartment.Delete)

			// 注册/api/v1/agricultural_markets
			v1.GET("/agricultural_markets", cAgriculturalMarket.Query)
			v1.GET("/agricultural_markets/:id", cAgriculturalMarket.Get)
			v1.POST("/agricultural_markets", cAgriculturalMarket.Create)
			v1.PUT("/agricultural_markets/:id", cAgriculturalMarket.Update)
			v1.DELETE("/agricultural_markets/:id", cAgriculturalMarket.Delete)

			// 注册/api/v1/car_changers
			v1.GET("/car_changers", cCarChanger.Query)
			v1.GET("/car_changers/:id", cCarChanger.Get)
			v1.POST("/car_changers", cCarChanger.Create)
			v1.PUT("/car_changers/:id", cCarChanger.Update)
			v1.DELETE("/car_changers/:id", cCarChanger.Delete)

			// 注册/api/v1/factory_buildings
			v1.GET("/factory_buildings", cFactoryBuilding.Query)
			v1.GET("/factory_buildings/:id", cFactoryBuilding.Get)
			v1.POST("/factory_buildings", cFactoryBuilding.Create)
			v1.PUT("/factory_buildings/:id", cFactoryBuilding.Update)
			v1.DELETE("/factory_buildings/:id", cFactoryBuilding.Delete)

			// 注册/api/v1/plots
			v1.GET("/plots", cPlot.Query)
			v1.GET("/plots/:id", cPlot.Get)
			v1.POST("/plots", cPlot.Create)
			v1.PUT("/plots/:id", cPlot.Update)
			v1.DELETE("/plots/:id", cPlot.Delete)

			// 注册/api/v1/statistics
			v1.GET("/statistics/project", cStatistic.QueryProject)
			v1.GET("/statistics/project/export", cStatistic.ExportProject)
			v1.GET("/statistics/project/name", cStatistic.QueryProjectName)
			v1.GET("/statistics/income_classification", cStatistic.QueryIncomeClassification)
			v1.GET("/statistics/operational_indicator", cStatistic.QueryOperationalIndicator)
			v1.GET("/statistics/overview", cStatistic.QueryOverview)
			v1.GET("/statistics/quarter_financiall_indicator", cStatistic.QueryQuarterFinanciallIndicator)
			v1.GET("/statistics/financiall_indicator", cStatistic.QueryFinanciallIndicator)
			v1.GET("/statistics/company", cStatistic.QueryCompany)

			// 注册/api/v1/business-formats 业态相关
			gBusinessFormat := v1.Group("business-formats")
			{
				gBusinessFormat.GET("", cBusinessFormat.Query)
				gBusinessFormat.GET(":id", cBusinessFormat.Get)
				gBusinessFormat.POST("", cBusinessFormat.Create)
				gBusinessFormat.PUT(":id", cBusinessFormat.Update)
				gBusinessFormat.DELETE(":id", cBusinessFormat.Delete)
			}

			// 注册/api/v1/cost-items
			gCostItem := v1.Group("cost-items")
			{
				gCostItem.GET("", cCostItem.Query)
				gCostItem.GET(":id", cCostItem.Get)
				gCostItem.POST("", cCostItem.Create)
				gCostItem.PUT(":id", cCostItem.Update)
				gCostItem.DELETE(":id", cCostItem.Delete)
			}

			// 注册/api/v1/expenditures
			gExpenditure := v1.Group("expenditures")
			{
				gExpenditure.GET("", cExpenditure.Query)
				gExpenditure.GET(":id", cExpenditure.Get)
				gExpenditure.POST("", cExpenditure.Create)
				gExpenditure.PUT(":id", cExpenditure.Update)
				gExpenditure.DELETE(":id", cExpenditure.Delete)
			}

			// 注册/api/v1/land-appreciation-taxes
			gLandAppreciationTax := v1.Group("land-appreciation-taxes")
			{
				gLandAppreciationTax.GET("", cLandAppreciationTax.Query)
				gLandAppreciationTax.GET(":id", cLandAppreciationTax.Get)
				gLandAppreciationTax.POST("", cLandAppreciationTax.Create)
				gLandAppreciationTax.PUT(":id", cLandAppreciationTax.Update)
				gLandAppreciationTax.DELETE(":id", cLandAppreciationTax.Delete)
			}

			// 注册/api/v1/pc-projects
			gPcProject := v1.Group("pc-projects")
			{
				gPcProject.GET("", cPcProject.Query)
				gPcProject.GET(":id", cPcProject.Get)
				gPcProject.POST("", cPcProject.Create)
				gPcProject.PUT(":id", cPcProject.Update)
				gPcProject.DELETE(":id", cPcProject.Delete)
			}

			// 注册/api/v1/proj-business-formats
			gProjBusinessFormat := v1.Group("proj-business-formats")
			{
				gProjBusinessFormat.GET("", cProjBusinessFormat.QueryList)
				gProjBusinessFormat.GET(":id", cProjBusinessFormat.Get)
				gProjBusinessFormat.POST("", cProjBusinessFormat.Create)
				gProjBusinessFormat.PUT(":id", cProjBusinessFormat.Update)
				gProjBusinessFormat.DELETE(":id", cProjBusinessFormat.Delete)
				gProjBusinessFormat.POST("update_list", cProjBusinessFormat.UpdateList)

			}

			// 注册/api/v1/proj-capitalized-his
			gProjCapitalizedHis := v1.Group("proj-capitalized-his")
			{
				gProjCapitalizedHis.GET("", cProjCapitalizedHis.Query)
				gProjCapitalizedHis.GET(":id", cProjCapitalizedHis.Get)
				gProjCapitalizedHis.POST("", cProjCapitalizedHis.Create)
				gProjCapitalizedHis.PUT(":id", cProjCapitalizedHis.Update)
				gProjCapitalizedHis.DELETE(":id", cProjCapitalizedHis.Delete)
			}

			// 注册/api/v1/proj-capitalized-interests
			gProjCapitalizedInterest := v1.Group("proj-capitalized-interests")
			{
				gProjCapitalizedInterest.GET("", cProjCapitalizedInterest.Query)
				gProjCapitalizedInterest.GET(":id", cProjCapitalizedInterest.Get)
				gProjCapitalizedInterest.POST("", cProjCapitalizedInterest.Create)
				gProjCapitalizedInterest.PUT("", cProjCapitalizedInterest.UpdateYear)
				gProjCapitalizedInterest.PUT(":id", cProjCapitalizedInterest.Update)
				gProjCapitalizedInterest.DELETE(":id", cProjCapitalizedInterest.Delete)
			}

			// 注册/api/v1/proj-cost-his
			gProjCostHis := v1.Group("proj-cost-his")
			{
				gProjCostHis.GET("", cProjCostHis.Query)
				gProjCostHis.GET(":id", cProjCostHis.Get)
				gProjCostHis.POST("", cProjCostHis.Create)
				gProjCostHis.PUT(":id", cProjCostHis.Update)
				gProjCostHis.DELETE(":id", cProjCostHis.Delete)
			}

			// 注册/api/v1/proj-cost-items
			gProjCostItem := v1.Group("proj-cost-items")
			{
				gProjCostItem.GET("", cProjCostItem.Query)
				gProjCostItem.GET(":id", cProjCostItem.Get)
				gProjCostItem.POST("", cProjCostItem.Create)
				gProjCostItem.PUT(":id", cProjCostItem.Update)
				gProjCostItem.DELETE(":id", cProjCostItem.Delete)
			}

			// 注册/api/v1/proj-delivery-standards
			gProjDeliveryStandard := v1.Group("proj-delivery-standards")
			{
				gProjDeliveryStandard.GET("", cProjDeliveryStandard.Query)
				gProjDeliveryStandard.GET(":id", cProjDeliveryStandard.Get)
				gProjDeliveryStandard.POST("", cProjDeliveryStandard.Create)
				gProjDeliveryStandard.PUT("", cProjDeliveryStandard.UpdateAll)
				gProjDeliveryStandard.PUT(":id", cProjDeliveryStandard.Update)
				gProjDeliveryStandard.DELETE(":id", cProjDeliveryStandard.Delete)
			}

			// 注册/api/v1/proj-expenditures
			gProjExpenditure := v1.Group("proj-expenditures")
			{
				gProjExpenditure.GET("", cProjExpenditure.Query)
				gProjExpenditure.GET(":id", cProjExpenditure.Get)
				gProjExpenditure.POST("", cProjExpenditure.Create)
				gProjExpenditure.PUT(":id", cProjExpenditure.Update)
				gProjExpenditure.DELETE(":id", cProjExpenditure.Delete)
			}

			// 注册/api/v1/proj-files
			gProjFile := v1.Group("proj-files")
			{
				gProjFile.GET("", cProjFile.Query)
				gProjFile.GET(":id", cProjFile.Get)
				gProjFile.POST("", cProjFile.Create)
				gProjFile.PUT(":id", cProjFile.Update)
				gProjFile.DELETE(":id", cProjFile.Delete)
			}

			// 注册/api/v1/proj-income-calculations
			gProjIncomeCalculation := v1.Group("proj-income-calculations")
			{
				gProjIncomeCalculation.GET("", cProjIncomeCalculation.Query)
				gProjIncomeCalculation.GET(":id", cProjIncomeCalculation.Get)
				gProjIncomeCalculation.POST("", cProjIncomeCalculation.Create)
				gProjIncomeCalculation.PUT(":id", cProjIncomeCalculation.Update)
				gProjIncomeCalculation.DELETE(":id", cProjIncomeCalculation.Delete)
				gProjIncomeCalculation.POST("version", cProjIncomeCalculation.CreateVersion)

				// /api/v1/proj-income-calculations/version
			}

			// 注册/api/v1/proj-income-calculations
			gProjVersion := v1.Group("proj-version")
			{
				gProjVersion.GET(":id/compare", cProjIncomeCalculation.QueryVersionCompare)
				gProjVersion.POST(":id", cProjIncomeCalculation.CreateVersion)
				gProjVersion.PUT(":id", cProjIncomeCalculation.UpdateVersion)
				gProjVersion.PUT(":id/apply", cProjIncomeCalculation.Apply)
				gProjVersion.PUT(":id/pass", cProjIncomeCalculation.Pass)
				gProjVersion.PUT(":id/reject", cProjIncomeCalculation.Reject)
			}

			// 注册/api/v1/proj-sales-his
			gProjSalesHis := v1.Group("proj-sales-his")
			{
				gProjSalesHis.GET("", cProjSalesHis.Query)
				gProjSalesHis.GET(":id", cProjSalesHis.Get)
				gProjSalesHis.POST("", cProjSalesHis.Create)
				gProjSalesHis.PUT(":id", cProjSalesHis.Update)
				gProjSalesHis.DELETE(":id", cProjSalesHis.Delete)
			}

			// 注册/api/v1/proj-sales-plans
			gProjSalesPlan := v1.Group("proj-sales-plans")
			{
				gProjSalesPlan.GET("", cProjSalesPlan.Query)
				gProjSalesPlan.GET(":id", cProjSalesPlan.Get)
				gProjSalesPlan.POST("", cProjSalesPlan.Create)
				gProjSalesPlan.PUT(":id", cProjSalesPlan.Update)
				gProjSalesPlan.DELETE(":id", cProjSalesPlan.Delete)
				gProjSalesPlan.POST("list", cProjSalesPlan.CreateList)
				gProjSalesPlan.POST("delete_list", cProjSalesPlan.DeleteList)

			}

			// 注册/api/v1/tax-calculations
			gTaxCalculation := v1.Group("tax-calculations")
			{
				gTaxCalculation.GET("", cTaxCalculation.Query)
				gTaxCalculation.GET(":id", cTaxCalculation.Get)
				gTaxCalculation.POST("", cTaxCalculation.Create)
				gTaxCalculation.PUT(":id", cTaxCalculation.Update)
				gTaxCalculation.DELETE(":id", cTaxCalculation.Delete)
			}

		}

		return nil
	})
}
