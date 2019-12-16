package schema

import (
	"strings"
)

// CostItem 成本项
type CostItem struct {
	RecordID      string          `json:"record_id" swaggo:"false,记录ID"`                       // 记录ID
	ParentID      string          `json:"parent_id" swaggo:"false,父级ID"`                       // 父级ID
	ParentPath    string          `json:"parent_path" swaggo:"false,父级路经"`                     // 父级路经
	Level         int             `json:"level" swaggo:"false,层级"`                             // 层级
	Name          string          `json:"name" binding:"required" swaggo:"false,成本项名称"`        // 名称
	TaxID         string          `json:"tax_id" swaggo:"false,税目ID"`                          // 税目ID
	Status        int             `json:"status" swaggo:"false,状态(1:启用2:停用)"`                  // 状态(1:启用2:停用)
	Label         int             `json:"label" swaggo:"false,标签(1:成本科目 2:测算科目)"`              // 标签(1:成本科目 2:测算科目)
	CalculateType int             `json:"calculate_type" swaggo:"false,计算方式(1.单价算总价,2.总价算单价)"` //计算方式(1.单价算总价,2.总价算单价)
	InLandTax     int             `json:"in_land_tax" swaggo:"false,是否计入土地增值税(1.计入,2.不计入)"`    //是否计入土地增值税(1.计入,2.不计入)
	Children      []*CostItem     `json:"children,omitempty" swaggo:"false,下级列表"`              //下级列表
	BusinessList  *CostBusinesses `json:"business_list" swaggo:"false,业态信息"`                   //业态单价列表
}

// CostItemQueryParam 查询条件
type CostItemQueryParam struct {
	ParentID         string   // 父级ID
	PrefixParentPath string   // 父级路经(前缀模糊查询)
	SuffixParentPath string   // 父级路经(后缀模糊查询)
	Level            int      // 层级
	LikeName         string   // 成本项名称(模糊查询)
	Label            int      // 标签(1:成本科目 2:测算科目)
	Name             string   // 成本项名称
	RecordIDs        []string // 成本项ID列表
}

// CostItemQueryOptions 查询可选参数项
type CostItemQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// CostItemQueryResult 查询结果
type CostItemQueryResult struct {
	Data       CostItems
	PageResult *PaginationResult
}

// CostItems 成本项列表
type CostItems []*CostItem

// ToMap 转为键值映射
func (a *CostItem) ToMap(deep *int, tmpDeep ...int) map[string]interface{} {
	var tmp int
	if len(tmpDeep) > 0 {
		tmp = tmpDeep[0]
	}
	result := map[string]interface{}{}
	result["record_id"] = a.RecordID
	result["parent_id"] = a.ParentID
	result["parent_path"] = a.ParentPath
	result["level"] = a.Level
	result["name"] = a.Name
	result["tax_id"] = a.TaxID
	result["status"] = a.Status
	result["label"] = a.Label
	result["calculate_type"] = a.CalculateType
	result["in_land_tax"] = a.InLandTax

	for _, v := range *a.BusinessList {
		result[v.BusinessID] = v.UnitPrice
	}

	children := []map[string]interface{}{}

	tmp++
	for _, v := range a.Children {
		children = append(children, v.ToMap(deep, tmp))
	}
	if len(children) > 0 {
		result["children"] = children
	}

	if tmp > *deep {
		*deep = tmp
	}

	return result
}

// CostResult 成本项返回结果
type CostResult struct {
	Tree []map[string]interface{} `json:"tree" swaggo:"false,数据结果"`  // 返回结果
	Deep int                      `json:"deep" swaggo:"false,树最大深度"` // 树最大深度
}

// ToNameMap 转为路经名称映射(/分割)
func (a CostItems) ToNameMap() map[string]string {
	mName := make(map[string]string, len(a))
	for _, item := range a {
		mName[item.RecordID] = item.Name
	}

	mNamePath := make(map[string]string, len(a))
	for _, item := range a {
		pathOfRecordID := append(strings.Split(item.ParentPath, "/"), item.RecordID)
		pathOfName := make([]string, len(pathOfRecordID))
		for _, recordID := range pathOfRecordID {
			pathOfName = append(pathOfName, mName[recordID])
		}
		mNamePath[item.RecordID] = strings.Trim(strings.Join(pathOfName, "/"), "/")
	}

	return mNamePath
}

// FillBusiness 填充业态
func (a CostItems) FillBusiness(buisnItems CostBusinesses) {
	for _, costItem := range a {
		if costItem.BusinessList == nil {
			var list CostBusinesses
			costItem.BusinessList = &list
		}

		for _, businItem := range buisnItems {
			if costItem.RecordID == businItem.CostID {
				*costItem.BusinessList = append(*costItem.BusinessList, businItem)
			}
		}
	}
}
