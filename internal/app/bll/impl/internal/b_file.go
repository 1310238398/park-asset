package internal

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"

	"github.com/LyricTian/fuh"
)

// NewFile 创建文件管理实例
func NewFile() *File {
	return &File{}
}

// File 文件管理
type File struct{}

// Upload 上传文件
func (a *File) Upload(ctx context.Context, r *http.Request, formKey, bucket string) (*schema.FileInfo, error) {
	ctx = fuh.NewFileNameContext(ctx, func(ctx fuh.ContextInfo) string {
		return fmt.Sprintf("%s/%s/%s/%s", ctx.BasePath(), strings.ToLower(bucket), util.MustUUID(), ctx.FileName())
	})

	infos, err := fuh.Upload(ctx, r, formKey)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if len(infos) == 0 {
		return nil, nil
	}

	fullName := infos[0].FullName()
	if fullName[0] != '/' {
		fullName = "/" + fullName
	}

	info := &schema.FileInfo{
		URL:  fullName,
		Name: infos[0].Name(),
		Size: infos[0].Size(),
	}
	return info, nil
}
