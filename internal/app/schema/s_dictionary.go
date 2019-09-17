package schema

// Dictionary 字典管理
type Dictionary struct {
	RecordID   string `json:"record_id" swaggo:"false,记录ID"`
	Code       string `json:"code" binding:"required" swaggo:"true,字典编号"`
	Name       string `json:"name" binding:"required" swaggo:"true,字典名称"`
	Sequence   int    `json:"sequence" binding:"required" swaggo:"true,排序值（降序）"`
	ParentID   string `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath string `json:"parent_path" swaggo:"false,父级路径"`
	Memo       string `json:"memo" swaggo:"false,备注"`
	Creator    string `json:"creator" swaggo:"false,创建者"`
}

// DictionaryQueryParam 查询条件
type DictionaryQueryParam struct {
	LikeCode         string  // 字典编号(模糊查询)
	LikeName         string  // 字典名称(模糊查询)
	Code             string  // 编号
	ParentID         *string // 父级内码
	PrefixParentPath string  // 父级路径(前缀模糊查询)
	ParentPath       string  // 父级路径
}

// DictionaryQueryOptions 查询可选参数项
type DictionaryQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// DictionaryQueryResult 查询结果
type DictionaryQueryResult struct {
	Data       Dictionaries
	PageResult *PaginationResult
}

// Dictionaries 字典列表
type Dictionaries []*Dictionary

// ToTrees 转换为字典列表
func (a Dictionaries) ToTrees() DictionaryTrees {
	list := make(DictionaryTrees, len(a))
	for i, item := range a {
		list[i] = &DictionaryTree{
			RecordID:   item.RecordID,
			Code:       item.Code,
			Name:       item.Name,
			Sequence:   item.Sequence,
			ParentID:   item.ParentID,
			ParentPath: item.ParentPath,
		}
	}
	return list
}

// DictionaryTree 字典树
type DictionaryTree struct {
	RecordID   string             `json:"record_id" swaggo:"false,记录ID"`
	Code       string             `json:"code" binding:"required" swaggo:"true,字典编号"`
	Name       string             `json:"name" binding:"required" swaggo:"true,字典名称"`
	Sequence   int                `json:"sequence" swaggo:"false,排序值"`
	ParentID   string             `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath string             `json:"parent_path" swaggo:"false,父级路径"`
	Children   *[]*DictionaryTree `json:"children,omitempty" swaggo:"false,子级树"`
}

// DictionaryTrees 字典树列表
type DictionaryTrees []*DictionaryTree

// ToTree 转换为树形结构
func (a DictionaryTrees) ToTree() []*DictionaryTree {
	mi := make(map[string]*DictionaryTree)
	for _, item := range a {
		mi[item.RecordID] = item
	}

	var list []*DictionaryTree
	for _, item := range a {
		if pitem, ok := mi[item.ParentID]; ok {
			if pitem.Children == nil {
				var children []*DictionaryTree
				children = append(children, item)
				pitem.Children = &children
				continue
			}
			*pitem.Children = append(*pitem.Children, item)
			continue
		}
		list = append(list, item)
	}
	return list
}
