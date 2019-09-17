package ctl

import (
	"gxt-park-assets/internal/app/bll"
	"gxt-park-assets/internal/app/ginplus"

	"github.com/gin-gonic/gin"

	// 引入swagger
	_ "gxt-park-assets/internal/app/schema"
)

// NewFile 创建文件管理控制器
func NewFile(bFile bll.IFile) *File {
	return &File{
		FileBll: bFile,
	}
}

// File 文件管理
// @Name File
// @Description 文件管理
type File struct {
	FileBll bll.IFile
}

// Upload 上传文件
// @Summary 上传文件
// @Param Authorization header string false "Bearer 用户令牌"
// @Param data form file true
// @Success 200 schema.FileInfo
// @Failure 400 schema.HTTPError "{error:{code:0,message:无效的请求参数}}"
// @Failure 401 schema.HTTPError "{error:{code:0,message:未授权}}"
// @Failure 500 schema.HTTPError "{error:{code:0,message:服务器错误}}"
// @Router POST /api/v1/files
func (a *File) Upload(c *gin.Context) {
	info, err := a.FileBll.Upload(ginplus.NewContext(c), c.Request, "data", "assets")
	if err != nil {
		ginplus.ResError(c, err)
		return
	}

	ginplus.ResSuccess(c, info)
}
