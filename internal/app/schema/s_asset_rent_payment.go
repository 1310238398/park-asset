package schema

// AssetRentPayment 资产租金缴费明细
type AssetRentPayment struct {
	RecordID       string `json:"record_id" swaggo:"false,记录ID"`
	AssetID        string `json:"asset_id" swaggo:"false,资产ID"`
	PaymentYear    int    `json:"payment_year" swaggo:"false,缴费年"`
	PaymentMonth   int    `json:"payment_month" swaggo:"false,缴费月"`
	PaymentDay     int    `json:"payment_day" swaggo:"false,缴费日"`
	PaymentQuarter int    `json:"payment_quarter" swaggo:"false,缴费季度"`
	PaymentAmount  int    `json:"payment_amount" swaggo:"false,缴费金额"`
	ActualAmount   int    `json:"actual_amount" swaggo:"false,实缴金额"`
	RefundAmount   int    `json:"refund_amount" swaggo:"false,退费金额"`
	Creator        string `json:"creator" swaggo:"false,创建者"`
}

// AssetRentPaymentQueryParam 查询条件
type AssetRentPaymentQueryParam struct {
}

// AssetRentPaymentQueryOptions 查询可选参数项
type AssetRentPaymentQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// AssetRentPaymentQueryResult 查询结果
type AssetRentPaymentQueryResult struct {
	Data       AssetRentPayments
	PageResult *PaginationResult
}

// AssetRentPayments 资产租金缴费明细列表
type AssetRentPayments []*AssetRentPayment
