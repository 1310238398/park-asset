package schema

import "time"

// Withdrawal 退租管理
type Withdrawal struct {
	RecordID          string    `json:"record_id" swaggo:"false,记录ID"`
	HistoryID         string    `json:"history_id" swaggo:"false,历史ID"`
	Status            int       `json:"status" swaggo:"false,状态: 1合同正常结束 2合同提前结束"`
	WithdrawalDate    time.Time `json:"withdrawal_date" binding:"required" swaggo:"true,退租日期"`
	DepositRefund     int       `json:"deposit_refund" swaggo:"false,应退押金"`
	RealDeposit       int       `json:"real_deposit" swaggo:"false,实退押金"`
	LiquidatedDamages int       `json:"liquidated_damages" swaggo:"false,违约金收缴"`
	Reason            string    `json:"reason" swaggo:"false,退租原因"`
	Creator           string    `json:"creator" swaggo:"false,创建者"`
}

// WithdrawalQueryParam 查询条件
type WithdrawalQueryParam struct {
}

// WithdrawalQueryOptions 查询可选参数项
type WithdrawalQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// WithdrawalQueryResult 查询结果
type WithdrawalQueryResult struct {
	Data       Withdrawals
	PageResult *PaginationResult
}

// Withdrawals 退租管理列表
type Withdrawals []*Withdrawal
