/*
Package api 生成swagger文档

文档规则请参考：https://github.com/teambition/swaggo/wiki/Declarative-Comments-Format

使用方式：

	go get -u -v github.com/teambition/swaggo
	swaggo -s ./internal/app/routers/api/swagger.go -p . -o ./internal/app/swagger*/
package api

import (
	// API控制器
	_ "gxt-park-assets/internal/app/routers/api/ctl"
)

// @Version 4.0.0
// @Title 资产管理系统
// @Schemes http,https
// @Host 127.0.0.1:10088
// @BasePath /
// @Name LyricTian
// @Consumes json
// @Produces json
