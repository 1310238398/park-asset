package schema

import (
	"time"
)

// SettlementRecord 结算信息对象
type SettlementRecord struct {
	RecordID           string    `json:"record_id"`                     // 记录ID
	Creator            string    `json:"creator"`                       // 创建者
	CreatedAt          time.Time `json:"created_at"`                    // 创建时间
	UpdatedAt          time.Time `json:"updated_at"`                    // 更新时间
	ComContractID      string    `json:"comcontract_id;size:36;index;"` // 合同ID
	ReportNO           string    `json:"report_no"`                     // 报告编号
	ReportName         string    `json:"report_name"`                   // 报告名称
	Songshen           float64   `json:"songshen"`                      // 送审值
	SongshenJiagong    float64   `json:"songshen_jiagongg"`             // 送审值 甲供金额
	Shending           float64   `json:"shending"`                      // 审定值
	ShendingJiagong    float64   `json:"shending_jiagong"`              // 审定值 甲供金额
	Shenjian           float64   `json:"shenjian"`                      // 审减值
	ShenjianJiagong    float64   `json:"shenjian_jiagong"`              // 审减值 甲供金额
	Yishen             float64   `json:"yishen"`                        // 一审值
	YishenJiagong      float64   `json:"yishen_jiagong"`                // 一审值 甲供金额
	Zuizhong           float64   `json:"zuizhong"`                      // 最终审定值
	ZuizhongJiagong    float64   `json:"zuizhong_jiagong"`              // 最终审定值 甲供金额
	Zaojiazixun        string    `json:"zaojiazixun"`                   // 造价咨询单位
	ZaojiazixunJingban string    `json:"zaojiazixun_jingban"`           // 造价咨询单位 经办人
	ReportDate         string    `json:"report_date"`                   // 报告日期
	Copies             float64   `json:"copies"`                        // 份数
	ArchiveSN          string    `json:"archive_sn"`                    // 存档号 非必填
	IsDone             string    `json:"is_donw"`                       // 是否终止
	OutstandingAmount  float64   `json:"outstanding_amount"`            // 未结算金额
	Remark             string    `json:"remark"`                        // 备注
}

// SettlementRecordQueryParam 查询条件
type SettlementRecordQueryParam struct {
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
