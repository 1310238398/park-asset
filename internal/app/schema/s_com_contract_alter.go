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
