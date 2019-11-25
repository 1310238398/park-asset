package middleware

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/config"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/pkg/auth"

	"github.com/gin-gonic/gin"
)

// UserAuthMiddleware 用户授权中间件
func UserAuthMiddleware(a auth.Auther, userBll bll.IUser, skipper ...SkipperFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		var userID string
		if t := ginplus.GetToken(c); t != "" {
			id, err := a.ParseUserID(t)
			if err != nil {
				if err == auth.ErrInvalidToken {
					ginplus.ResError(c, errors.ErrNoPerm)
					return
				}
				ginplus.ResError(c, errors.WithStack(err))
				return
			}
			userID = id
		}

		if userID != "" {
			c.Set(ginplus.UserIDKey, userID)
			user, err := userBll.Get(c, userID)
			if err != nil {
				ginplus.ResError(c, errors.WithStack(err))
				return
			}
			if user != nil {
				//设置orgID
				c.Set(ginplus.OrgIDKey, user.OrgID)
			}

		}

		if len(skipper) > 0 && skipper[0](c) {
			c.Next()
			return
		}

		if userID == "" {
			if config.GetGlobalConfig().RunMode == "debug" {
				c.Set(ginplus.UserIDKey, config.GetGlobalConfig().Root.UserName)
				c.Next()
				return
			}
			ginplus.ResError(c, errors.ErrNoPerm)
		}
	}
}
