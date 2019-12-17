package entity

import (
	"context"
	"gxt-park-assets/internal/app/schema"

	"github.com/jinzhu/gorm"
)

// GetComContractAttachmentDB 合同-附件
func GetComContractAttachmentDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDBWithModel(ctx, defDB, ComContractAttachment{})
}

// SchemaComContractAttachment 合同-附件
type SchemaComContractAttachment schema.ComContractAttachment

// ToComContractAttachment 转换为合同-附件实体
func (a SchemaComContractAttachment) ToComContractAttachment() *ComContractAttachment {
	item := &ComContractAttachment{
		RecordID: &a.RecordID,
		Creator:  &a.Creator,
		URL:      a.URL,
		Name:     a.Name,
		BizID:    a.BizID,
	}
	return item
}

// ComContractAttachment 合同-附件实体
type ComContractAttachment struct {
	Model
	RecordID *string `gorm:"column:record_id;size:36;index;"` // 记录ID
	Creator  *string `gorm:"column:creator;size:36;index;"`   // 创建者
	URL      string  `gorm:"column:url"`                      //文件url
	Name     string  `gorm:"column:name"`                     //文件名 可选
	BizID    string  `gorm:"column:biz_id"`                   //关联业务ID
}

func (a ComContractAttachment) String() string {
	return toString(a)
}

// TableName 表名
func (a ComContractAttachment) TableName() string {
	return a.Model.TableName("com_contract_attachment")
}

// ToSchemaComContractAttachment 转换为合同-附件对象
func (a ComContractAttachment) ToSchemaComContractAttachment() *schema.ComContractAttachment {
	item := &schema.ComContractAttachment{
		RecordID:  *a.RecordID,
		Creator:   *a.Creator,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
		URL:       a.URL,
		Name:      a.Name,
		BizID:     a.BizID,
	}
	return item
}

// ComContractAttachments 合同-附件列表
type ComContractAttachments []*ComContractAttachment

// ToSchemaComContractAttachments 转换为合同-附件对象列表
func (a ComContractAttachments) ToSchemaComContractAttachments() []*schema.ComContractAttachment {
	list := make([]*schema.ComContractAttachment, len(a))
	for i, item := range a {
		list[i] = item.ToSchemaComContractAttachment()
	}
	return list
}
