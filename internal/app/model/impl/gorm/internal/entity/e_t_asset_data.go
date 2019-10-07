package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/gormplus"
)

// GetTAssetDataDB 资产数据
func GetTAssetDataDB(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	return getDBWithModel(ctx, defDB, TAssetData{})
}

// SchemaTAssetData 资产数据
type SchemaTAssetData schema.TAssetData

// ToTAssetData 转换为资产数据实体
func (a SchemaTAssetData) ToTAssetData() *TAssetData {
	item := &TAssetData{
		RecordID:               &a.RecordID,
		OrgName:                &a.OrgName,
		ProjectName:            &a.ProjectName,
		AssetType:              &a.AssetType,
		AssetName:              &a.AssetName,
		BuildingName:           &a.BuildingName,
		UnitName:               &a.UnitName,
		LayerName:              &a.LayerName,
		HouseName:              &a.HouseName,
		Business:               &a.Business,
		BuildingArea:           &a.BuildingArea,
		RentArea:               &a.RentArea,
		SigningStatus:          &a.SigningStatus,
		Code:                   &a.Code,
		LeaseStart:             &a.LeaseStart,
		LeaseEnd:               &a.LeaseEnd,
		Period:                 &a.Period,
		DayRent:                &a.DayRent,
		MonthRent:              &a.MonthRent,
		PaymentCycle:           &a.PaymentCycle,
		AdvancePayment:         &a.AdvancePayment,
		RentFreeStart:          &a.RentFreeStart,
		RentFreeEnd:            &a.RentFreeEnd,
		DepositDueAmount:       &a.DepositDueAmount,
		DepositActualAmount:    &a.DepositActualAmount,
		SigningDate:            &a.SigningDate,
		QuarterY201901:         &a.QuarterY201901,
		QuarterS201901:         &a.QuarterS201901,
		QuarterY201902:         &a.QuarterY201902,
		QuarterS201902:         &a.QuarterS201902,
		QuarterY201903:         &a.QuarterY201903,
		QuarterS201903:         &a.QuarterS201903,
		QuarterY201904:         &a.QuarterY201904,
		QuarterS201904:         &a.QuarterS201904,
		QuarterY202001:         &a.QuarterY202001,
		QuarterS202001:         &a.QuarterS202001,
		QuarterY202002:         &a.QuarterY202002,
		QuarterS202002:         &a.QuarterS202002,
		QuarterY202003:         &a.QuarterY202003,
		QuarterS202003:         &a.QuarterS202003,
		QuarterY202004:         &a.QuarterY202004,
		QuarterS202004:         &a.QuarterS202004,
		CustomerTenantType:     &a.CustomerTenantType,
		CustomerName:           &a.CustomerName,
		CustomerContactName:    &a.CustomerContactName,
		CustomerContactTel:     &a.CustomerContactTel,
		CustomerContactEmail:   &a.CustomerContactEmail,
		CustomerContactAddress: &a.CustomerContactAddress,
	}
	return item
}

// TAssetData 资产数据实体
type TAssetData struct {
	Model
	RecordID               *string `gorm:"column:record_id;size:36;index;"`           // 记录ID
	OrgName                *string `gorm:"column:org_name;size:100;"`                 // 公司名称
	ProjectName            *string `gorm:"column:project_name;size:100;"`             // 项目名称
	AssetType              *int    `gorm:"column:asset_type;"`                        // 资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商
	AssetName              *string `gorm:"column:asset_name;size:100;"`               // 资产名称(商铺号、车位号、厂房号、摊位号)
	BuildingName           *string `gorm:"column:building_name;size:100;"`            // 楼栋名称
	UnitName               *string `gorm:"column:unit_name;size:100;"`                // 单元名称
	LayerName              *string `gorm:"column:layer_name;size:100;"`               // 楼层名称
	HouseName              *string `gorm:"column:house_name;size:100;"`               // 门牌名称
	Business               *string `gorm:"column:business;size:100;"`                 // 业态
	BuildingArea           *string `gorm:"column:building_area;size:100;"`            // 建筑面积
	RentArea               *string `gorm:"column:rent_area;size:100;"`                // 计租面积
	SigningStatus          *string `gorm:"column:signing_status;size:100;"`           // 签约情况
	Code                   *string `gorm:"column:code;size:100;"`                     // 合同编号
	LeaseStart             *string `gorm:"column:lease_start;size:100;"`              // 租赁开始日期
	LeaseEnd               *string `gorm:"column:lease_end;size:100;"`                // 租赁结束日期
	Period                 *string `gorm:"column:period;size:100;"`                   // 合同年限
	DayRent                *string `gorm:"column:day_rent;size:100;"`                 // 日租金
	MonthRent              *string `gorm:"column:month_rent;size:100;"`               // 月租金
	PaymentCycle           *string `gorm:"column:payment_cycle;size:100;"`            // 缴费周期(月)
	AdvancePayment         *string `gorm:"column:advance_payment;size:100;"`          // 提前付款天数
	RentFreeStart          *string `gorm:"column:rent_free_start;size:100;"`          // 免租期开始日期
	RentFreeEnd            *string `gorm:"column:rent_free_end;size:100;"`            // 免租期结束日期
	DepositDueAmount       *string `gorm:"column:deposit_due_amount;size:100;"`       // 押金应交金额(分)
	DepositActualAmount    *string `gorm:"column:deposit_actual_amount;size:100;"`    // 押金实缴金额(分)
	SigningDate            *string `gorm:"column:signing_date;size:100;"`             // 合同签署日期
	QuarterY201901         *string `gorm:"column:quarter_y201901;size:100;"`          // 一季度应收
	QuarterS201901         *string `gorm:"column:quarter_s201901;size:100;"`          // 一季度实收
	QuarterY201902         *string `gorm:"column:quarter_y201902;size:100;"`          // 二季度应收
	QuarterS201902         *string `gorm:"column:quarter_s201902;size:100;"`          // 二季度实收
	QuarterY201903         *string `gorm:"column:quarter_y201903;size:100;"`          // 三季度应收
	QuarterS201903         *string `gorm:"column:quarter_s201903;size:100;"`          // 三季度实收
	QuarterY201904         *string `gorm:"column:quarter_y201904;size:100;"`          // 四季度应收
	QuarterS201904         *string `gorm:"column:quarter_s201904;size:100;"`          // 四季度实收
	QuarterY202001         *string `gorm:"column:quarter_y202001;size:100;"`          // 一季度应收
	QuarterS202001         *string `gorm:"column:quarter_s202001;size:100;"`          // 一季度实收
	QuarterY202002         *string `gorm:"column:quarter_y202002;size:100;"`          // 二季度应收
	QuarterS202002         *string `gorm:"column:quarter_s202002;size:100;"`          // 二季度实收
	QuarterY202003         *string `gorm:"column:quarter_y202003;size:100;"`          // 三季度应收
	QuarterS202003         *string `gorm:"column:quarter_s202003;size:100;"`          // 三季度实收
	QuarterY202004         *string `gorm:"column:quarter_y202004;size:100;"`          // 四季度应收
	QuarterS202004         *string `gorm:"column:quarter_s202004;size:100;"`          // 四季度实收
	CustomerTenantType     *string `gorm:"column:customer_tenant_type;size:100;"`     // 租户类型
	CustomerName           *string `gorm:"column:customer_name;size:100;"`            // 客户名称
	CustomerContactName    *string `gorm:"column:customer_contact_name;size:100;"`    // 联系人姓名
	CustomerContactTel     *string `gorm:"column:customer_contact_tel;size:100;"`     // 联系人手机号
	CustomerContactEmail   *string `gorm:"column:customer_contact_email;size:100;"`   // 联系人邮箱
	CustomerContactAddress *string `gorm:"column:customer_contact_address;size:100;"` // 联系人地址
}

func (a TAssetData) String() string {
	return toString(a)
}

// TableName 表名
func (a TAssetData) TableName() string {
	return a.Model.TableName("t_asset_data")
}

// ToSchemaTAssetData 转换为资产数据对象
func (a TAssetData) ToSchemaTAssetData() *schema.TAssetData {
	item := &schema.TAssetData{
		RecordID:               *a.RecordID,
		OrgName:                *a.OrgName,
		ProjectName:            *a.ProjectName,
		AssetType:              *a.AssetType,
		AssetName:              *a.AssetName,
		BuildingName:           *a.BuildingName,
		UnitName:               *a.UnitName,
		LayerName:              *a.LayerName,
		HouseName:              *a.HouseName,
		Business:               *a.Business,
		BuildingArea:           *a.BuildingArea,
		RentArea:               *a.RentArea,
		SigningStatus:          *a.SigningStatus,
		Code:                   *a.Code,
		LeaseStart:             *a.LeaseStart,
		LeaseEnd:               *a.LeaseEnd,
		Period:                 *a.Period,
		DayRent:                *a.DayRent,
		MonthRent:              *a.MonthRent,
		PaymentCycle:           *a.PaymentCycle,
		AdvancePayment:         *a.AdvancePayment,
		RentFreeStart:          *a.RentFreeStart,
		RentFreeEnd:            *a.RentFreeEnd,
		DepositDueAmount:       *a.DepositDueAmount,
		DepositActualAmount:    *a.DepositActualAmount,
		SigningDate:            *a.SigningDate,
		QuarterY201901:         *a.QuarterY201901,
		QuarterS201901:         *a.QuarterS201901,
		QuarterY201902:         *a.QuarterY201902,
		QuarterS201902:         *a.QuarterS201902,
		QuarterY201903:         *a.QuarterY201903,
		QuarterS201903:         *a.QuarterS201903,
		QuarterY201904:         *a.QuarterY201904,
		QuarterS201904:         *a.QuarterS201904,
		QuarterY202001:         *a.QuarterY202001,
		QuarterS202001:         *a.QuarterS202001,
		QuarterY202002:         *a.QuarterY202002,
		QuarterS202002:         *a.QuarterS202002,
		QuarterY202003:         *a.QuarterY202003,
		QuarterS202003:         *a.QuarterS202003,
		QuarterY202004:         *a.QuarterY202004,
		QuarterS202004:         *a.QuarterS202004,
		CustomerTenantType:     *a.CustomerTenantType,
		CustomerName:           *a.CustomerName,
		CustomerContactName:    *a.CustomerContactName,
		CustomerContactTel:     *a.CustomerContactTel,
		CustomerContactEmail:   *a.CustomerContactEmail,
		CustomerContactAddress: *a.CustomerContactAddress,
	}
	return item
}

// TAssetDatas 资产数据列表
type TAssetDatas []*TAssetData

// ToSchemaTAssetData 转换为资产数据对象列表
func (a TAssetDatas) ToSchemaTAssetData() []*schema.TAssetData {
	list := make([]*schema.TAssetData, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaTAssetData()
	}
	return list
}
