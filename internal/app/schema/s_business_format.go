package schema

// BusinessFormat 业态
type BusinessFormat struct {
	RecordID       string `json:"record_id" swaggo:"false,记录ID"`                  // 记录ID
	Name           string `json:"name" binding:"required" swaggo:"false,业态名称"`    // 业态名称
	ISUnderground  int    `json:"is_underground" swaggo:"false,是否位于地下(1:是2:否)"`   // 是否位于地下(1:是2:否)
	ISCivilDefense int    `json:"is_civil_defense" swaggo:"false,是否属于人防(1:是2:否)"` // 是否属于人防(1:是2:否)
	Memo           string `json:"memo" swaggo:"false,备注"`                         // 备注
}

// BusinessFormatQueryParam 查询条件
type BusinessFormatQueryParam struct {
	LikeName       string   // 业态名称(模糊查询)
	ISUnderground  int      // 是否位于地下(1:是2:否)
	ISCivilDefense int      // 是否属于人防(1:是2:否)
	RecordID       string   // 业态ID
	RecordIDs      []string // 业态ID列表

}

// BusinessFormatQueryOptions 查询可选参数项
type BusinessFormatQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// BusinessFormatQueryResult 查询结果
type BusinessFormatQueryResult struct {
	Data       BusinessFormats
	PageResult *PaginationResult
}

// BusinessFormats 业态列表
type BusinessFormats []*BusinessFormat

// ToMap 转化为键值映射
func (a BusinessFormats) ToMap() map[string]*BusinessFormat {
	m := make(map[string]*BusinessFormat, len(a))
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}
