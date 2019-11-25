package schema

// ProjBusinessFormat 项目业态
type ProjBusinessFormat struct {
	RecordID         string  `json:"record_id" swaggo:"false,记录ID"`                  // 记录ID
	ProjectID        string  `json:"project_id" swaggo:"false,成本项目ID"`               // 成本项目ID
	BusinessFormatID string  `json:"business_format_id" swaggo:"false,业态ID"`         // 业态ID
	FloorArea        float64 `json:"floor_area" swaggo:"false,建筑面积"`                 // 建筑面积
	Name             string  `json:"name" swaggo:"false,业态名称"`                       // 业态名称
	ISUnderground    int     `json:"is_underground" swaggo:"false,是否位于地下(1:是2:否)"`   // 是否位于地下(1:是2:否)
	ISCivilDefense   int     `json:"is_civil_defense" swaggo:"false,是否属于人防(1:是2:否)"` // 是否属于人防(1:是2:否)

}

// ProjBusinessFormatQueryParam 查询条件
type ProjBusinessFormatQueryParam struct {
	ProjectID         string   // 成本项目ID
	BusinessFormatID  string   // 业态ID
	RecordIDs         []string // 项目业态ID列表
	BusinessFormatIDs []string // 业态ID列表

}

// ProjBusinessFormatQueryOptions 查询可选参数项
type ProjBusinessFormatQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjBusinessFormatQueryResult 查询结果
type ProjBusinessFormatQueryResult struct {
	Data       ProjBusinessFormats
	PageResult *PaginationResult
}

// ProjBusinessFormats 项目业态列表
type ProjBusinessFormats []*ProjBusinessFormat

// FillData 项目业态填充数据
func (a ProjBusinessFormats) FillData(list BusinessFormats) {
	for _, item := range a {
		for _, businItem := range list {
			if item.BusinessFormatID == businItem.RecordID {
				item.ISCivilDefense = businItem.ISCivilDefense
				item.ISUnderground = businItem.ISUnderground
				break
			}
		}
	}
}

// ToMap 转换为键值映射
func (a ProjBusinessFormats) ToMap() map[string]*ProjBusinessFormat {
	m := make(map[string]*ProjBusinessFormat)
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}

// ToBusinessIDs 转换为业态ID列表
func (a ProjBusinessFormats) ToBusinessIDs() []string {
	list := make([]string, len(a))
	for _, item := range a {
		list = append(list, item.BusinessFormatID)
	}
	return list
}

// ToProjBusinessIDs 转换为业态ID列表
func (a ProjBusinessFormats) ToProjBusinessIDs() []string {
	list := make([]string, len(a))
	for _, item := range a {
		list = append(list, item.RecordID)
	}
	return list
}
