package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetTenantCustomerDB 租户信息管理
func GetTenantCustomerDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, TenantCustomer{})
}

// SchemaTenantCustomer 租户信息管理
type SchemaTenantCustomer schema.TenantCustomer

// ToTenantCustomer 转换为租户信息管理实体
func (a SchemaTenantCustomer) ToTenantCustomer() *TenantCustomer {
	item := &TenantCustomer{
		RecordID:        &a.RecordID,
		HistoryID:       &a.HistoryID,
		TenantType:      &a.TenantType,
		Name:            &a.Name,
		ContactName:     &a.ContactName,
		ContactTel:      &a.ContactTel,
		ContactEmail:    &a.ContactEmail,
		ContactAddress:  &a.ContactAddress,
		BusinessLicense: &a.BusinessLicense,
		Category:        &a.Category,
		Invoice:         &a.Invoice,
		TaxNumber:       &a.TaxNumber,
		BankAccount:     &a.BankAccount,
		Creator:         &a.Creator,
	}
	return item
}

// TenantCustomer 租户信息管理实体
type TenantCustomer struct {
	Model
	RecordID        *string `gorm:"column:record_id;size:36;index;"`   // 记录ID
	HistoryID       *string `gorm:"column:history_id;size:36;index;"`  // 历史ID
	TenantType      *int    `gorm:"column:tenant_type;index;"`         // 租户类型:1企业 2个人
	Name            *string `gorm:"column:name;size:100;index;"`       // 名称
	ContactName     *string `gorm:"column:contact_name;size:100;"`     // 联系人姓名
	ContactTel      *string `gorm:"column:contact_tel;size:100;"`      // 联系人手机号
	ContactEmail    *string `gorm:"column:contact_email;size:100;"`    // 联系人邮箱
	ContactAddress  *string `gorm:"column:contact_address;size:512;"`  // 联系人地址
	BusinessLicense *string `gorm:"column:business_license;size:100;"` // 营业执照编号
	Category        *string `gorm:"column:category;size:50;"`          // 行业分类
	Invoice         *string `gorm:"column:invoice;size:100;"`          // 发票抬头
	TaxNumber       *string `gorm:"column:tax_number;size:100;"`       // 开票税号
	BankAccount     *string `gorm:"column:bank_account;size:200;"`     // 开户行及账号
	Creator         *string `gorm:"column:creator;size:36;index;"`     // 创建者
}

func (a TenantCustomer) String() string {
	return toString(a)
}

// TableName 表名
func (a TenantCustomer) TableName() string {
	return a.Model.TableName("tenant_customer")
}

// ToSchemaTenantCustomer 转换为租户信息管理对象
func (a TenantCustomer) ToSchemaTenantCustomer() *schema.TenantCustomer {
	item := &schema.TenantCustomer{
		RecordID:        *a.RecordID,
		HistoryID:       *a.HistoryID,
		TenantType:      *a.TenantType,
		Name:            *a.Name,
		ContactName:     *a.ContactName,
		ContactTel:      *a.ContactTel,
		ContactEmail:    *a.ContactEmail,
		ContactAddress:  *a.ContactAddress,
		BusinessLicense: *a.BusinessLicense,
		Category:        *a.Category,
		Invoice:         *a.Invoice,
		TaxNumber:       *a.TaxNumber,
		BankAccount:     *a.BankAccount,
		Creator:         *a.Creator,
	}
	return item
}

// TenantCustomers 租户信息管理列表
type TenantCustomers []*TenantCustomer

// ToSchemaTenantCustomers 转换为租户信息管理对象列表
func (a TenantCustomers) ToSchemaTenantCustomers() []*schema.TenantCustomer {
	list := make([]*schema.TenantCustomer, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaTenantCustomer()
	}
	return list
}
