package schema

import (
	"time"
)

// ComContract 合同管理对象
type ComContract struct {
	ID                    uint                     `json:"id"`                                        //自增id
	RecordID              string                   `json:"record_id"`                                 // 记录ID
	Creator               string                   `json:"creator"`                                   // 创建者
	CreatedAt             time.Time                `json:"created_at"`                                // 创建时间
	UpdatedAt             time.Time                `json:"updated_at"`                                // 更新时间
	ProjectID             string                   `json:"project_id"`                                //所属项目id
	ContractPlanningID    string                   `json:"contract_planning_id"`                      //所属合约规划
	ContractPlanningDone  uint8                    `json:"contract_planning_done"`                    // 合约规划是否引用完
	Category              string                   `json:"category"`                                  //合同类别
	Subject               string                   `json:"subject"`                                   //合同科目
	SubjectSubItem        string                   `json:"subject_subitem"`                           //所属科目分项
	SN                    string                   `json:"sn"`                                        //合同编号
	Name                  string                   `json:"name" binding="required" swago:"true,合同名称"` //合同名称
	Property              string                   `json:"property"`                                  //合同性质:直接合同，三方合同，其他
	Supplement            string                   `json:"supplement"`                                //是否是补充合同
	Virtual               string                   `json:"virtual"`                                   //是否虚拟合同
	ParentComContractID   string                   `json:"parent_comcontract_id"`                     //是哪个合同的补充合同 record_id
	ParentComContractName string                   `json:"parent_comcontract_name"`                   //原合同名称
	Jiafang               string                   `json:"jiafang"`                                   //甲方
	JiafangSign           string                   `json:"jiafang_sign"`                              //甲方签字
	Yifang                string                   `json:"yifang"`                                    //乙方
	YifangSign            string                   `json:"yifang_sign"`                               //乙方签字
	Bingfang              string                   `json:"bingfang"`                                  //丙方
	BingfangSign          string                   `json:"bingfang_sign"`                             //丙方签字
	Amount                float64                  `json:"amount"`                                    //合同金额
	OverAmountSource      string                   `json:"over_amount_source"`                        //合同金额超出合约规划后 需要注明来源
	JiaStuffsAmount       float64                  `json:"jia_stuffs_amount"`                         //甲方供应材料金额
	UnCostAmount          float64                  `json:"uncost_amount"`                             //不计成本金额
	ValiSignAmount        float64                  `json:"vali_sign_amount"`                          //有效签约金额
	SignDate              string                   `json:"sign_date"`                                 //签约日期
	PayType               string                   `json:"pay_type"`                                  //付款方式
	PayPrecondition       string                   `json:"pay_precondition"`                          //付款条件
	Settlement            uint8                    `json:"settlement"`                                // 是否结算
	Content               string                   `json:"content"`                                   // 合同内容
	Attas                 []*ComContractAttachment `json:"attas"`                                     //合同附件
	//合同状态 0暂存 1 审批中 2 审批驳回  3 审批通过(未生效)5 合同生效(填上合同编号)
	Status uint   `json:"status"`
	Remark string `json:"remark"` //备注
}

//ComContractModify 合同变更
type ComContractModify struct {
	ID            uint      `json:"id"`             //自增id
	RecordID      string    `json:"record_id"`      // 记录ID
	Creator       string    `json:"creator"`        // 创建者
	CreatedAt     time.Time `json:"created_at"`     // 创建时间
	UpdatedAt     time.Time `json:"updated_at"`     // 更新时间
	ComContractID int       `json:"comcontract_id"` //所属合同id
	ContractName  string    `json:"contract_name"`  //合同名称
	ContractSN    string    `json:"contract_sn"`    //合同编号
	ModifyType    string    `json:"contract_type"`  //变更类型:设计变更 签证变更 材料批价
	//
	NeedApproval       string                   `json:"need_approval"`        //是否需要审批
	LaunchDept         string                   `json:"launch_dept"`          //发起部门
	LaunchPerson       string                   `json:"launch_person"`        //发起人
	LaunchDate         string                   `json:"launch_date"`          //发起日期
	NextApprovalStep   string                   `json:"next_approval_step"`   //下一步审批步骤
	NextApprovalPerson string                   `json:"next_approval_person"` //下一步审批人
	Attas              []*ComContractAttachment `json:"attas"`                //附件
	Status             uint                     `json:"status"`               //合同变更状态
	//合同变更 具体项目
	ModifySN          string                  `json:"modify_sn"`       //变更编号 签证编号  批价编号
	SignType          string                  `json:"sign_type"`       //签证类型
	ModifyPosition    string                  `json:"modify_position"` //变更部位
	Reason            string                  `json:"reason"`          //变更原因 三者共用
	WorkState         string                  `json:"work_state"`      //是否已经施工: 设计变更
	PurchaseState     string                  `json:"puchase_state"`   //是否已采购: 设计变更
	SignContent       string                  `json:"sign_content"`    //签证内容: 签证变更
	CalculationAmount int                     `json:"calcul_amount"`   //估算金额: 签证变更
	Offer             int                     `json:"offer"`           //报价:签证变更
	WorkDept          string                  `json:"work_dept"`       // 施工单位: 批价变更
	StuffPricesList   []*ComConStuffPriceList //材料报价表
	//
}

//ComConStuffPriceList 材料批价表
type ComConStuffPriceList struct {
	ID             int       `json:"id"`              //自增id
	RecordID       string    `json:"record_id"`       // 记录ID
	Creator        string    `json:"creator"`         // 创建者
	CreatedAt      time.Time `json:"created_at"`      // 创建时间
	UpdatedAt      time.Time `json:"updated_at"`      // 更新时间
	ModifyID       int       `json:"modify_id"`       //变更编号
	ItemName       string    `json:"item_name"`       //项目名称
	WorkDept       string    `json:"work_dept"`       //施工单位
	Name           string    `json:"name"`            //材料名称
	Unit           string    `json:"unit"`            //材料单位
	Count          int       `json:"count"`           //数量
	OfferAmount    float64   `json:"offer_amount"`    //施工单位报价合计
	ProposalAmount float64   `json:"proposal_amount"` //提案报价合计
	FinalAmount    float64   `json:"final_amount"`    //审定报价合计
}

// ComContractModifyDesign 设计变更
type ComContractModifyDesign struct {
	ID             int
	RecordID       string    `json:"record_id"`      // 记录ID
	Creator        string    `json:"creator"`        // 创建者
	CreatedAt      time.Time `json:"created_at"`     // 创建时间
	UpdatedAt      time.Time `json:"updated_at"`     // 更新时间
	ComContractID  int       `json:"comcontract_id"` //所属合同id
	ModifyID       int       `json:"modify_id"`      //所属合同变更id
	ModifySN       string
	SignType       string
	ModifyPosition string
	Reason         string
	WorkingState   string //是否已经施工
	PurchaseState  string //是否已采购
}

// ComContractModifySign 签证变更
type ComContractModifySign struct {
	ID                int
	RecordID          string    `json:"record_id"`      // 记录ID
	Creator           string    `json:"creator"`        // 创建者
	CreatedAt         time.Time `json:"created_at"`     // 创建时间
	UpdatedAt         time.Time `json:"updated_at"`     // 更新时间
	ComContractID     int       `json:"comcontract_id"` //所属合同id
	ModifyID          int       `json:"modify_id"`      //所属合同变更id
	SignSN            string
	SignType          string
	Reason            string
	SignContent       string
	CalculationAmount int //估算金额
	Offer             int //报价
}

//ComContractStuffApprPrice 材料批价表
type ComContractStuffApprPrice struct {
	ID              int
	RecordID        string                  `json:"record_id"`      // 记录ID
	Creator         string                  `json:"creator"`        // 创建者
	CreatedAt       time.Time               `json:"created_at"`     // 创建时间
	UpdatedAt       time.Time               `json:"updated_at"`     // 更新时间
	ComContractID   int                     `json:"comcontract_id"` //所属合同id
	ModifyID        int                     `json:"modify_id"`      //所属合同变更id
	ApprSN          string                  `json:"appr_sn"`        // 批价编号
	WorkDept        string                  `json:"work_dept"`      // 施工单位
	Reason          string                  `json:"reason"`         // 变更原因
	StuffPricesList []*ComConStuffPriceList //材料报价表
}

// ComContractQueryParam 查询条件
type ComContractQueryParam struct {
	Status   int    `json:"status"` // 合同状态
	Name     string `json:"name"`   // 合同名称
	SN       string `json:"sn"`     // 合同编号
	Category string `json:"cate"`   // 合同类别
}

// ComContractQueryOptions 查询可选参数项
type ComContractQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractQueryResult 查询结果
type ComContractQueryResult struct {
	Data       ComContracts
	PageResult *PaginationResult
}

// ComContracts 合同管理列表
type ComContracts []*ComContract

// ComContractEffectInfo 设置生效请求结构体
type ComContractEffectInfo struct {
	SN       string                   `json:"sn" binding:"required" swaggo:"true,合同正式编号"`         //合同正式编号
	SignDate string                   `json:"sign_date" binding:"required" swaggo:"true,合同签署日期"`  //合同签署日期
	Attas    []*ComContractAttachment `json:"attas" binding:"required,gt=0" swaggo:"true,正式合同附件"` //正式合同附件
}
