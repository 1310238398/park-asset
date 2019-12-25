package schema

import (
	"time"
)

// ProjDynamicCost 项目动态成本
type ProjDynamicCost struct {
	CostName   string  `json:"cost_name" swaggo:"false,成本项名称"`      //成本项名称
	ProjCostID string  `json:"proj_cost_id" swaggo:"false,项目成本项ID"` //项目成本项ID
	TargetCost float64 `json:"target_cost" swaggo:"false,目标成本"`     // 目标成本
	Settled    float64 `json:"settled" swaggo:"false,结算成本"`         //结算成本
	Unsettled  float64 `json:"unsettled" swaggo:"false,待结算成本"`      //待结算成本
	OnApproval float64 `json:"on_approval" swaggo:"false,在途成本"`     // 在途成本
	All        float64 `json:"all" swaggo:"false,最终成本"`             // 最终成本
	Transfer   float64 `json:"transfer" swaggo:"false,调动金额"`        // 调动金额
	Balance    float64 `json:"balance" swaggo:"false,余额"`           // 余额
	Freeze     float64 `json:"freeze" swaggo:"false,冻结金额"`          // 冻结金额
}

// ProjDynamicCostTree 项目动态成本科目树结构
type ProjDynamicCostTree struct {
	CostID         string `json:"cost_id" swaggo:"false,成本项ID"`           //成本ID
	CostParentID   string `json:"cost_parent_id" swaggo:"false,成本父级ID"`   //成本父级ID
	CostParentPath string `json:"cost_parent_path" swaggo:"false,成本父级路径"` //成本父级路径
	ProjDynamicCost
	Children []*ProjDynamicCostTree `json:"children" swaggo:"false,下级列表"` //下级列表
}

// ProjDynamicCostTrees 项目动态成本科目树结构
type ProjDynamicCostTrees []*ProjDynamicCostTree

func (a ProjDynamicCostTrees) ToTree() ProjDynamicCostTrees {
	result := ProjDynamicCostTrees{}
	for _, v := range a {
		for _, w := range a {
			if v.CostParentID == "" {
				result = append(result, v)
			} else if v.CostParentID == w.CostID {
				w.Children = append(w.Children, v)
			}
		}
	}
	return result
}

// ProjDynamicCostSimpleTree 项目动态成本科目简化树结构
type ProjDynamicCostSimpleTree struct {
	CostName       string  `json:"cost_name" swaggo:"false,成本项名称"`         //成本项名称
	CostID         string  `json:"cost_id" swaggo:"false,成本项ID"`           //成本ID
	CostParentID   string  `json:"cost_parent_id" swaggo:"false,成本父级ID"`   //成本父级ID
	CostParentPath string  `json:"cost_parent_path" swaggo:"false,成本父级路径"` //成本父级路径
	ProjCostID     string  `json:"proj_cost_id" swaggo:"false,项目成本ID"`     //项目成本ID
	TargetCost     float64 `json:"target_cost" swaggo:"false,目标成本"`        // 目标成本
	PlanAmount     float64 `json:"plan_amount" swaggo:"false,规划金额"`        // 规划金额
	LeftAmount     float64 `json:"left_amount" swaggo:"false,规划余量"`        // 规划余量

	Children []*ProjDynamicCostSimpleTree `json:"children" swaggo:"下级列表"` //下级列表
}

// ProjDynamicSimpleTree 项目动态成本简化树结构
type ProjDynamicSimpleTree struct {
	Name           string  `json:"name" swaggo:"false,项目名称"`               //项目名称
	CostID         string  `json:"cost_id" swaggo:"false,成本项ID"`           //成本ID
	CostParentID   string  `json:"cost_parent_id" swaggo:"false,成本父级ID"`   //成本父级ID
	CostParentPath string  `json:"cost_parent_path" swaggo:"false,成本父级路径"` //成本父级路径
	ProjCostID     string  `json:"proj_cost_id" swaggo:"false,项目成本ID"`     //项目成本ID
	Type           int     `json:"type" swaggo:"false,类型"`                 //类型（1.末级成本科目，2.合约规划，3.非末级成本科目）
	Balance        float64 `json:"balance" swaggo:"false,余额"`              // 余额

	Children []*ProjDynamicSimpleTree `json:"children" swaggo:"下级列表"` //下级列表
}

// ProjDynamicPlanning 项目动态合约规划
type ProjDynamicPlanning struct {
	ProjPlanningID string  `json:"proj_planning_id" swaggo:"false,项目合约规划ID"` // 项目合约规划ID
	Planning       float64 `json:"planning" swaggo:"false,规划成本"`             // 规划成本
	Settled        float64 `json:"settled" swaggo:"false,结算成本"`              // 结算成本
	Outstanding    float64 `json:"unsettled" swaggo:"false,待结算成本"`           // 待结算成本
	OnApproval     float64 `json:"on_approval" swaggo:"false,在途成本"`          // 在途成本
	Excute         float64 `json:"excute" swaggo:"false,执行金额"`               // 执行金额
	Transfer       float64 `json:"transfer" swaggo:"false,调动金额"`             // 调动金额
	Balance        float64 `json:"balance" swaggo:"false,余额"`                // 余额
	Freeze         float64 `json:"freeze" swaggo:"false,冻结金额"`               // 冻结金额
}

// ProjDynamicSettled 项目动态合约规划
type ProjDynamicSettled struct {
	ContractID   string  `json:"contract_id" swaggo:"false,合同ID"`   // 合同ID
	ContractName string  `json:"contract_name" swaggo:"false,合同名称"` // 合同名称
	ContractNum  string  `json:"contract_num" swaggo:"false,合同编号"`  // 合同编号
	ContractType int     `json:"contract_type" swaggo:"false,合同类型"` // 合同类型
	Amount       float64 `json:"amount" swaggo:"false, 合同金额"`       // 合同金额
	Settled      float64 `json:"settled" swaggo:"false,结算金额"`       //结算金额
}

// ProjDynamicUnsettled 项目动态合约规划
type ProjDynamicUnsettled struct {
	ContractID   string  `json:"contract_id" swaggo:"false,合同ID"`   // 合同ID
	ContractName string  `json:"contract_name" swaggo:"false,合同名称"` // 合同名称
	ContractNum  string  `json:"contract_num" swaggo:"false,合同编号"`  // 合同编号
	ContractType int     `json:"contract_type" swaggo:"false,合同类型"` // 合同类型
	Amount       float64 `json:"amount" swaggo:"false, 合同金额"`       // 合同金额
	Unsettled    float64 `json:"unsettled" swaggo:"false,待结算金额"`    //待结算金额
}

// ProjDynamicOnApproval 项目动态在途金额
type ProjDynamicOnApproval struct {
	ContractID   string  `json:"contract_id" swaggo:"false,合同ID"`   // 合同ID
	ContractName string  `json:"contract_name" swaggo:"false,合同名称"` // 合同名称
	ContractNum  string  `json:"contract_num" swaggo:"false,合同编号"`  // 合同编号
	ContractType int     `json:"contract_type" swaggo:"false,合同类型"` // 合同类型
	Amount       float64 `json:"amount" swaggo:"false, 合同金额"`       // 合同金额
	OnApproval   float64 `json:"on_approval" swaggo:"false,在途金额"`   // 在途金额
	Stauts       string  `json:"status" swaggo:"false,审核状态"`        // 审核状态
}

// ProjDynamicTransfer 项目动态资金调动信息
type ProjDynamicTransfer struct {
	TransferType     int       `json:"transfer_type" swaggo:"false,调动类型（1.调出，2.调入，3.内部调整）"` // 调动类型
	FromCostName     string    `json:"from_cost_name" swaggo:"false,调出科目名称"`                // 调出科目名称
	FromPlanningName string    `json:"from_planning_name" swaggo:"false,调出规划名称"`            //调出规划名称
	ToCostName       string    `json:"to_cost_name" swaggo:"false,调入科目名称"`                  // 调出科目名称
	ToPlanningName   string    `json:"to_planning_name" swaggo:"false,调入规划名称"`              //调出规划名称
	Amount           float64   `json:"amount" swaggo:"false, 调动金额"`                         //合同金额
	PassTime         time.Time `json:"pass_time" swaggo:"false,审批通过时间"`                     //审批通过时间
}

// ProjDynamicTransferRequest 项目动态资金调动请求
type ProjDynamicTransferRequest struct {
	ToProjCostID     string                         `json:"to_proj_cost_id" swaggo:"true,调入科目ID"`
	ToProjPlanningID string                         `json:"to_proj_planning_id" swaggo:"true,调入科目ID"`
	FromList         []*ProjDynamicTransferFromitem `json:"from_list" swaggo:"true,调出列表"`
}

type ProjDynamicTransferFromitem struct {
	FromProjCostID     string  `json:"from_proj_cost_id" swaggo:"false,调出科目ID"`
	FromProjPlanningID string  `json:"from_proj_planning_id" swaggo:"false,调出规划ID"`
	Amount             float64 `json:"amount" swaggo:"false,金额"`
}
