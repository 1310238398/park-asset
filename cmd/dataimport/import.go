package main

import (
	"context"
	"errors"
	"gxt-park-assets/internal/app/schema"
)

// 执行数据导入
func execImport(dcItem *DataConfigItem, excelData [][][]string) error {
	// 资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商
	switch dcItem.Type {
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
	case 6:
	case 7:
	default:
		return errors.New("未知的数据项类型")
	}

	return nil
}

func checkAndGetProject(ctx context.Context, orgName, name string) (*schema.Project, error) {

	return nil, nil
}
