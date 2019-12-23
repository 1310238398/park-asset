package schema

import (
	"time"
)

// ComContractAlter 变更管理对象
type ComContractAlter struct {
	RecordID  string    `json:"record_id"`  // 记录ID
	Creator   string    `json:"creator"`    // 创建者
	CreatedAt time.Time `json:"created_at"` // 创建时间
	UpdatedAt time.Time `json:"updated_at"` // 更新时间
}

// ComContractAlterQueryParam 查询条件
type ComContractAlterQueryParam struct {
}

// ComContractAlterQueryOptions 查询可选参数项
type ComContractAlterQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAlterQueryResult 查询结果
type ComContractAlterQueryResult struct {
	Data       ComContractAlters
	PageResult *PaginationResult
}

// ComContractAlters 变更管理列表
type ComContractAlters []*ComContractAlter

//////////////////////设计变更///////////////////////////

// ComContractAlterDesign 设计变更
type ComContractAlterDesign struct {
	RecordID        string    `json:"record_id" swaggo:"false, 记录ID"`              // 记录ID
	Creator         string    `json:"creator" swaggo:"false, 创建者"`                 // 创建者
	CreatedAt       time.Time `json:"created_at" swaggo:"false, 创建时间"`             // 创建时间
	UpdatedAt       time.Time `json:"updated_at" swaggo:"false, 更新时间"`             // 更新时间
	SN              string    `json:"sn" swaggo:"false, 变更编号"`                     // 变更编号
	Name            string    `json:"name" swaggo:"false, 变更主题名称"`                 // 变更主题名称
	ComContractID   string    `json:"comcontract_id" swaggo:"false, 合同编号"`         // 合同编号
	ComContractName string    `json:"comcontract_name" swaggo:"false, 合同名称"`       // 合同名称
	LaunchDept      string    `json:"launch_dept" swaggo:"false, 发起部门"`            // 发起部门
	LaunchPerson    string    `json:"launch_person" swaggo:"false, 发起人"`           // 发起人
	LaunchDate      string    `json:"launch_date" swaggo:"false, 发起日期"`            // 发起日期
	ModifyPosition  string    `json:"modify_position" swaggo:"false, 变更部位"`        // 变更部位
	Reason          string    `json:"reason" swaggo:"false, 变更原因"`                 // 变更原因
	ReasonOther     string    `json:"reason_other" swaggo:"false, 变更其他原因"`         // 变更其他原因
	Content         string    `json:"content" swaggo:"false, 变更内容"`                // 变更内容
	EstiMate        float64   `json:"estimate" swaggo:"false, 估算金额"`               // 估算金额
	OfficialAmount  float64   `json:"official_amount" swaggo:"false, 正式金额"`        // 正式金额
	WorkingState    uint8     `json:"working_state" swaggo:"false, 是否施工  0否 1 是"`  // 是否施工  0否 1 是
	PurchaseState   uint8     `json:"purchase_state" swaggo:"false, 是否采购  0否 1 是"` // 是否采购  0否 1 是
	CostInitial     uint8     `json:"cost_initial" swaggo:"false, 费用变化初判 0否 1 是"`  // 费用变化初判 0否 1 是
	NeedCheck       uint8     `json:"need_check" swaggo:"false, 是否需报批  0否 1是"`     // 是否需报批  0否 1是
	CostChange      uint8     `json:"cost_change" swaggo:"false, 成本增减  0否 1是"`     // 成本增减  0否 1是
	AlterType       string    `json:"alter_type" swaggo:"false, 变更类型: 一般变更 重大变更"`  // 变更类型: 一般变更 重大变更
	Remark          string    `json:"remark" swaggo:"false, 备注"`                   // 备注
	Status          uint8     `json:"status" swaggo:"false, 状态： 0 保存 1提交审核 2审核通过"` // 状态： 0 保存 1提交审核 2审核通过
}

// ComContractAlterDesignQueryParam 查询条件
type ComContractAlterDesignQueryParam struct {
}

// ComContractAlterDesignQueryOptions 查询可选参数项
type ComContractAlterDesignQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAlterDesignQueryResult 查询结果
type ComContractAlterDesignQueryResult struct {
	Data       ComContractAlterDesigns
	PageResult *PaginationResult
}

// ComContractAlterDesigns 变更管理列表
type ComContractAlterDesigns []*ComContractAlterDesign

/////////////////////签证变更///////////////////

// ComContractAlterSign 签证变更
type ComContractAlterSign struct {
	RecordID             string    `json:"record_id" swaggo:"false, 记录ID"`                            // 记录ID
	Creator              string    `json:"creator" swaggo:"false, 创建者"`                               // 创建者
	CreatedAt            time.Time `json:"created_at" swaggo:"false, 创建时间"`                           // 创建时间
	UpdatedAt            time.Time `json:"updated_at" swaggo:"false, 更新时间"`                           // 更新时间
	SN                   string    `json:"sn" swaggo:"false, 变更编号"`                                   // 变更编号
	Name                 string    `json:"name" swaggo:"false, 变更主题名称"`                               // 变更主题名称
	ComContractID        string    `json:"comcontract_id" swaggo:"false, 合同编号"`                       // 合同编号
	ComContractName      string    `json:"comcontract_name" swaggo:"false, 合同名称"`                     // 合同名称
	AlterDesignID        string    `json:"alter_design_id" swaggo:"false, 设计变更ID"`                    // 设计变更ID
	AlterDesignName      string    `json:"alter_design_name" swaggo:"false, 设计变更名称"`                  // 设计变更名称
	LaunchDept           string    `json:"launch_dept" swaggo:"false, 发起部门"`                          // 发起部门
	LaunchPerson         string    `json:"launch_person" swaggo:"false, 发起人"`                         // 发起人
	LaunchDate           string    `json:"launch_date" swaggo:"false, 发起日期"`                          // 发起日期
	WorkingCompany       string    `json:"working_company" swaggo:"false, 施工单位"`                      // 施工单位
	SupervisionCompany   string    `json:"supervision_company" swaggo:"false, 监理单位"`                  // 监理单位
	AlterSignType        string    `json:"alter_sign_type" swaggo:"false, 签证类型: 技术签证、经济签证、工期签证、其他签证"` // 签证类型: 技术签证、经济签证、工期签证、其他签证
	SubsectionName       string    `json:"subsection_name" swaggo:"false, 分布工程名称"`                    // 分布工程名称
	Reason               string    `json:"reason" swaggo:"false, 签证原因"`                               // 签证原因
	ReasonOther          string    `json:"reason_other" swaggo:"false, 变更其他原因"`                       // 变更其他原因
	Content              string    `json:"content" swaggo:"false, 变更内容"`                              // 变更内容
	EstiMate             float64   `json:"estimate" swaggo:"false, 签证报价"`                             // 签证报价
	SettlementAmount     float64   `json:"setttlement_amount" swaggo:"false, 结算金额"`                   // 结算金额
	WorkingCompanyCharge string    `json:"working_company_charge" swaggo:"false, 施工单位负责人"`            // 施工单位负责人
	ProjectStage         string    `json:"project_stage" swaggo:"false, 项目阶段"`                        // 项目阶段

	Jianliyijian      uint8   `json:"jianliyijian" swaggo:"false, 监理意见： 0 1上报审批"`       // 监理意见： 0 1上报审批
	Shejitu           uint8   `json:"shejitu" swaggo:"false, 是否设计出图 0 否  1 是"`          // 是否设计出图 0 否  1 是
	XianChangChengben uint8   `json:"xianchangchengben" swaggo:"false, 成本增减： 0减少  1增加"` // 成本增减： 0减少  1增加
	XianChangGusuan   float64 `json:"xianchanggusuan" swaggo:"false, 现场 估算金额"`          // 现场 估算金额

	Remark   string `json:"remark" swaggo:"false, 备注"`                   // 备注
	Status   uint8  `json:"status" swaggo:"false, 状态： 0 保存 1提交审核 2审核通过"` // 状态： 0 保存 1提交审核 2审核通过
	SignDate string `json:"sign_date" swaggo:"false, 签证日期"`              // 签证日期
}

// ComContractAlterSignQueryParam 查询条件
type ComContractAlterSignQueryParam struct {
}

// ComContractAlterSignQueryOptions 查询可选参数项
type ComContractAlterSignQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAlterSignQueryResult 查询结果
type ComContractAlterSignQueryResult struct {
	Data       ComContractAlterSigns
	PageResult *PaginationResult
}

// ComContractAlterSigns 变更管理列表
type ComContractAlterSigns []*ComContractAlterSign

/////////////////////////////材料批价/////////////////////////////////////

// ComContractAlterStuffPrice 材料批价
type ComContractAlterStuffPrice struct {
	RecordID        string                          `json:"record_id" swaggo:"false, 记录ID"`              // 记录ID
	Creator         string                          `json:"creator" swaggo:"false, 创建者"`                 // 创建者
	CreatedAt       time.Time                       `json:"created_at" swaggo:"false, 创建时间"`             // 创建时间
	UpdatedAt       time.Time                       `json:"updated_at" swaggo:"false, 更新时间"`             // 更新时间
	SN              string                          `json:"sn" swaggo:"false, 批价编号"`                     //  批价编号
	Name            string                          `json:"name" swaggo:"false, 合同名称"`                   // 合同名称
	ComContractID   string                          `json:"comcontract_id" swaggo:"false, 合同编号"`         // 合同编号
	ComContractName string                          `json:"comcontract_name" swaggo:"false, 合同名称"`       // 合同名称
	AlterDesignID   string                          `json:"alter_design_id" swaggo:"false, 设计变更ID"`      // 设计变更ID
	AlterDesignName string                          `json:"alter_design_name" swaggo:"false, 设计变更名称"`    // 设计变更名称
	AlterSignID     string                          `json:"alter_sign_id" swaggo:"false, 签证变更ID"`        // 签证变更ID
	AlterSignName   string                          `json:"alter_sign_name" swaggo:"false, 签证变更名称"`      // 签证变更名称
	LaunchDept      string                          `json:"launch_dept" swaggo:"false, 发起部门"`            // 发起部门
	LaunchPerson    string                          `json:"launch_person" swaggo:"false, 发起人"`           // 发起人
	LaunchDate      string                          `json:"launch_date" swaggo:"false, 发起日期"`            // 发起日期
	WorkingCompany  string                          `json:"working_company" swaggo:"false, 施工单位"`        // 施工单位
	Reason          string                          `json:"reason" swaggo:"false, 签证原因"`                 // 签证原因
	ReasonOther     string                          `json:"reason_other" swaggo:"false, 变更其他原因"`         // 变更其他原因
	Content         string                          `json:"content" swaggo:"false, 变更内容"`                // 变更内容
	Remark          string                          `json:"remark" swaggo:"false, 备注"`                   // 备注
	Status          uint8                           `json:"status" swaggo:"false, 状态： 0 保存 1提交审核 2审核通过"` // 状态： 0 保存 1提交审核 2审核通过
	SignDate        string                          `json:"sign_date" swaggo:"false, 签证日期"`              // 签证日期
	Quotes          ComContractAlterStuffPriceItems `json:"quotes" swaggo:"false, 各材料报价列表"`              //各材料报价列表
}

// ComContractAlterStuffPriceQueryParam 查询条件
type ComContractAlterStuffPriceQueryParam struct {
}

// ComContractAlterStuffPriceQueryOptions 查询可选参数项
type ComContractAlterStuffPriceQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAlterStuffPriceQueryResult 查询结果
type ComContractAlterStuffPriceQueryResult struct {
	Data       ComContractAlterStuffPrices
	PageResult *PaginationResult
}

// ComContractAlterStuffPrices 变更管理列表
type ComContractAlterStuffPrices []*ComContractAlterStuffPrice

/////////////////////材料批价表////////////////////////////

// ComContractAlterStuffPriceItem 材料批价表
type ComContractAlterStuffPriceItem struct {
	RecordID          string    `json:"record_id" swaggo:"false, 记录ID"`              // 记录ID
	Creator           string    `json:"creator" swaggo:"false, 创建者"`                 // 创建者
	CreatedAt         time.Time `json:"created_at" swaggo:"false, 创建时间"`             // 创建时间
	UpdatedAt         time.Time `json:"updated_at" swaggo:"false, 更新时间"`             // 更新时间
	AlterStuffPriceID string    `json:"alter_stuff_price_id" swaggo:"false, 材料批价id"` // 材料批价id
	Name              string    `json:"name" swaggo:"false, 合同名称"`                   // 合同名称
	Specification     string    `json:"specification" swaggo:"false, 规格"`            // 规格
	Unit              string    `json:"unit" swaggo:"false, 单位"`                     // 单位
	Count             uint      `json:"count" swaggo:"false, 数量"`                    // 数量
	QuoteW            float64   `json:"quote_w" swaggo:"false, 施工单位报价"`              //  施工单位报价
	QuoteC            float64   `json:"quote_c" swaggo:"false, 建设单位报价"`              //  建设单位报价
	Remark            string    `json:"remark" swaggo:"false, 备注"`                   // 备注
	Status            uint8     `json:"status" swaggo:"false, 状态 0 1通过审核"`           // 状态 0 1通过审核

}

// ComContractAlterStuffPriceItemQueryParam 查询条件
type ComContractAlterStuffPriceItemQueryParam struct {
}

// ComContractAlterStuffPriceItemQueryOptions 查询可选参数项
type ComContractAlterStuffPriceItemQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAlterStuffPriceItemQueryResult 查询结果
type ComContractAlterStuffPriceItemQueryResult struct {
	Data       ComContractAlterStuffPriceItems
	PageResult *PaginationResult
}

// ComContractAlterStuffPriceItems 变更管理列表
type ComContractAlterStuffPriceItems []*ComContractAlterStuffPriceItem
