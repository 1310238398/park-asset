package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetComContractDB 合同管理
func GetComContractDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContract{})
}

// SchemaComContract 合同管理
type SchemaComContract schema.ComContract

// ToComContract 转换为合同管理实体
func (a SchemaComContract) ToComContract() *ComContract {
	item := &ComContract{
		RecordID:             &a.RecordID,
		Creator:              &a.Creator,
		ProjectID:            a.ProjectID,
		ContractPlanningID:   a.ContractPlanningID,
		Category:             a.Category,
		Subject:              a.Subject,
		SubjectSubItem:       a.SubjectSubItem,
		SN:                   a.SN,
		Name:                 a.Name,
		Property:             a.Property,
		Supplement:           a.Supplement,
		ParentComContractID:  a.ParentComContractID,
		Jiafang:              a.Jiafang,
		JiafangSign:          a.JiafangSign,
		Yifang:               a.Yifang,
		YifangSign:           a.YifangSign,
		Bingfang:             a.Bingfang,
		BingfangSign:         a.BingfangSign,
		Amount:               a.Amount,
		OverAmountSource:     a.OverAmountSource,
		JiaStuffsAmount:      a.JiaStuffsAmount,
		UnCostAmount:         a.UnCostAmount,
		ValiSignAmount:       a.ValiSignAmount,
		SignDate:             a.SignDate,
		PayType:              a.PayType,
		PayPrecondition:      a.PayPrecondition,
		Content:              a.Content,
		Settlement:           a.Settlement,
		ContractPlanningDone: a.ContractPlanningDone,
		Virtual:              a.Virtual,
		Status:               a.Status,
		Remark:               a.Remark,
	}
	return item
}

// ComContract 合同管理实体
type ComContract struct {
	Model
	RecordID             *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Creator              *string `gorm:"column:creator;size:36;index;"`   // 创建者
	ProjectID            string  `gorm:"column:project_id"`               // 项目id
	ContractPlanningID   string  `gorm:"column:contract_planning_id"`     // 所属合约规划
	Category             string  `gorm:"column:category"`                 // 合同类别
	Subject              string  `gorm:"column:subject"`                  // 合同科目
	SubjectSubItem       string  `gorm:"column:subject_subitem"`          // 所属科目分项
	SN                   string  `gorm:"column:sn;index"`                 // 合同编号
	Name                 string  `gorm:"column:name;index"`               // 合同名称
	Property             string  `gorm:"column:property"`                 // 合同性质
	Supplement           string  `gorm:"column:supplement"`               // 是否是补充合同
	ParentComContractID  string  `gorm:"column:parent_comcontract_id"`    // 是哪个合同的补充合同 record_id
	Jiafang              string  `gorm:"column:jiafang"`                  // 甲方
	JiafangSign          string  `gorm:"column:jiafang_sign"`             // 甲方签字
	Yifang               string  `gorm:"column:yifang"`                   // 乙方
	YifangSign           string  `gorm:"column:yifang_sign"`              // 乙方签字
	Bingfang             string  `gorm:"column:bingfang"`                 // 丙方
	BingfangSign         string  `gorm:"column:bingfang_sign"`            // 丙方签字
	Amount               float64 `gorm:"column:amount"`                   // 合同金额
	ContractPlanningDone uint8   `gorm:"column:contract_planning_done"`   // 合约规划是否引用完 0 否 1是
	OverAmountSource     string  `gorm:"column:over_amount_source"`       // 合同金额超出合约规划后 需要注明来源
	Settlement           uint8   `gorm:"column:settlement"`               // 是否结算 0 不结算 1结算
	ValiSignAmount       float64 `gorm:"column:vali_sign_amount"`         // 有效签约金额
	Virtual              string  `gorm:"column:virtual"`                  //是否虚拟合同
	JiaStuffsAmount      float64 `gorm:"column:jia_stuffs_amount"`        // 甲方供应材料金额
	UnCostAmount         float64 `gorm:"column:uncost_amount"`            // 不计成本金额
	SignDate             string  `gorm:"column:sign_date"`                // 签约日期
	PayType              string  `gorm:"column:pay_type"`                 // 付款方式
	PayPrecondition      string  `gorm:"column:pay_precondition"`         // 付款条件
	Content              string  `gorm:"column:content"`                  // 合同内容
	Remark               string  `gorm:"column:remark"`                   // 备注
	// 合同状态 0暂存 1 审批中 2 审批驳回  3 审批通过(未生效)5 合同生效(填上合同编号)
	Status uint `gorm:"column:status"`
}

// TableName 表名
func (a ComContract) TableName() string {
	return a.Model.TableName("com_contract")
}

// ToSchemaComContract 转换为合同管理对象
func (a ComContract) ToSchemaComContract() *schema.ComContract {
	item := &schema.ComContract{
		ID:                   a.ID,
		RecordID:             *a.RecordID,
		Creator:              *a.Creator,
		CreatedAt:            a.CreatedAt,
		UpdatedAt:            a.UpdatedAt,
		ProjectID:            a.ProjectID,
		ContractPlanningID:   a.ContractPlanningID,
		Category:             a.Category,
		Subject:              a.Subject,
		SubjectSubItem:       a.SubjectSubItem,
		SN:                   a.SN,
		Name:                 a.Name,
		Property:             a.Property,
		Supplement:           a.Supplement,
		ParentComContractID:  a.ParentComContractID,
		Jiafang:              a.Jiafang,
		JiafangSign:          a.JiafangSign,
		Yifang:               a.Yifang,
		YifangSign:           a.YifangSign,
		Bingfang:             a.Bingfang,
		BingfangSign:         a.BingfangSign,
		Amount:               a.Amount,
		OverAmountSource:     a.OverAmountSource,
		JiaStuffsAmount:      a.JiaStuffsAmount,
		UnCostAmount:         a.UnCostAmount,
		ValiSignAmount:       a.ValiSignAmount,
		SignDate:             a.SignDate,
		PayType:              a.PayType,
		PayPrecondition:      a.PayPrecondition,
		Content:              a.Content,
		Settlement:           a.Settlement,
		ContractPlanningDone: a.ContractPlanningDone,
		Virtual:              a.Virtual,
		Status:               a.Status,
		Remark:               a.Remark,
	}
	return item
}

// ComContracts 合同管理列表
type ComContracts []*ComContract

// ToSchemaComContracts 转换为合同管理对象列表
func (a ComContracts) ToSchemaComContracts() []*schema.ComContract {
	list := make([]*schema.ComContract, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContract()
	}
	return list
}
