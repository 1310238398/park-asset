package internal

import (
	"context"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// NewComContract 创建合同管理
func NewComContract(mComContract model.IComContract, mAttachment model.IComContractAttachment) *ComContract {
	return &ComContract{
		ComContractModel: mComContract,
		AttachmentModel:  mAttachment,
	}
}

// ComContract 合同管理业务逻辑
type ComContract struct {
	ComContractModel model.IComContract
	AttachmentModel  model.IComContractAttachment
}

// Query 查询数据
func (a *ComContract) Query(ctx context.Context, params schema.ComContractQueryParam, opts ...schema.ComContractQueryOptions) (*schema.ComContractQueryResult, error) {
	return a.ComContractModel.Query(ctx, params, opts...)
}

// Get 查询指定数据
func (a *ComContract) Get(ctx context.Context, recordID string, opts ...schema.ComContractQueryOptions) (*schema.ComContract, error) {
	item, err := a.ComContractModel.Get(ctx, recordID, opts...)
	if err != nil {
		return nil, err
	} else if item == nil {
		return nil, errors.ErrNotFound
	}

	//获取合同附件信息
	attas, err := a.AttachmentModel.QueryByBizID(ctx, item.RecordID)
	if err != nil {
		return nil, err
	}
	item.Attas = attas
	return item, nil
}

func (a *ComContract) getUpdate(ctx context.Context, recordID string) (*schema.ComContract, error) {
	return a.Get(ctx, recordID)
}

// Create 创建数据
func (a *ComContract) Create(ctx context.Context, item schema.ComContract) (*schema.ComContract, error) {
	item.RecordID = util.MustUUID()
	if len(item.ParentComContractID) == 36 {
		// 如果有所属合同id信息 就标记为补充协议
		item.Supplement = "1"
	}
	err := a.ComContractModel.Create(ctx, item)
	if err != nil {
		return nil, err
	}
	// 保存附件
	for _, attachment := range item.Attas {
		attachment.BizID = item.RecordID
		attachment.RecordID = util.MustUUID()
		err := a.AttachmentModel.Create(ctx, *attachment)
		if err != nil {
			return nil, err
		}
	}
	return a.getUpdate(ctx, item.RecordID)
}

// Update 更新数据
func (a *ComContract) Update(ctx context.Context, recordID string, item schema.ComContract) (*schema.ComContract, error) {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return nil, err
	} else if oldItem == nil {
		return nil, errors.ErrNotFound
	}

	err = a.ComContractModel.Update(ctx, recordID, item)
	if err != nil {
		return nil, err
	}

	//处理附件
	if len(item.Attas) > 0 {
		// 删除已有的附件记录
		err = a.AttachmentModel.DeleteByBizID(ctx, recordID)
		if err != nil {
			return nil, err
		}

		// 保存附件
		for _, attachment := range item.Attas {
			attachment.BizID = recordID
			attachment.RecordID = util.MustUUID()
			err := a.AttachmentModel.Create(ctx, *attachment)
			if err != nil {
				return nil, err
			}
		}
	}
	return a.getUpdate(ctx, recordID)
}

// Delete 删除数据
func (a *ComContract) Delete(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}

	return a.ComContractModel.Delete(ctx, recordID)
}

// Commit 提交审核
func (a *ComContract) Commit(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	//提交前检查数据
	err = a.CheckBeforeCommit(oldItem)
	if err != nil {
		return err
	}
	//检查通过，标记提交审核
	return a.ComContractModel.Commit(ctx, recordID)
}

// PassCheck 通过审核
func (a *ComContract) PassCheck(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	//检查合同状态是否正确
	if !a.CheckBeforePassCheck(oldItem) {
		return errors.ErrComContractNotCommit
	}
	err = a.ComContractModel.PassCheck(ctx, recordID)
	return err
}

// CancelCommit 撤销提交审核
func (a *ComContract) CancelCommit(ctx context.Context, recordID string) error {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	if oldItem.Status != 1 {
		//
		return errors.ErrNotRightStatusForCancelCommit
	}
	//检查通过，标记提交审核
	return a.ComContractModel.CancelCommit(ctx, recordID)
}

// TakeEffect 设置生效
func (a *ComContract) TakeEffect(ctx context.Context, recordID string, effectInfo schema.ComContractEffectInfo) error {
	oldItem, err := a.ComContractModel.Get(ctx, recordID)
	if err != nil {
		return err
	} else if oldItem == nil {
		return errors.ErrNotFound
	}
	if oldItem.Status != 3 {
		return errors.ErrComContractNotPassCheck
	}
	if effectInfo.SN == "" {
		return errors.ErrNoComContractSN
	}
	if effectInfo.SignDate == "" {
		return errors.ErrNoComContractSignDate
	}
	// 保存附件
	for _, attachment := range effectInfo.Attas {
		attachment.BizID = recordID
		attachment.RecordID = util.MustUUID()
		err := a.AttachmentModel.Create(ctx, *attachment)
		if err != nil {
			return err
		}
	}
	return a.ComContractModel.TakeEffect(ctx, recordID, effectInfo)
}

// CheckBeforeCommit 提交申请前检查数组完整性
func (a *ComContract) CheckBeforeCommit(info *schema.ComContract) error {
	errorText := ""
	if len(info.Attas) < 1 {
		errorText += "请上传草拟合同附件\n"
	}
	if info.Name == "" {
		errorText += "请输入合同名称\n"
	}
	if info.Amount == 0 {
		errorText += "请正确输入合同金额\n"
	}
	if info.ContractPlanningID == "" {
		errorText += "请正确选择合约规划\n"
	}
	if info.Subject == "" {
		errorText += "请正确选择合同科目\n"
	}
	//检查签字情况
	//如果是直接合同就需要检查 甲、乙双方 签字
	if info.Property == "1" {
		if info.Jiafang == "" || info.JiafangSign == "" {
			errorText += "请正确输入甲乙双方签字信息\n"
		}
		if info.Yifang == "" || info.YifangSign == "" {
			errorText += "请正确输入甲乙双方签字信息\n"
		}
	}
	//如果是三方合同就需要检查 甲、乙、丙三方 签字
	if info.Property == "2" {
		if info.Jiafang == "" || info.JiafangSign == "" {
			errorText += "请正确输入甲乙丙三方签字信息\n"
		}
		if info.Yifang == "" || info.YifangSign == "" {
			errorText += "请正确输入甲乙丙三方签字信息\n"
		}
		if info.Bingfang == "" || info.BingfangSign == "" {
			errorText += "请正确输入甲乙丙三方签字信息\n"
		}
	}
	//如果是补充协议，需要检查原合同id，原合同名称
	if info.Supplement == "1" {
		if len(info.ParentComContractID) != 36 {
			errorText += "请正确选择原合同\n"
		}
	}
	//检查合约规划是否可以正常引用问题
	// todo

	if errorText == "" {
		return nil
	}
	return errors.New(errorText)
}

// CheckBeforePassCheck 通过审核前检查数据
func (a *ComContract) CheckBeforePassCheck(oldItem *schema.ComContract) bool {
	if oldItem.Status != 1 {
		return false
	}
	return true
}
