package schema

// BusinessPartner 业务往来企业
type BusinessPartner struct {
	RecordID     string   `json:"record_id" swaggo:"false,记录ID"`               // 记录ID
	Name         string   `json:"name" binding:"required" swaggo:"false,企业名称"` // 企业名称
	PartnerType  int      `json:"partner_type" swaggo:"false,伙伴类型"`            // 伙伴类型
	InChargeList []string `json:"in_charge_list" swaggo:"false,负责人列表 "`        // 负责人列表
}

// BusinessPartnerQueryParam 查询条件
type BusinessPartnerQueryParam struct {
	LikeName    string // 企业名称(模糊查询)
	PartnerType int    // 伙伴类型
}

// BusinessPartnerQueryOptions 查询可选参数项
type BusinessPartnerQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// BusinessPartnerQueryResult 查询结果
type BusinessPartnerQueryResult struct {
	Data       BusinessPartners
	PageResult *PaginationResult
}

// BusinessPartners 业务往来企业列表
type BusinessPartners []*BusinessPartner
