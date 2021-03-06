package entity

import (
	"context"
	"fmt"
	"time"

	icontext "gxt-park-assets/internal/app/context"
	"gxt-park-assets/pkg/gormplus"
	"gxt-park-assets/pkg/util"

	"github.com/jinzhu/gorm"
)

// 表名前缀
var tablePrefix string

// SetTablePrefix 设定表名前缀
func SetTablePrefix(prefix string) {
	tablePrefix = prefix
}

// GetTablePrefix 获取表名前缀
func GetTablePrefix() string {
	return tablePrefix
}

// Model base model
type Model struct {
	ID        uint       `gorm:"column:id;primary_key;auto_increment;"`
	CreatedAt time.Time  `gorm:"column:created_at;"`
	UpdatedAt time.Time  `gorm:"column:updated_at;"`
	DeletedAt *time.Time `gorm:"column:deleted_at;index;"`
}

// TableName table name
func (Model) TableName(name string) string {
	return fmt.Sprintf("%s%s", GetTablePrefix(), name)
}

// CostModel base model
type CostModel struct {
	ID        uint       `gorm:"column:id;primary_key;auto_increment;"`
	CreatedAt time.Time  `gorm:"column:created_at;"`
	UpdatedAt time.Time  `gorm:"column:updated_at;"`
	DeletedAt *time.Time `gorm:"column:deleted_at;index;"`
}

// TableName table name
func (CostModel) TableName(name string) string {
	return fmt.Sprintf("%s%s", "pc_", name)
}

func toString(v interface{}) string {
	return util.JSONMarshalToString(v)
}

func getDBPlus(ctx context.Context, defDB *gormplus.DB) *gormplus.DB {
	trans, ok := icontext.FromTrans(ctx)
	if ok {
		db, ok := trans.(*gormplus.DB)
		if ok {
			return db
		}
	}
	return defDB
}

func getDBWithModelPlus(ctx context.Context, defDB *gormplus.DB, m interface{}) *gormplus.DB {
	return gormplus.Wrap(getDBPlus(ctx, defDB).Model(m))
}

func getDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	trans, ok := icontext.FromTrans(ctx)
	if ok {
		db, ok := trans.(*gormplus.DB)
		if ok {
			return db.GetDB()
		}
	}
	return defDB
}

func getDBWithModel(ctx context.Context, defDB *gorm.DB, m interface{}) *gorm.DB {
	return getDB(ctx, defDB).Model(m)
}

// GetDB 获取数据库
func GetDB(ctx context.Context, defDB *gorm.DB) *gorm.DB {
	return getDB(ctx, defDB)
}
