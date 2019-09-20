package middleware

import (
	"fmt"
	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/ginplus"
	"gxt-park-assets/pkg/logger"
	"gxt-park-assets/pkg/minio"
	"gxt-park-assets/pkg/util"
	"io"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// FileMiddleware 文件服务中间件
func FileMiddleware(skipper ...SkipperFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		if len(skipper) > 0 && skipper[0](c) {
			c.Next()
			return
		}

		ctx := ginplus.NewContext(c)
		path, err := url.PathUnescape(c.Request.URL.Path)
		if err != nil {
			logger.StartSpan(ctx).WithField("path", c.Request.URL.Path).Warnf(err.Error())
			ginplus.ResError(c, errors.ErrBadRequest)
			return
		}

		stat, err := minio.GetClient().Stat(path)
		if err != nil {
			logger.StartSpan(ctx).WithField("file", path).Warnf(err.Error())
			ginplus.ResError(c, errors.ErrNotFound)
			return
		}

		obj, err := minio.GetClient().Get(ctx, path)
		if err != nil {
			ginplus.ResError(c, errors.WithStack(err))
			return
		}

		// 过滤内容类型，排除text/html,application/javascript
		contentType := stat.ContentType
		if strings.HasPrefix(contentType, "text/html") ||
			strings.HasPrefix(contentType, "application/javascript") {
			contentType = "text/plain; charset=utf-8"
		}

		c.Writer.Header().Set("Content-Type", contentType)
		c.Writer.Header().Set("ETag", fmt.Sprintf(`"%s"`, stat.ETag))
		c.Writer.Header().Set("Last-Modified", stat.LastModified.String())
		c.Writer.Header().Set("Cache-Control", "max-age=31536000")
		c.Writer.Header().Set("Content-Disposition", util.ContentDisposition(filepath.Base(stat.Key), "inline"))
		c.Writer.Header().Set("Content-Length", strconv.FormatInt(stat.Size, 10))
		io.Copy(c.Writer, obj)

		c.Abort()
	}
}
