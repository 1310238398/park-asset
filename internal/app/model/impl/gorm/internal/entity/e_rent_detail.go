package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
	"time"
)

// GetRentDetailDB 租金明细
func GetRentDetailDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, RentDetail{})
}

// SchemaRentDetail 租金明细
type SchemaRentDetail schema.RentDetail

// ToRentDetail 转换为租金明细实体
func (a SchemaRentDetail) ToRentDetail() *RentDetail {
	item := &RentDetail{
		RecordID:        &a.RecordID,
		HistoryID:       &a.HistoryID,
		Status:          &a.Status,
		PaymentStart:    &a.PaymentStart,
		PaymentEnd:      &a.PaymentEnd,
		PaymentAmount:   &a.PaymentAmount,
		PaymentDeadline: &a.PaymentDeadline,
		ActualAmount:    &a.ActualAmount,
		ReceiptPhoto:    &a.ReceiptPhoto,
		Operator:        &a.Operator,
		OperatorTel:     &a.OperatorTel,
		Creator:         &a.Creator,
	}
	return item
}

// RentDetail 租金明细实体
type RentDetail struct {
	Model
	RecordID        *string    `gorm:"column:record_id;size:36;index;"`    // 记录ID
	HistoryID       *string    `gorm:"column:history_id;size:36;index;"`   // 历史ID
	Status          *int       `gorm:"column:status;index;"`               // 缴费状态: 1未交费 2已缴费
	PaymentStart    *time.Time `gorm:"column:payment_start;type:date;"`    // 缴费开始日期
	PaymentEnd      *time.Time `gorm:"column:payment_end;type:date;"`      // 缴费结束日期
	PaymentAmount   *int       `gorm:"column:payment_amount;"`             // 缴费金额
	PaymentDeadline *time.Time `gorm:"column:payment_deadline;type:date;"` // 缴费截止期限
	ActualAmount    *int       `gorm:"column:actual_amount;"`              // 实缴金额
	ReceiptPhoto    *string    `gorm:"column:receipt_photo;size:2048;"`    // 收据照片(JSON)
	Operator        *string    `gorm:"column:operator;size:50;"`           // 操作人
	OperatorTel     *string    `gorm:"column:operator_tel;size:50;"`       // 操作人手机号
	Creator         *string    `gorm:"column:creator;size:36;index;"`      // 创建者
}

func (a RentDetail) String() string {
	return toString(a)
}

// TableName 表名
func (a RentDetail) TableName() string {
	return a.Model.TableName("rent_detail")
}

// ToSchemaRentDetail 转换为租金明细对象
func (a RentDetail) ToSchemaRentDetail() *schema.RentDetail {
	item := &schema.RentDetail{
		RecordID:        *a.RecordID,
		HistoryID:       *a.HistoryID,
		Status:          *a.Status,
		PaymentStart:    *a.PaymentStart,
		PaymentEnd:      *a.PaymentEnd,
		PaymentAmount:   *a.PaymentAmount,
		PaymentDeadline: *a.PaymentDeadline,
		ActualAmount:    *a.ActualAmount,
		ReceiptPhoto:    *a.ReceiptPhoto,
		Operator:        *a.Operator,
		OperatorTel:     *a.OperatorTel,
		Creator:         *a.Creator,
	}
	return item
}

// RentDetails 租金明细列表
type RentDetails []*RentDetail

// ToSchemaRentDetails 转换为租金明细对象列表
func (a RentDetails) ToSchemaRentDetails() []*schema.RentDetail {
	list := make([]*schema.RentDetail, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaRentDetail()
	}
	return list
}
