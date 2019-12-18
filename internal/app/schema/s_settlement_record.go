package schema

import (
	"time"
)

// SettlementRecord 结算信息对象
type SettlementRecord struct {
	RecordID           string    `json:"record_id" swaggo:"false, 记录ID"`                 // 记录ID
	Creator            string    `json:"creator" swaggo:"false, 创建者"`                    // 创建者
	CreatedAt          time.Time `json:"created_at"`                                     // 创建时间
	UpdatedAt          time.Time `json:"updated_at"`                                     // 更新时间
	ComContractID      string    `json:"comcontract_id" swaggo:"false, 合同ID"`            // 合同ID
	ReportNO           string    `json:"report_no" swaggo:"false, 报告编号"`                 // 报告编号
	ReportName         string    `json:"report_name" swaggo:"false, 报告名称"`               // 报告名称
	Songshen           float64   `json:"songshen" swaggo:"false, 送审值"`                   // 送审值
	SongshenJiagong    float64   `json:"songshen_jiagongg" swaggo:"false, 送审值 甲供金额"`     // 送审值 甲供金额
	Shending           float64   `json:"shending" swaggo:"false, 审定值"`                   // 审定值
	ShendingJiagong    float64   `json:"shending_jiagong" swaggo:"false, 审定值 甲供金额"`      // 审定值 甲供金额
	Shenjian           float64   `json:"shenjian" swaggo:"false, 审减值"`                   // 审减值
	ShenjianJiagong    float64   `json:"shenjian_jiagong" swaggo:"false, 审减值 甲供金额"`      // 审减值 甲供金额
	Yishen             float64   `json:"yishen" swaggo:"false, 一审值"`                     // 一审值
	YishenJiagong      float64   `json:"yishen_jiagong" swaggo:"false, 一审值 甲供金额"`        // 一审值 甲供金额
	Zuizhong           float64   `json:"zuizhong" swaggo:"false, 最终审定值"`                 // 最终审定值
	ZuizhongJiagong    float64   `json:"zuizhong_jiagong" swaggo:"false, 最终审定值 甲供金额"`    // 最终审定值 甲供金额
	Zaojiazixun        string    `json:"zaojiazixun" swaggo:"false, 造价咨询单位"`             // 造价咨询单位
	ZaojiazixunJingban string    `json:"zaojiazixun_jingban" swaggo:"false, 造价咨询单位 经办人"` // 造价咨询单位 经办人
	ReportDate         string    `json:"report_date" swaggo:"false, 报告日期"`               // 报告日期
	Copies             float64   `json:"copies" swaggo:"false, 份数"`                      // 份数
	ArchiveSN          string    `json:"archive_sn" swaggo:"false, 存档号 非必填"`             // 存档号 非必填
	IsDone             string    `json:"is_donw" swaggo:"false, 是否终止"`                   // 是否终止
	OutstandingAmount  float64   `json:"outstanding_amount" swaggo:"false, 未结算金额"`       // 未结算金额
	Remark             string    `json:"remark" swaggo:"false, 备注"`                      // 备注
}

// SettlementRecordQueryParam 查询条件
type SettlementRecordQueryParam struct {
	ComContractID string // 合同id
}

// SettlementRecordQueryOptions 查询可选参数项
type SettlementRecordQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// SettlementRecordQueryResult 查询结果
type SettlementRecordQueryResult struct {
	Data       SettlementRecords
	PageResult *PaginationResult
}

// SettlementRecords 结算信息列表
type SettlementRecords []*SettlementRecord
