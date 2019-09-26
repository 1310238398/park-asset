package schema

// TenantCustomer 租户信息管理
type TenantCustomer struct {
	RecordID        string `json:"record_id" swaggo:"false,记录ID"`
	HistoryID       string `json:"history_id" swaggo:"false,历史ID"`
	TenantType      int    `json:"tenant_type" swaggo:"false,租户类型:1企业 2个人"`
	Name            string `json:"name" swaggo:"false,名称"`
	ContactName     string `json:"contact_name" swaggo:"false,联系人姓名"`
	ContactTel      string `json:"contact_tel" swaggo:"false,联系人手机号"`
	ContactEmail    string `json:"contact_email" swaggo:"false,联系人邮箱"`
	ContactAddress  string `json:"contact_address" swaggo:"false,联系人地址"`
	BusinessLicense string `json:"business_license" swaggo:"false,营业执照编号"`
	Category        string `json:"category" swaggo:"false,行业分类"`
	Invoice         string `json:"invoice" swaggo:"false,发票抬头"`
	TaxNumber       string `json:"tax_number" swaggo:"false,开票税号"`
	BankAccount     string `json:"bank_account" swaggo:"false,开户行及账号"`
	Creator         string `json:"creator" swaggo:"false,创建者"`
}

// TenantCustomerQueryParam 查询条件
type TenantCustomerQueryParam struct {
}

// TenantCustomerQueryOptions 查询可选参数项
type TenantCustomerQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// TenantCustomerQueryResult 查询结果
type TenantCustomerQueryResult struct {
	Data       TenantCustomers
	PageResult *PaginationResult
}

// TenantCustomers 租户信息管理列表
type TenantCustomers []*TenantCustomer
