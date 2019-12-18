package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetSettlementRecordDB 结算信息
func GetSettlementRecordDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, SettlementRecord{})
}

// SchemaSettlementRecord 结算信息
type SchemaSettlementRecord schema.SettlementRecord

// ToSettlementRecord 转换为结算信息实体
func (a SchemaSettlementRecord) ToSettlementRecord() *SettlementRecord {
	item := &SettlementRecord{
		RecordID:           &a.RecordID,
		Creator:            &a.Creator,
		ComContractID:      a.ComContractID,
		ReportNO:           a.ReportNO,
		ReportName:         a.ReportName,
		Songshen:           a.Songshen,
		SongshenJiagong:    a.SongshenJiagong,
		Shending:           a.Shending,
		ShendingJiagong:    a.ShendingJiagong,
		Shenjian:           a.Shenjian,
		ShenjianJiagong:    a.ShenjianJiagong,
		Yishen:             a.Yishen,
		YishenJiagong:      a.YishenJiagong,
		Zuizhong:           a.Zuizhong,
		ZuizhongJiagong:    a.ZuizhongJiagong,
		Zaojiazixun:        a.Zaojiazixun,
		ZaojiazixunJingban: a.ZaojiazixunJingban,
		ReportDate:         a.ReportDate,
		Copies:             a.Copies,
		ArchiveSN:          a.ArchiveSN,
		IsDone:             a.IsDone,
		OutstandingAmount:  a.OutstandingAmount,
		Remark:             a.Remark,
	}
	return item
}

// SettlementRecord 结算信息实体
type SettlementRecord struct {
	Model
	RecordID           *string `gorm:"column:record_id;size:36;index;"`      // 记录ID
	Creator            *string `gorm:"column:creator;size:36;index;"`        // 创建者
	ComContractID      string  `gorm:"column:comcontract_id;size:36;index;"` // 合同ID
	ReportNO           string  `gorm:"column:report_no"`                     // 报告编号
	ReportName         string  `gorm:"column:report_name"`                   // 报告名称
	Songshen           float64 `gorm:"column:songshen"`                      // 送审值
	SongshenJiagong    float64 `gorm:"column:songshen_jiagongg"`             // 送审值 甲供金额
	Shending           float64 `gorm:"column:shending"`                      // 审定值
	ShendingJiagong    float64 `gorm:"column:shending_jiagong"`              // 审定值 甲供金额
	Shenjian           float64 `gorm:"column:shenjian"`                      // 审减值
	ShenjianJiagong    float64 `gorm:"column:shenjian_jiagong"`              // 审减值 甲供金额
	Yishen             float64 `gorm:"column:yishen"`                        // 一审值
	YishenJiagong      float64 `gorm:"column:yishen_jiagong"`                // 一审值 甲供金额
	Zuizhong           float64 `gorm:"column:zuizhong"`                      // 最终审定值
	ZuizhongJiagong    float64 `gorm:"column:zuizhong_jiagong"`              // 最终审定值 甲供金额
	Zaojiazixun        string  `gorm:"column:zaojiazixun"`                   // 造价咨询单位
	ZaojiazixunJingban string  `gorm:"column:zaojiazixun_jingban"`           // 造价咨询单位 经办人
	ReportDate         string  `gorm:"column:report_date"`                   // 报告日期
	Copies             float64 `gorm:"column:copies"`                        // 份数
	ArchiveSN          string  `gorm:"column:archive_sn"`                    // 存档号
	IsDone             string  `gorm:"column:is_done"`                       // 是否终止
	OutstandingAmount  float64 `gorm:"column:outstanding_amount"`            // 为结算金额
	Remark             string  `gorm:"column:remark"`                        // 备注

}

func (a SettlementRecord) String() string {
	return toString(a)
}

// TableName 表名
func (a SettlementRecord) TableName() string {
	return a.Model.TableName("com_contract_settlement")
}

// ToSchemaSettlementRecord 转换为结算信息对象
func (a SettlementRecord) ToSchemaSettlementRecord() *schema.SettlementRecord {
	item := &schema.SettlementRecord{
		RecordID:           *a.RecordID,
		Creator:            *a.Creator,
		CreatedAt:          a.CreatedAt,
		UpdatedAt:          a.UpdatedAt,
		ComContractID:      a.ComContractID,
		ReportName:         a.ReportName,
		ReportNO:           a.ReportNO,
		Songshen:           a.Songshen,
		SongshenJiagong:    a.SongshenJiagong,
		Shending:           a.Shending,
		ShendingJiagong:    a.ShendingJiagong,
		Shenjian:           a.Shenjian,
		ShenjianJiagong:    a.ShenjianJiagong,
		Yishen:             a.Yishen,
		YishenJiagong:      a.YishenJiagong,
		Zuizhong:           a.Zuizhong,
		ZuizhongJiagong:    a.ZuizhongJiagong,
		Zaojiazixun:        a.Zaojiazixun,
		ZaojiazixunJingban: a.ZaojiazixunJingban,
		ReportDate:         a.ReportDate,
		Copies:             a.Copies,
		ArchiveSN:          a.ArchiveSN,
		OutstandingAmount:  a.OutstandingAmount,
		IsDone:             a.IsDone,
		Remark:             a.Remark,
	}
	return item
}

// SettlementRecords 结算信息列表
type SettlementRecords []*SettlementRecord

// ToSchemaSettlementRecords 转换为结算信息对象列表
func (a SettlementRecords) ToSchemaSettlementRecords() []*schema.SettlementRecord {
	list := make([]*schema.SettlementRecord, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaSettlementRecord()
	}
	return list
}
