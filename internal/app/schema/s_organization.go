package schema

// Organization 组织机构管理
type Organization struct {
	RecordID   string     `json:"record_id" swaggo:"false,记录ID"`
	Name       string     `json:"name" binding:"required" swaggo:"true,机构名称"`
	OrgType    int        `json:"org_type" binding:"required" swaggo:"true,机构类型"`
	Sequence   int        `json:"sequence" binding:"required" swaggo:"true,排序值（降序）"`
	ParentID   string     `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath string     `json:"parent_path" swaggo:"false,父级路径"`
	Memo       string     `json:"memo" swaggo:"false,备注"`
	Creator    string     `json:"creator" swaggo:"false,创建者"`
	PcProjects PcProjects `json:"pc_projects,omitempty" swaggo:"false,本组织下的项目列表"`
}

// OrganizationQueryParam 查询条件
type OrganizationQueryParam struct {
	LikeName         string   // 组织机构名称(模糊查询)
	Name             string   // 组织机构名称
	OrgType          int      // 机构类型
	ParentID         *string  // 父级内码
	PrefixParentPath string   // 父级路径(前缀模糊查询)
	ParentPath       string   // 父级路径
	RecordIDs        []string // 记录ID列表
}

// OrganizationQueryOptions 查询可选参数项
type OrganizationQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// OrganizationQueryResult 查询结果
type OrganizationQueryResult struct {
	Data       Organizations
	PageResult *PaginationResult
}

// Organizations 组织机构列表
type Organizations []*Organization

// ToRecordIDs 转换为记录ID列表
func (a Organizations) ToRecordIDs() []string {
	recordIDs := make([]string, len(a))
	for i, item := range a {
		recordIDs[i] = item.RecordID
	}
	return recordIDs
}

// ToTrees 转换为组织机构列表
func (a Organizations) ToTrees() OrganizationTrees {
	list := make(OrganizationTrees, len(a))
	for i, item := range a {
		list[i] = &OrganizationTree{
			RecordID:   item.RecordID,
			Name:       item.Name,
			Sequence:   item.Sequence,
			ParentID:   item.ParentID,
			ParentPath: item.ParentPath,
			PcProjects: item.PcProjects,
		}
	}
	return list
}

// ToMap 转换为map
func (a Organizations) ToMap() map[string]*Organization {
	m := make(map[string]*Organization)
	for _, item := range a {
		m[item.RecordID] = item
	}
	return m
}

// OrganizationTree 组织机构树
type OrganizationTree struct {
	RecordID   string               `json:"record_id" swaggo:"false,记录ID"`
	Name       string               `json:"name" binding:"required" swaggo:"true,组织机构名称"`
	Sequence   int                  `json:"sequence" swaggo:"false,排序值"`
	ParentID   string               `json:"parent_id" swaggo:"false,父级ID"`
	ParentPath string               `json:"parent_path" swaggo:"false,父级路径"`
	Children   *[]*OrganizationTree `json:"children,omitempty" swaggo:"false,子级树"`
	PcProjects PcProjects           `json:"pc_projects,omitempty" swaggo:"false,本组织下的项目列表"`
}

// OrganizationTrees 组织机构树列表
type OrganizationTrees []*OrganizationTree

// ToTree 转换为树形结构
func (a OrganizationTrees) ToTree() []*OrganizationTree {
	mi := make(map[string]*OrganizationTree)
	for _, item := range a {
		mi[item.RecordID] = item
	}

	var list []*OrganizationTree
	for _, item := range a {
		if pitem, ok := mi[item.ParentID]; ok {
			if pitem.Children == nil {
				var children []*OrganizationTree
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

// FillPcProjects 填充项目信息
func (a Organizations) FillPcProjects(items PcProjects) {
	for _, orgItem := range a {
		for _, projItem := range items {
			if orgItem.RecordID == projItem.OrgID {
				orgItem.PcProjects = append(orgItem.PcProjects, projItem)
			}

		}
	}
}
