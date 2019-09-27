package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
	"time"
)

// GetWithdrawalDB 退租管理
func GetWithdrawalDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, Withdrawal{})
}

// SchemaWithdrawal 退租管理
type SchemaWithdrawal schema.Withdrawal

// ToWithdrawal 转换为退租管理实体
func (a SchemaWithdrawal) ToWithdrawal() *Withdrawal {
	item := &Withdrawal{
		RecordID:          &a.RecordID,
		HistoryID:         &a.HistoryID,
		Status:            &a.Status,
		WithdrawalDate:    &a.WithdrawalDate,
		DepositRefund:     &a.DepositRefund,
		RealDeposit:       &a.RealDeposit,
		LiquidatedDamages: &a.LiquidatedDamages,
		Reason:            &a.Reason,
		Creator:           &a.Creator,
	}
	return item
}

// Withdrawal 退租管理实体
type Withdrawal struct {
	Model
	RecordID          *string    `gorm:"column:record_id;size:36;index;"`   // 记录ID
	HistoryID         *string    `gorm:"column:history_id;size:36;index;"`  // 历史ID
	Status            *int       `gorm:"column:status;index;"`              // 状态: 1合同正常结束 2合同提前结束
	WithdrawalDate    *time.Time `gorm:"column:withdrawal_date;type:date;"` // 退租日期
	DepositRefund     *int       `gorm:"column:deposit_refund;"`            // 应退押金
	RealDeposit       *int       `gorm:"column:real_deposit;"`              // 实退押金
	LiquidatedDamages *int       `gorm:"column:liquidated_damages;"`        // 违约金收缴
	Reason            *string    `gorm:"column:reason;size:1024"`           // 退租原因
	Creator           *string    `gorm:"column:creator;size:36;index;"`     // 创建者
}

func (a Withdrawal) String() string {
	return toString(a)
}

// TableName 表名
func (a Withdrawal) TableName() string {
	return a.Model.TableName("withdrawal")
}

// ToSchemaWithdrawal 转换为退租管理对象
func (a Withdrawal) ToSchemaWithdrawal() *schema.Withdrawal {
	item := &schema.Withdrawal{
		RecordID:          *a.RecordID,
		HistoryID:         *a.HistoryID,
		Status:            *a.Status,
		WithdrawalDate:    *a.WithdrawalDate,
		DepositRefund:     *a.DepositRefund,
		RealDeposit:       *a.RealDeposit,
		LiquidatedDamages: *a.LiquidatedDamages,
		Reason:            *a.Reason,
		Creator:           *a.Creator,
	}
	return item
}

// Withdrawals 退租管理列表
type Withdrawals []*Withdrawal

// ToSchemaWithdrawals 转换为退租管理对象列表
func (a Withdrawals) ToSchemaWithdrawals() []*schema.Withdrawal {
	list := make([]*schema.Withdrawal, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaWithdrawal()
	}
	return list
}
