package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetComContractAlterDB 变更管理
func GetComContractAlterDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAlter{})
}

// GetComContractAlterDesignDB 变更管理
func GetComContractAlterDesignDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAlterDesign{})
}

// GetComContractAlterSignDB 变更管理
func GetComContractAlterSignDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAlterSign{})
}

// GetComContractAlterStuffPriceDB 变更管理
func GetComContractAlterStuffPriceDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAlterStuffPrice{})
}

// GetComContractAlterStuffPriceItemDB 变更管理
func GetComContractAlterStuffPriceItemDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAlterStuffPriceItem{})
}

// SchemaComContractAlter 变更管理
type SchemaComContractAlter schema.ComContractAlter

// SchemaComContractAlterDesign 变更管理
type SchemaComContractAlterDesign schema.ComContractAlterDesign

// SchemaComContractAlterSign 变更管理
type SchemaComContractAlterSign schema.ComContractAlterSign

// SchemaComContractAlterStuffPrice 变更管理
type SchemaComContractAlterStuffPrice schema.ComContractAlterStuffPrice

// SchemaComContractAlterStuffPriceItem 变更管理
type SchemaComContractAlterStuffPriceItem schema.ComContractAlterStuffPriceItem

// ToComContractAlter 转换为变更管理实体
func (a SchemaComContractAlter) ToComContractAlter() *ComContractAlter {
	item := &ComContractAlter{
		RecordID: &a.RecordID,
		Creator:  &a.Creator,
	}
	return item
}

// ComContractAlter 变更管理实体
type ComContractAlter struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
}

// ComContractAlterDesign 设计变更
type ComContractAlterDesign struct {
	Model
	RecordID        *string `gorm:"column:record_id;size:36;index;"`     // 记录ID
	Creator         *string `gorm:"column:creator;size:36;index;"`       // 创建者
	SN              string  `gorm:"column:sn"`                           // 变更编号
	Name            string  `gorm:"column:name"`                         // 变更主题名称
	ComContractID   string  `gorm:"column:comcontract_id;size:36;index"` // 合同编号
	ComContractName string  `gorm:"column:comcontract_name"`             // 合同名称
	LaunchDept      string  `gorm:"column:launch_dept"`                  // 发起部门
	LaunchPerson    string  `gorm:"column:launch_person"`                // 发起人
	LaunchDate      string  `gorm:"column:launch_date"`                  // 发起日期
	ModifyPosition  string  `gorm:"column:modify_position"`              // 变更部位
	Reason          string  `gorm:"column:reason"`                       // 变更原因
	ReasonOther     string  `gorm:"column:reason_other"`                 // 变更其他原因
	Content         string  `gorm:"column:content"`                      // 变更内容
	EstiMate        float64 `gorm:"column:estimate"`                     // 估算金额
	OfficialAmount  float64 `gorm:"column:official_amount"`              // 正式金额
	WorkingState    uint8   `gorm:"column:working_state"`                // 是否施工  0否 1 是
	PurchaseState   uint8   `gorm:"column:purchase_state"`               // 是否采购  0否 1 是
	CostInitial     uint8   `gorm:"column:cost_initial"`                 // 费用变化初判 0否 1 是
	NeedCheck       uint8   `gorm:"column:need_check"`                   // 是否需报批  0否 1是
	CostChange      uint8   `gorm:"column:cost_change"`                  // 成本增减  0否 1是
	AlterType       string  `gorm:"column:alter_type"`                   // 变更类型: 一般变更 重大变更
	Remark          string  `gorm:"column:remark"`                       // 备注
	Status          uint8   `gorm:"column:status"`                       // 状态： 0 保存 1提交审核 2审核通过
}

// ComContractAlterSign 签证变更
type ComContractAlterSign struct {
	Model
	RecordID             *string `gorm:"column:record_id;size:36;index;"`     // 记录ID
	Creator              *string `gorm:"column:creator;size:36;index;"`       // 创建者
	SN                   string  `gorm:"column:sn"`                           // 变更编号
	Name                 string  `gorm:"column:name"`                         // 变更主题名称
	ComContractID        string  `gorm:"column:comcontract_id;size:36;index"` // 合同编号
	ComContractName      string  `gorm:"column:comcontract_name"`             // 合同名称
	AlterDesignID        string  `gorm:"column:alter_design_id"`              // 设计变更ID
	AlterDesignName      string  `gorm:"column:alter_design_name"`            // 设计变更名称
	LaunchDept           string  `gorm:"column:launch_dept"`                  // 发起部门
	LaunchPerson         string  `gorm:"column:launch_person"`                // 发起人
	LaunchDate           string  `gorm:"column:launch_date"`                  // 发起日期
	WorkingCompany       string  `gorm:"column:working_company"`              // 施工单位
	SupervisionCompany   string  `gorm:"column:supervision_company"`          // 监理单位
	AlterSignType        string  `gorm:"column:alter_sign_type"`              // 签证类型: 技术签证、经济签证、工期签证、其他签证
	SubsectionName       string  `gorm:"column:subsection_name"`              // 分布工程名称
	Reason               string  `gorm:"column:reason"`                       // 签证原因
	ReasonOther          string  `gorm:"column:reason_other"`                 // 变更其他原因
	Content              string  `gorm:"column:content"`                      // 变更内容
	EstiMate             float64 `gorm:"column:estimate"`                     // 签证报价
	SettlementAmount     float64 `gorm:"column:setttlement_amount"`           // 结算金额
	WorkingCompanyCharge string  `gorm:"column:working_company_charge"`       // 施工单位负责人
	ProjectStage         string  `gorm:"column:project_stage"`                // 项目阶段

	Jianliyijian      uint8   `gorm:"column:jianliyijian"`      // 监理意见： 0 1上报审批
	Shejitu           uint8   `gorm:"column:shejitu"`           // 是否设计出图 0 否  1 是
	XianChangChengben uint8   `gorm:"column:xianchangchengben"` // 成本增减： 0减少  1增加
	XianChangGusuan   float64 `gorm:"column:xianchanggusuan"`   // 现场 估算金额

	Remark   string `gorm:"column:remark"`    // 备注
	Status   uint8  `gorm:"column:status"`    // 状态： 0 保存 1提交审核 2审核通过
	SignDate string `gorm:"column:sign_date"` // 签证日期
}

// ComContractAlterStuffPrice 材料批价
type ComContractAlterStuffPrice struct {
	Model
	RecordID        *string `gorm:"column:record_id;size:36;index;"`      // 记录ID
	Creator         *string `gorm:"column:creator;size:36;index;"`        // 创建者
	SN              string  `gorm:"column:sn"`                            //  批价编号
	Name            string  `gorm:"column:name"`                          // 合同名称
	ComContractID   string  `gorm:"column:comcontract_id;size:36;index"`  // 合同编号
	ComContractName string  `gorm:"column:comcontract_name"`              // 合同名称
	AlterDesignID   string  `gorm:"column:alter_design_id;size:36;index"` // 设计变更ID
	AlterDesignName string  `gorm:"column:alter_design_name"`             // 设计变更名称
	AlterSignID     string  `gorm:"column:alter_sign_id"`                 // 签证变更ID
	AlterSignName   string  `gorm:"column:alter_sign_name"`               // 签证变更名称
	ProjectName     string  `gorm:"column:project_name"`                  // 工程名称
	LaunchDept      string  `gorm:"column:launch_dept"`                   // 发起部门
	LaunchPerson    string  `gorm:"column:launch_person"`                 // 发起人
	LaunchDate      string  `gorm:"column:launch_date"`                   // 发起日期
	WorkingCompany  string  `gorm:"column:working_company"`               // 施工单位
	Reason          string  `gorm:"column:reason"`                        // 签证原因
	ReasonOther     string  `gorm:"column:reason_other"`                  // 变更其他原因
	Content         string  `gorm:"column:content"`                       // 变更内容
	Remark          string  `gorm:"column:remark"`                        // 备注
	Status          uint8   `gorm:"column:status"`                        // 状态： 0 保存 1提交审核 2审核通过
	SignDate        string  `gorm:"column:sign_date"`                     // 签证日期
}

// ComContractAlterStuffPriceItem 材料批价表
type ComContractAlterStuffPriceItem struct {
	Model
	RecordID          *string `gorm:"column:record_id;size:36;index;"`            // 记录ID
	Creator           *string `gorm:"column:creator;size:36;index;"`              // 创建者
	AlterStuffPriceID string  `gorm:"column:alter_stuff_price_id;size:36;index;"` // 材料批价id
	Name              string  `gorm:"column:name"`                                // 合同名称
	Specification     string  `gorm:"column:specification"`                       // 规格
	Unit              string  `gorm:"column:unit"`                                // 单位
	Count             uint    `gorm:"column:count"`                               // 数量
	QuoteW            float64 `gorm:"column:quote_w"`                             //  施工单位报价
	QuoteC            float64 `gorm:"column:quote_c"`                             //  建设单位报价
	Remark            string  `gorm:"column:remark"`                              // 备注
	Status            uint8   `gorm:"column:status"`                              // 状态 0 1通过审核

}

func (a ComContractAlter) String() string {
	return toString(a)
}

// TableName 表名
func (a ComContractAlter) TableName() string {
	return a.Model.TableName("com_contract_alter")
}

// TableName 表名
func (a ComContractAlterDesign) TableName() string {
	return a.Model.TableName("com_contract_alter_design")
}

// TableName 表名
func (a ComContractAlterSign) TableName() string {
	return a.Model.TableName("com_contract_alter_sign")
}

// TableName 表名
func (a ComContractAlterStuffPrice) TableName() string {
	return a.Model.TableName("com_contract_stuff_price")
}

// TableName 表名
func (a ComContractAlterStuffPriceItem) TableName() string {
	return a.Model.TableName("com_contract_stuff_price_item")
}

// ToSchemaComContractAlter 转换为变更管理对象
func (a ComContractAlter) ToSchemaComContractAlter() *schema.ComContractAlter {
	item := &schema.ComContractAlter{
		RecordID:  *a.RecordID,
		Creator:   *a.Creator,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
	return item
}

// ComContractAlters 变更管理列表
type ComContractAlters []*ComContractAlter

// ToSchemaComContractAlters 转换为变更管理对象列表
func (a ComContractAlters) ToSchemaComContractAlters() []*schema.ComContractAlter {
	list := make([]*schema.ComContractAlter, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAlter()
	}
	return list
}

/////////////////////////设计变更//////////////////////////////

// ToSchemaComContractAlterDesign 转换为变更管理对象
func (a ComContractAlterDesign) ToSchemaComContractAlterDesign() *schema.ComContractAlterDesign {
	item := &schema.ComContractAlterDesign{
		RecordID:        *a.RecordID,
		Creator:         *a.Creator,
		CreatedAt:       a.CreatedAt,
		UpdatedAt:       a.UpdatedAt,
		SN:              a.SN,
		Name:            a.Name,
		ComContractID:   a.ComContractID,
		ComContractName: a.ComContractName,
		LaunchDept:      a.LaunchDept,
		LaunchPerson:    a.LaunchPerson,
		LaunchDate:      a.LaunchDate,
		ModifyPosition:  a.ModifyPosition,
		Reason:          a.Reason,
		ReasonOther:     a.ReasonOther,
		Content:         a.Content,
		EstiMate:        a.EstiMate,
		OfficialAmount:  a.OfficialAmount,
		WorkingState:    a.WorkingState,
		PurchaseState:   a.PurchaseState,
		CostInitial:     a.CostInitial,
		NeedCheck:       a.NeedCheck,
		CostChange:      a.CostChange,
		AlterType:       a.AlterType,
		Remark:          a.Remark,
		Status:          a.Status,
	}
	return item
}

// ToComContractAlterDesign 转换为变更管理实体
func (a SchemaComContractAlterDesign) ToComContractAlterDesign() *ComContractAlterDesign {
	item := &ComContractAlterDesign{
		RecordID:        &a.RecordID,
		Creator:         &a.Creator,
		SN:              a.SN,
		Name:            a.Name,
		ComContractID:   a.ComContractID,
		ComContractName: a.ComContractName,
		LaunchDept:      a.LaunchDept,
		LaunchPerson:    a.LaunchPerson,
		LaunchDate:      a.LaunchDate,
		ModifyPosition:  a.ModifyPosition,
		Reason:          a.Reason,
		ReasonOther:     a.ReasonOther,
		Content:         a.Content,
		EstiMate:        a.EstiMate,
		OfficialAmount:  a.OfficialAmount,
		WorkingState:    a.WorkingState,
		PurchaseState:   a.PurchaseState,
		CostInitial:     a.CostInitial,
		NeedCheck:       a.NeedCheck,
		CostChange:      a.CostChange,
		AlterType:       a.AlterType,
		Remark:          a.Remark,
		Status:          a.Status,
	}
	return item
}

// ComContractAlterDesigns 变更管理列表
type ComContractAlterDesigns []*ComContractAlterDesign

// ToSchemaComContractAlterDesigns 转换为变更管理对象列表
func (a ComContractAlterDesigns) ToSchemaComContractAlterDesigns() []*schema.ComContractAlterDesign {
	list := make([]*schema.ComContractAlterDesign, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAlterDesign()
	}
	return list
}

////////////////////////////签证变更////////////////////////////

// ToSchemaComContractAlterSign 转换为变更管理对象
func (a ComContractAlterSign) ToSchemaComContractAlterSign() *schema.ComContractAlterSign {
	item := &schema.ComContractAlterSign{
		RecordID:             *a.RecordID,
		Creator:              *a.Creator,
		CreatedAt:            a.CreatedAt,
		UpdatedAt:            a.UpdatedAt,
		SN:                   a.SN,
		Name:                 a.Name,
		ComContractID:        a.ComContractID,
		ComContractName:      a.ComContractName,
		AlterDesignID:        a.AlterDesignID,
		AlterDesignName:      a.AlterDesignName,
		LaunchDept:           a.LaunchDept,
		LaunchPerson:         a.LaunchPerson,
		LaunchDate:           a.LaunchDate,
		WorkingCompany:       a.WorkingCompany,
		SupervisionCompany:   a.SupervisionCompany,
		AlterSignType:        a.AlterSignType,
		SubsectionName:       a.SubsectionName,
		Reason:               a.Reason,
		ReasonOther:          a.ReasonOther,
		Content:              a.Content,
		EstiMate:             a.EstiMate,
		SettlementAmount:     a.SettlementAmount,
		WorkingCompanyCharge: a.WorkingCompanyCharge,
		ProjectStage:         a.ProjectStage,
		Jianliyijian:         a.Jianliyijian,
		Shejitu:              a.Shejitu,
		XianChangChengben:    a.XianChangChengben,
		XianChangGusuan:      a.XianChangGusuan,
		Remark:               a.Remark,
		Status:               a.Status,
		SignDate:             a.SignDate,
	}
	return item
}

// ToComContractAlterSign 转换为变更管理实体
func (a SchemaComContractAlterSign) ToComContractAlterSign() *ComContractAlterSign {
	item := &ComContractAlterSign{
		RecordID:             &a.RecordID,
		Creator:              &a.Creator,
		SN:                   a.SN,
		Name:                 a.Name,
		ComContractID:        a.ComContractID,
		ComContractName:      a.ComContractName,
		AlterDesignID:        a.AlterDesignID,
		AlterDesignName:      a.AlterDesignName,
		LaunchDept:           a.LaunchDept,
		LaunchPerson:         a.LaunchPerson,
		LaunchDate:           a.LaunchDate,
		WorkingCompany:       a.WorkingCompany,
		SupervisionCompany:   a.SupervisionCompany,
		AlterSignType:        a.AlterSignType,
		SubsectionName:       a.SubsectionName,
		Reason:               a.Reason,
		ReasonOther:          a.ReasonOther,
		Content:              a.Content,
		EstiMate:             a.EstiMate,
		SettlementAmount:     a.SettlementAmount,
		WorkingCompanyCharge: a.WorkingCompanyCharge,
		ProjectStage:         a.ProjectStage,
		Jianliyijian:         a.Jianliyijian,
		Shejitu:              a.Shejitu,
		XianChangChengben:    a.XianChangChengben,
		XianChangGusuan:      a.XianChangGusuan,
		Remark:               a.Remark,
		Status:               a.Status,
		SignDate:             a.SignDate,
	}
	return item
}

// ComContractAlterSigns 变更管理列表
type ComContractAlterSigns []*ComContractAlterSign

// ToSchemaComContractAlterSigns 转换为变更管理对象列表
func (a ComContractAlterSigns) ToSchemaComContractAlterSigns() []*schema.ComContractAlterSign {
	list := make([]*schema.ComContractAlterSign, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAlterSign()
	}
	return list
}

///////////////////////////材料变更/////////////////////////////

// ToSchemaComContractAlterStuffPrice 转换为变更管理对象
func (a ComContractAlterStuffPrice) ToSchemaComContractAlterStuffPrice() *schema.ComContractAlterStuffPrice {
	item := &schema.ComContractAlterStuffPrice{
		RecordID:        *a.RecordID,
		Creator:         *a.Creator,
		CreatedAt:       a.CreatedAt,
		UpdatedAt:       a.UpdatedAt,
		SN:              a.SN,
		Name:            a.Name,
		ComContractID:   a.ComContractID,
		ComContractName: a.ComContractName,
		AlterDesignID:   a.AlterDesignID,
		AlterDesignName: a.AlterDesignName,
		AlterSignID:     a.AlterSignID,
		AlterSignName:   a.AlterSignName,
		LaunchDept:      a.LaunchDept,
		LaunchPerson:    a.LaunchPerson,
		LaunchDate:      a.LaunchDate,
		WorkingCompany:  a.WorkingCompany,
		ProjectName:     a.ProjectName,
		Reason:          a.Reason,
		ReasonOther:     a.ReasonOther,
		Content:         a.Content,
		Remark:          a.Remark,
		Status:          a.Status,
		SignDate:        a.SignDate,
	}
	return item
}

// ToComContractAlterStuffPrice 转换为变更管理实体
func (a SchemaComContractAlterStuffPrice) ToComContractAlterStuffPrice() *ComContractAlterStuffPrice {
	item := &ComContractAlterStuffPrice{
		RecordID:        &a.RecordID,
		Creator:         &a.Creator,
		SN:              a.SN,
		Name:            a.Name,
		ComContractID:   a.ComContractID,
		ComContractName: a.ComContractName,
		AlterDesignID:   a.AlterDesignID,
		AlterDesignName: a.AlterDesignName,
		AlterSignID:     a.AlterSignID,
		AlterSignName:   a.AlterSignName,
		LaunchDept:      a.LaunchDept,
		LaunchPerson:    a.LaunchPerson,
		LaunchDate:      a.LaunchDate,
		WorkingCompany:  a.WorkingCompany,
		ProjectName:     a.ProjectName,
		Reason:          a.Reason,
		ReasonOther:     a.ReasonOther,
		Content:         a.Content,
		Remark:          a.Remark,
		Status:          a.Status,
		SignDate:        a.SignDate,
	}
	return item
}

// ComContractAlterStuffPrices 变更管理列表
type ComContractAlterStuffPrices []*ComContractAlterStuffPrice

// ToSchemaComContractAlterStuffPrices 转换为变更管理对象列表
func (a ComContractAlterStuffPrices) ToSchemaComContractAlterStuffPrices() []*schema.ComContractAlterStuffPrice {
	list := make([]*schema.ComContractAlterStuffPrice, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAlterStuffPrice()
	}
	return list
}

/////////////////////////////材料变更///////////////////////////

// ToSchemaComContractAlterStuffPriceItem 转换为变更管理对象
func (a ComContractAlterStuffPriceItem) ToSchemaComContractAlterStuffPriceItem() *schema.ComContractAlterStuffPriceItem {
	item := &schema.ComContractAlterStuffPriceItem{
		RecordID:          *a.RecordID,
		Creator:           *a.Creator,
		CreatedAt:         a.CreatedAt,
		UpdatedAt:         a.UpdatedAt,
		AlterStuffPriceID: a.AlterStuffPriceID,
		Name:              a.Name,
		Specification:     a.Specification,
		Unit:              a.Unit,
		Count:             a.Count,
		QuoteW:            a.QuoteW,
		QuoteC:            a.QuoteC,
		Remark:            a.Remark,
		Status:            a.Status,
	}
	return item
}

// ToComContractAlterStuffPriceItem 转换为变更管理实体
func (a SchemaComContractAlterStuffPriceItem) ToComContractAlterStuffPriceItem() *ComContractAlterStuffPriceItem {
	item := &ComContractAlterStuffPriceItem{
		RecordID:          &a.RecordID,
		Creator:           &a.Creator,
		AlterStuffPriceID: a.AlterStuffPriceID,
		Name:              a.Name,
		Specification:     a.Specification,
		Unit:              a.Unit,
		Count:             a.Count,
		QuoteW:            a.QuoteW,
		QuoteC:            a.QuoteC,
		Remark:            a.Remark,
		Status:            a.Status,
	}
	return item
}

// ComContractAlterStuffPriceItems 变更管理列表
type ComContractAlterStuffPriceItems []*ComContractAlterStuffPriceItem

// ToSchemaComContractAlterStuffPriceItems 转换为变更管理对象列表
func (a ComContractAlterStuffPriceItems) ToSchemaComContractAlterStuffPriceItems() []*schema.ComContractAlterStuffPriceItem {
	list := make([]*schema.ComContractAlterStuffPriceItem, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAlterStuffPriceItem()
	}
	return list
}
