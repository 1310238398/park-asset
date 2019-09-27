package amap

import "context"

// Option 配置选项
type Option func(*options)

// SetKey 设定请求服务标识
func SetKey(key string) Option {
	return func(o *options) {
		o.key = key
	}
}

type options struct {
	key string
}

// AMap 高德地图SDK
type AMap struct {
	opts *options
}

// SearchTextRequest 关键字搜索请求参数
type SearchTextRequest struct {
	KeyWords []string // 查询关键字
	Types    []string // 查询POI类型
}

// SearchTextReply 关键字搜索响应参数
type SearchTextReply struct {
	KeyWords []string
	Types    []string
}

// SearchText 关键字搜索
func (a *AMap) SearchText(ctx context.Context) {

}
