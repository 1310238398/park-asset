package schema

import "time"

// RentDetail 租金明细
type RentDetail struct {
	RecordID        string    `json:"record_id" swaggo:"false,记录ID"`
	HistoryID       string    `json:"history_id" swaggo:"false,历史ID"`
	Status          int       `json:"status" swaggo:"false,缴费状态: 1未交费 2已缴费"`
	PaymentStart    time.Time `json:"payment_start" swaggo:"false,缴费开始日期"`
	PaymentEnd      time.Time `json:"payment_end" swaggo:"false,缴费结束日期"`
	PaymentAmount   int       `json:"payment_amount" swaggo:"false,缴费金额"`
	PaymentDeadline time.Time `json:"payment_deadline" swaggo:"false,缴费截止期限"`
	ActualAmount    int       `json:"actual_amount" swaggo:"false,实缴金额"`
	ReceiptPhoto    string    `json:"receipt_photo" swaggo:"false,收据照片(JSON)"`
	Operator        string    `json:"operator" swaggo:"false,操作人"`
	OperatorTel     string    `json:"operator_tel" swaggo:"false,操作人手机号"`
	Creator         string    `json:"creator" swaggo:"false,创建者"`
}

// RentDetailQueryParam 查询条件
type RentDetailQueryParam struct {
}

// RentDetailQueryOptions 查询可选参数项
type RentDetailQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// RentDetailQueryResult 查询结果
type RentDetailQueryResult struct {
	Data       RentDetails
	PageResult *PaginationResult
}

// RentDetails 租金明细列表
type RentDetails []*RentDetail
