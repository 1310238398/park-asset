package bll

import (
	"context"
	"net/http"

	"gxt-park-assets/internal/app/schema"
)

// IFile 文件管理业务逻辑接口
type IFile interface {
	// 文件上传
	Upload(ctx context.Context, r *http.Request, formKey, bucket string) (*schema.FileInfo, error)
}
