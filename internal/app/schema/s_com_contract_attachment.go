package schema

import (
	"time"
)

// ComContractAttachment 合同-附件对象
type ComContractAttachment struct {
	RecordID  string    `json:"record_id"`                     // 记录ID
	Creator   string    `json:"creator"`                       // 创建者
	CreatedAt time.Time `json:"created_at"`                    // 创建时间
	UpdatedAt time.Time `json:"updated_at"`                    // 更新时间
	URL       string    `gorm:"column:url" binding:"required"` //文件url
	Name      string    `gorm:"column:name"`                   //文件名 可选
	BizID     string    `gorm:"column:biz_id"`                 //关联业务ID
}

// ComContractAttachmentQueryParam 查询条件
type ComContractAttachmentQueryParam struct {
}

// ComContractAttachmentQueryOptions 查询可选参数项
type ComContractAttachmentQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ComContractAttachmentQueryResult 查询结果
type ComContractAttachmentQueryResult struct {
	Data       ComContractAttachments
	PageResult *PaginationResult
}

// ComContractAttachments 合同-附件列表
type ComContractAttachments []*ComContractAttachment
