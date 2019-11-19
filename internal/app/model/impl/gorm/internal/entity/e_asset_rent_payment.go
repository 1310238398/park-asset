package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetAssetRentPaymentDB 资产租金缴费明细
func GetAssetRentPaymentDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModelPlus(ctx, defDB, AssetRentPayment{})
}

// SchemaAssetRentPayment 资产租金缴费明细
type SchemaAssetRentPayment schema.AssetRentPayment

// ToAssetRentPayment 转换为资产租金缴费明细实体
func (a SchemaAssetRentPayment) ToAssetRentPayment() *AssetRentPayment {
	item := &AssetRentPayment{
		RecordID:       &a.RecordID,
		GroupID:        &a.GroupID,
		PaymentYear:    &a.PaymentYear,
		PaymentMonth:   &a.PaymentMonth,
		PaymentDay:     &a.PaymentDay,
		PaymentQuarter: &a.PaymentQuarter,
		PaymentAmount:  &a.PaymentAmount,
		ActualAmount:   &a.ActualAmount,
		RefundAmount:   &a.RefundAmount,
		Creator:        &a.Creator,
	}
	return item
}

// AssetRentPayment 资产租金缴费明细实体
type AssetRentPayment struct {
	Model
	RecordID       *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	GroupID        *string `gorm:"column:group_id;size:36;index;"`  // 资产组ID
	PaymentYear    *int    `gorm:"column:payment_year;index;"`      // 缴费年
	PaymentMonth   *int    `gorm:"column:payment_month;index;"`     // 缴费月
	PaymentDay     *int    `gorm:"column:payment_day;index;"`       // 缴费日
	PaymentQuarter *int    `gorm:"column:payment_quarter;index;"`   // 缴费季度
	PaymentAmount  *int    `gorm:"column:payment_amount;index;"`    // 缴费金额
	ActualAmount   *int    `gorm:"column:actual_amount;index;"`     // 实缴金额
	RefundAmount   *int    `gorm:"column:refund_amount;index;"`     // 退费金额
	Creator        *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

func (a AssetRentPayment) String() string {
	return toString(a)
}

// TableName 表名
func (a AssetRentPayment) TableName() string {
	return a.Model.TableName("asset_rent_payment")
}

// ToSchemaAssetRentPayment 转换为资产租金缴费明细对象
func (a AssetRentPayment) ToSchemaAssetRentPayment() *schema.AssetRentPayment {
	item := &schema.AssetRentPayment{
		RecordID:       *a.RecordID,
		GroupID:        *a.GroupID,
		PaymentYear:    *a.PaymentYear,
		PaymentMonth:   *a.PaymentMonth,
		PaymentDay:     *a.PaymentDay,
		PaymentQuarter: *a.PaymentQuarter,
		PaymentAmount:  *a.PaymentAmount,
		ActualAmount:   *a.ActualAmount,
		RefundAmount:   *a.RefundAmount,
		Creator:        *a.Creator,
	}
	return item
}

// AssetRentPayments 资产租金缴费明细列表
type AssetRentPayments []*AssetRentPayment

// ToSchemaAssetRentPayments 转换为资产租金缴费明细对象列表
func (a AssetRentPayments) ToSchemaAssetRentPayments() []*schema.AssetRentPayment {
	list := make([]*schema.AssetRentPayment, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaAssetRentPayment()
	}
	return list
}
