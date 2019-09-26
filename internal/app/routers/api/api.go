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
	) error {

		g := app.Group("/api")

		// 用户身份授权
		g.Use(middleware.UserAuthMiddleware(
			a,
			middleware.AllowMethodAndPathPrefixSkipper(
				middleware.JoinRouter("GET", "/api/v1/pub/login"),
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
		}

		return nil
	})
}
