package model

import (
	"context"
	"fmt"

	"gxt-park-assets/internal/app/errors"
	"gxt-park-assets/internal/app/model/impl/gorm/internal/entity"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// NewComContract 创建合同管理存储实例
func NewComContract(db *gorm.DB) *ComContract {
	return &ComContract{db}
}

// ComContract 合同管理存储
type ComContract struct {
	db *gorm.DB
}

func (a *ComContract) getQueryOption(opts ...schema.ComContractQueryOptions) schema.ComContractQueryOptions {
	var opt schema.ComContractQueryOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	return opt
}

// Query 查询数据
func (a *ComContract) Query(ctx context.Context, params schema.ComContractQueryParam, opts ...schema.ComContractQueryOptions) (*schema.ComContractQueryResult, error) {
	opt := a.getQueryOption(opts...)
	db := entity.GetComContractDB(ctx, a.db)
	// TODO: 查询条件
	if params.Status > -1 {
		db = db.Where("status = ?", params.Status)
	}
	if params.SN != "" {
		db = db.Where("sn = ?", params.SN)
	}
	if params.Name != "" {
		db = db.Where("name like ?", "%"+params.Name+"%")
	}
	if params.Category != "" {
		db = db.Where("category like ?", "%"+params.Category+"%")
	}
	if params.Yifang != "" {
		db = db.Where("yifang like ?", "%"+params.Yifang+"%")
	}
	if params.ProjectID != "" {
		db = db.Where("project_id = ?", params.ProjectID)
	}
	if params.State == 1 {
		db = db.Where("status IN (0,1,2)")
	}
	if params.State == 2 {
		db = db.Where("status IN (3,5)")
	}
	db = db.Order("id DESC")

	var list entity.ComContracts
	pr, err := WrapPageQuery(ctx, db, opt.PageParam, &list)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	qr := &schema.ComContractQueryResult{
		PageResult: pr,
		Data:       list.ToSchemaComContracts(),
	}

	return qr, nil
}

// Get 查询指定数据
func (a *ComContract) Get(ctx context.Context, recordID string, opts ...schema.ComContractQueryOptions) (*schema.ComContract, error) {
	db := entity.GetComContractDB(ctx, a.db).Where("record_id=?", recordID)
	var item entity.ComContract
	ok, err := FindOne(ctx, db, &item)
	if err != nil {
		return nil, errors.WithStack(err)
	} else if !ok {
		return nil, nil
	}
	//获取附件信息
	var attasM entity.ComContractAttachments
	result := entity.GetComContractAttachmentDB(ctx, a.db).Where("biz_id=?", recordID).Find(&attasM)
	if err := result.Error; err != nil {
		return nil, errors.WithStack(err)
	}
	attasS := attasM.ToSchemaComContractAttachments()
	sItem := item.ToSchemaComContract()
	sItem.Attas = attasS

	return sItem, nil
}

// Create 创建数据
func (a *ComContract) Create(ctx context.Context, item schema.ComContract) error {
	eitem := entity.SchemaComContract(item).ToComContract()
	result := entity.GetComContractDB(ctx, a.db).Create(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Update 更新数据
func (a *ComContract) Update(ctx context.Context, recordID string, item schema.ComContract) error {
	eitem := entity.SchemaComContract(item).ToComContract()
	result := entity.GetComContractDB(ctx, a.db).Where("record_id=?", recordID).Omit("record_id").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Delete 删除数据
func (a *ComContract) Delete(ctx context.Context, recordID string) error {
	result := entity.GetComContractDB(ctx, a.db).Where("record_id=?", recordID).Delete(entity.ComContract{})
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// Commit 提交审核
func (a *ComContract) Commit(ctx context.Context, recordID string) error {
	oldItem, err := a.Get(ctx, recordID)
	if err != nil {
		return err
	}
	oldItem.Status = 1
	eitem := entity.SchemaComContract(*oldItem).ToComContract()
	result := entity.GetComContractDB(ctx, a.db).Where("record_id=?", recordID).Select("status").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// CancelCommit 取消提交审核
func (a *ComContract) CancelCommit(ctx context.Context, recordID string) error {
	oldItem, err := a.Get(ctx, recordID)
	if err != nil {
		return err
	}
	oldItem.Status = 0
	eitem := entity.SchemaComContract(*oldItem).ToComContract()
	fmt.Println(eitem.Status)
	result := entity.GetComContractDB(ctx, a.db).Model(&eitem).Where("record_id=?", recordID).Update("status", 0)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// TakeEffect 合同生效
func (a *ComContract) TakeEffect(ctx context.Context, recordID string, effectInfo schema.ComContractEffectInfo) error {
	//
	oldItem, err := a.Get(ctx, recordID)
	if err != nil {
		return err
	}
	changeField := map[string]interface{}{
		"status": 5, "sign_date": effectInfo.SignDate, "sn": effectInfo.SN}

	eitem := entity.SchemaComContract(*oldItem).ToComContract()
	result := entity.GetComContractDB(ctx, a.db).Model(&eitem).Where("record_id=?", recordID).Updates(changeField)

	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// PassCheck 通过审核
func (a *ComContract) PassCheck(ctx context.Context, recordID string) error {
	oldItem, err := a.Get(ctx, recordID)
	if err != nil {
		return err
	}
	oldItem.Status = 3
	eitem := entity.SchemaComContract(*oldItem).ToComContract()
	result := entity.GetComContractDB(ctx, a.db).Model(&eitem).Where("record_id=?", recordID).Select("status").Updates(eitem)
	if err := result.Error; err != nil {
		return errors.WithStack(err)
	}
	return nil
}
