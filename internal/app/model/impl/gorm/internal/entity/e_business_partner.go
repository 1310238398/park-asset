package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"strings"

	"github.com/jinzhu/gorm"
)

// GetBusinessPartnerDB 业务往来企业
func GetBusinessPartnerDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, BusinessPartner{})
}

// SchemaBusinessPartner 业务往来企业
type SchemaBusinessPartner schema.BusinessPartner

// ToBusinessPartner 转换为业务往来企业实体
func (a SchemaBusinessPartner) ToBusinessPartner() *BusinessPartner {
	list := strings.Join(a.InChargeList, ",")
	item := &BusinessPartner{
		RecordID:     &a.RecordID,
		Name:         &a.Name,
		PartnerType:  &a.PartnerType,
		InChargeList: &list,
	}

	return item
}

// BusinessPartner 业务往来企业实体
type BusinessPartner struct {
	CostModel
	RecordID     *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Name         *string `gorm:"column:name;size:100;index;"`     // 企业名称
	PartnerType  *int    `gorm:"column:partner_type;index;"`      // 伙伴类型
	InChargeList *string `gorm:"column:in_charge_list;size:200;"` // 负责人列表
}

func (a BusinessPartner) String() string {
	return toString(a)
}

// TableName 表名
func (a BusinessPartner) TableName() string {
	return a.CostModel.TableName("business_partner")
}

// ToSchemaBusinessPartner 转换为业务往来企业对象
func (a BusinessPartner) ToSchemaBusinessPartner() *schema.BusinessPartner {
	item := &schema.BusinessPartner{
		RecordID:     *a.RecordID,
		Name:         *a.Name,
		PartnerType:  *a.PartnerType,
		InChargeList: strings.Split(*a.InChargeList, ","),
	}

	return item
}

// BusinessPartners 业务往来企业列表
type BusinessPartners []*BusinessPartner

// ToSchemaBusinessPartners 转换为业务往来企业对象列表
func (a BusinessPartners) ToSchemaBusinessPartners() []*schema.BusinessPartner {
	list := make([]*schema.BusinessPartner, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaBusinessPartner()
	}
	return list
}
