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
	RecordID        string    `json:"record_id"`        // 记录ID
	Creator         string    `json:"creator"`          // 创建者
	CreatedAt       time.Time `json:"created_at"`       // 创建时间
	UpdatedAt       time.Time `json:"updated_at"`       // 更新时间
	SN              string    `json:"sn"`               // 变更编号
	Name            string    `json:"name"`             // 变更主题名称
	ComContractID   string    `json:"comcontract_id"`   // 合同编号
	ComContractName string    `json:"comcontract_name"` // 合同名称
	LaunchDept      string    `json:"launch_dept"`      // 发起部门
	LaunchPerson    string    `json:"launch_person"`    // 发起人
	LaunchDate      string    `json:"launch_date"`      // 发起日期
	ModifyPosition  string    `json:"modify_position"`  // 变更部位
	Reason          string    `json:"reason"`           // 变更原因
	ReasonOther     string    `json:"reason_other"`     // 变更其他原因
	Content         string    `json:"content"`          // 变更内容
	EstiMate        float64   `json:"estimate"`         // 估算金额
	OfficialAmount  float64   `json:"official_amount"`  // 正式金额
	WorkingState    uint8     `json:"working_state"`    // 是否施工  0否 1 是
	PurchaseState   uint8     `json:"purchase_state"`   // 是否采购  0否 1 是
	CostInitial     uint8     `json:"cost_initial"`     // 费用变化初判 0否 1 是
	NeedCheck       uint8     `json:"need_check"`       // 是否需报批  0否 1是
	CostChange      uint8     `json:"cost_change"`      // 成本增减  0否 1是
	AlterType       string    `json:"alter_type"`       // 变更类型: 一般变更 重大变更
	Remark          string    `json:"remark"`           // 备注
	Status          uint8     `json:"status"`           // 状态： 0 保存 1提交审核 2审核通过
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
	RecordID             string    `json:"record_id"`                    // 记录ID
	Creator              string    `json:"creator"`                      // 创建者
	CreatedAt            time.Time `json:"created_at"`                   // 创建时间
	UpdatedAt            time.Time `json:"updated_at"`                   // 更新时间
	SN                   string    `json:"sn"`                           // 变更编号
	Name                 string    `json:"name"`                         // 变更主题名称
	ComContractID        string    `json:"comcontract_id;size:36;index"` // 合同编号
	ComContractName      string    `json:"comcontract_name"`             // 合同名称
	AlterDesignID        string    `json:"alter_design_id"`              // 设计变更ID
	AlterDesignName      string    `json:"alter_design_name"`            // 设计变更名称
	LaunchDept           string    `json:"launch_dept"`                  // 发起部门
	LaunchPerson         string    `json:"launch_person"`                // 发起人
	LaunchDate           string    `json:"launch_date"`                  // 发起日期
	WorkingCompany       string    `json:"working_company"`              // 施工单位
	SupervisionCompany   string    `json:"supervision_company"`          // 监理单位
	AlterSignType        string    `json:"alter_sign_type"`              // 签证类型: 技术签证、经济签证、工期签证、其他签证
	SubsectionName       string    `json:"subsection_name"`              // 分布工程名称
	Reason               string    `json:"reason"`                       // 签证原因
	ReasonOther          string    `json:"reason_other"`                 // 变更其他原因
	Content              string    `json:"content"`                      // 变更内容
	EstiMate             float64   `json:"estimate"`                     // 签证报价
	SettlementAmount     float64   `json:"setttlement_amount"`           // 结算金额
	WorkingCompanyCharge string    `json:"working_company_charge"`       // 施工单位负责人
	ProjectStage         string    `json:"project_stage"`                // 项目阶段

	Jianliyijian      uint8   `json:"jianliyijian"`      // 监理意见： 0 1上报审批
	Shejitu           uint8   `json:"shejitu"`           // 是否设计出图 0 否  1 是
	XianChangChengben uint8   `json:"xianchangchengben"` // 成本增减： 0减少  1增加
	XianChangGusuan   float64 `json:"xianchanggusuan"`   // 现场 估算金额

	Remark   string `json:"remark"`    // 备注
	Status   uint8  `json:"status"`    // 状态： 0 保存 1提交审核 2审核通过
	SignDate string `json:"sign_date"` // 签证日期
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
	RecordID        string    `json:"record_id"`         // 记录ID
	Creator         string    `json:"creator"`           // 创建者
	CreatedAt       time.Time `json:"created_at"`        // 创建时间
	UpdatedAt       time.Time `json:"updated_at"`        // 更新时间
	SN              string    `json:"sn"`                //  批价编号
	Name            string    `json:"name"`              // 合同名称
	ComContractID   string    `json:"comcontract_id"`    // 合同编号
	ComContractName string    `json:"comcontract_name"`  // 合同名称
	AlterDesignID   string    `json:"alter_design_id"`   // 设计变更ID
	AlterDesignName string    `json:"alter_design_name"` // 设计变更名称
	AlterSignID     string    `json:"alter_sign_id"`     // 签证变更ID
	AlterSignName   string    `json:"alter_sign_name"`   // 签证变更名称
	LaunchDept      string    `json:"launch_dept"`       // 发起部门
	LaunchPerson    string    `json:"launch_person"`     // 发起人
	LaunchDate      string    `json:"launch_date"`       // 发起日期
	WorkingCompany  string    `json:"working_company"`   // 施工单位
	Reason          string    `json:"reason"`            // 签证原因
	ReasonOther     string    `json:"reason_other"`      // 变更其他原因
	Content         string    `json:"content"`           // 变更内容
	Remark          string    `json:"remark"`            // 备注
	Status          uint8     `json:"status"`            // 状态： 0 保存 1提交审核 2审核通过
	SignDate        string    `json:"sign_date"`         // 签证日期
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
	RecordID          string    `json:"record_id"`            // 记录ID
	Creator           string    `json:"creator"`              // 创建者
	CreatedAt         time.Time `json:"created_at"`           // 创建时间
	UpdatedAt         time.Time `json:"updated_at"`           // 更新时间
	AlterStuffPriceID string    `json:"alter_stuff_price_id"` // 材料批价id
	Name              string    `json:"name"`                 // 合同名称
	Specification     string    `json:"specification"`        // 规格
	Unit              string    `json:"unit"`                 // 单位
	Count             uint      `json:"count"`                // 数量
	QuoteW            float64   `json:"quote_w"`              //  施工单位报价
	QuoteC            float64   `json:"quote_c"`              //  建设单位报价
	Remark            string    `json:"remark"`               // 备注
	Status            uint8     `json:"status"`               // 状态 0 1通过审核

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
