package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
	"time"
)

// GetContractDB 合同信息管理
func GetContractDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, Contract{})
}

// SchemaContract 合同信息管理
type SchemaContract schema.Contract

// ToContract 转换为合同信息管理实体
func (a SchemaContract) ToContract() *Contract {
	item := &Contract{
		RecordID:            &a.RecordID,
		HistoryID:           &a.HistoryID,
		Status:              &a.Status,
		Code:                &a.Code,
		Photo:               &a.Photo,
		RentCalcMethod:      &a.RentCalcMethod,
		Rent:                &a.Rent,
		PaymentCycle:        &a.PaymentCycle,
		AdvancePayment:      &a.AdvancePayment,
		LeaseStart:          &a.LeaseStart,
		LeaseEnd:            &a.LeaseEnd,
		IsRentFree:          &a.IsRentFree,
		RentFreeStart:       &a.RentFreeStart,
		RentFreeEnd:         &a.RentFreeEnd,
		SigningDate:         &a.SigningDate,
		DepositDueAmount:    &a.DepositDueAmount,
		DepositActualAmount: &a.DepositActualAmount,
		DepositReceiptPhoto: &a.DepositReceiptPhoto,
		Creator:             &a.Creator,
	}
	return item
}

// Contract 合同信息管理实体
type Contract struct {
	Model
	RecordID            *string    `gorm:"column:record_id;size:36;index;"`         // 记录ID
	HistoryID           *string    `gorm:"column:history_id;size:36;index;"`        // 历史ID
	Status              *int       `gorm:"column:status;index;"`                    // 合同状态: 1租 2续签
	Code                *string    `gorm:"column:code;size:100;index;"`             // 合同编号
	Photo               *string    `gorm:"column:photo;size:2048;"`                 // 合同照片（JSON）
	RentCalcMethod      *int       `gorm:"column:rent_calc_method;"`                // 租金计算方式: 1日租金 2月租金
	Rent                *int       `gorm:"column:rent;"`                            // 租金
	PaymentCycle        *int       `gorm:"column:payment_cycle;"`                   // 缴费周期(月)
	AdvancePayment      *int       `gorm:"column:advance_payment;"`                 // 提前付款天数
	LeaseStart          *time.Time `gorm:"column:lease_start;type:date;"`           // 租赁开始日期
	LeaseEnd            *time.Time `gorm:"column:lease_end;type:date;"`             // 租赁结束日期
	IsRentFree          *int       `gorm:"column:is_rent_free;"`                    // 是否有免租期:1是 2否
	RentFreeStart       *time.Time `gorm:"column:rent_free_start;type:date;"`       // 免租期开始日期
	RentFreeEnd         *time.Time `gorm:"column:rent_free_end;type:date;"`         // 免租期结束日期
	SigningDate         *time.Time `gorm:"column:signing_date;type:date;"`          // 合同签署日期
	DepositDueAmount    *int       `gorm:"column:deposit_due_amount;"`              // 押金应交金额(分)
	DepositActualAmount *int       `gorm:"column:deposit_actual_amount;"`           // 押金实缴金额(分)
	DepositReceiptPhoto *string    `gorm:"column:deposit_receipt_photo;size:2048;"` // 押金收据照片(JSON)
	Creator             *string    `gorm:"column:creator;size:36;index;"`           // 创建者
}

func (a Contract) String() string {
	return toString(a)
}

// TableName 表名
func (a Contract) TableName() string {
	return a.Model.TableName("contract")
}

// ToSchemaContract 转换为合同信息管理对象
func (a Contract) ToSchemaContract() *schema.Contract {
	item := &schema.Contract{
		RecordID:            *a.RecordID,
		HistoryID:           *a.HistoryID,
		Status:              *a.Status,
		Code:                *a.Code,
		Photo:               *a.Photo,
		RentCalcMethod:      *a.RentCalcMethod,
		Rent:                *a.Rent,
		PaymentCycle:        *a.PaymentCycle,
		AdvancePayment:      *a.AdvancePayment,
		LeaseStart:          *a.LeaseStart,
		LeaseEnd:            *a.LeaseEnd,
		IsRentFree:          *a.IsRentFree,
		RentFreeStart:       *a.RentFreeStart,
		RentFreeEnd:         *a.RentFreeEnd,
		SigningDate:         *a.SigningDate,
		DepositDueAmount:    *a.DepositDueAmount,
		DepositActualAmount: *a.DepositActualAmount,
		DepositReceiptPhoto: *a.DepositReceiptPhoto,
		Creator:             *a.Creator,
	}
	return item
}

// Contracts 合同信息管理列表
type Contracts []*Contract

// ToSchemaContracts 转换为合同信息管理对象列表
func (a Contracts) ToSchemaContracts() []*schema.Contract {
	list := make([]*schema.Contract, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaContract()
	}
	return list
}
