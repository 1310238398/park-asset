package schema

// FileInfo 文件信息
type FileInfo struct {
	URL  string `json:"url" swaggo:"true,文件访问路径"`
	Name string `json:"name" swaggo:"true,文件名"`
	Size int64  `json:"size" swaggo:"true,文件大小（单位字节）"`
}
