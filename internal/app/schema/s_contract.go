package schema

import "time"

// Contract 合同信息管理
type Contract struct {
	RecordID            string    `json:"record_id" swaggo:"false,记录ID"`
	HistoryID           string    `json:"history_id" swaggo:"false,历史ID"`
	Status              int       `json:"status" swaggo:"false,合同状态: 1租 2续签"`
	Code                string    `json:"code" binding:"required" swaggo:"true,合同编号"`
	Photo               string    `json:"photo" binding:"required" swaggo:"true,合同照片（JSON）"`
	RentCalcMethod      int       `json:"rent_calc_method" swaggo:"false,租金计算方式: 1日租金 2月租金"`
	Rent                int       `json:"rent" swaggo:"false,租金"`
	PaymentCycle        int       `json:"payment_cycle" swaggo:"false,缴费周期(月)"`
	AdvancePayment      int       `json:"advance_payment" swaggo:"false,提前付款天数"`
	LeaseStart          time.Time `json:"lease_start" swaggo:"false,租赁开始日期"`
	LeaseEnd            time.Time `json:"lease_end" swaggo:"false,租赁结束日期"`
	IsRentFree          int       `json:"is_rent_free" swaggo:"false,是否有免租期:1是 2否"`
	RentFreeStart       time.Time `json:"rent_free_start" swaggo:"false,免租期开始日期"`
	RentFreeEnd         time.Time `json:"rent_free_end" swaggo:"false,免租期结束日期"`
	SigningDate         time.Time `json:"signing_date" swaggo:"false,合同签署日期"`
	DepositDueAmount    int       `json:"deposit_due_amount" swaggo:"false,押金应交金额(分)"`
	DepositActualAmount int       `json:"deposit_actual_amount" swaggo:"false,押金实缴金额(分)"`
	DepositReceiptPhoto string    `json:"deposit_receipt_photo" swaggo:"false,押金收据照片(JSON)"`
	Creator             string    `json:"creator" swaggo:"false,创建者"`
}

// ContractQueryParam 查询条件
type ContractQueryParam struct {
}

// ContractQueryOptions 查询可选参数项
type ContractQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ContractQueryResult 查询结果
type ContractQueryResult struct {
	Data       Contracts
	PageResult *PaginationResult
}

// Contracts 合同信息管理列表
type Contracts []*Contract
