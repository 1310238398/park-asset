package main

import (
	"context"
	icontext "gxt-park-assets/internal/app/context"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
	"strings"
)

// 执行数据导入
func execImport(dcItem *DataConfigItem, excelData [][][]string) error {
	var err error
	container.Invoke(func(mTAssetData model.ITAssetData, mTrans model.ITrans) {
		err = execTrans(context.Background(), mTrans, func(ctx context.Context) error {
			var preItem schema.TAssetData

			for i, row := range excelData[dcItem.SheetIndex] {
				if i < dcItem.RowStartIndex || len(row) < dcItem.MaxIndex {
					continue
				}

				item := getDataItem(dcItem, row)
				if item.ProjectName == "" {
					item.ProjectName = preItem.ProjectName
				}
				if item.AssetName == "" {
					item.AssetName = preItem.AssetName
				}
				if item.BuildingName == "" {
					item.BuildingName = preItem.BuildingName
				}
				if item.UnitName == "" {
					item.UnitName = preItem.UnitName
				}
				if item.LayerName == "" {
					item.LayerName = preItem.LayerName
				}
				if item.HouseName == "" {
					item.HouseName = preItem.HouseName
				}

				err := mTAssetData.Create(ctx, item)
				if err != nil {
					return err
				}
				preItem = item
			}

			return nil
		})
	})

	return err
}

func execTrans(ctx context.Context, transModel model.ITrans, fn func(context.Context) error) error {
	if _, ok := icontext.FromTrans(ctx); ok {
		return fn(ctx)
	}
	trans, err := transModel.Begin(ctx)
	if err != nil {
		return err
	}

	err = fn(icontext.NewTrans(ctx, trans))
	if err != nil {
		_ = transModel.Rollback(ctx, trans)
		return err
	}
	return transModel.Commit(ctx, trans)
}

func getDataItem(dcItem *DataConfigItem, row []string) schema.TAssetData {
	item := schema.TAssetData{
		RecordID:               util.MustUUID(),
		OrgName:                dcItem.CompanyName,
		AssetType:              dcItem.AssetType,
		ProjectName:            dcItem.GetValue(row, "ProjectName"),
		AssetName:              dcItem.GetValue(row, "AssetName"),
		BuildingName:           dcItem.GetValue(row, "BuildingName"),
		UnitName:               dcItem.GetValue(row, "UnitName"),
		LayerName:              dcItem.GetValue(row, "LayerName"),
		HouseName:              dcItem.GetValue(row, "HouseName"),
		Business:               dcItem.GetValue(row, "Business"),
		BuildingArea:           dcItem.GetValue(row, "BuildingArea"),
		RentArea:               dcItem.GetValue(row, "RentArea"),
		SigningStatus:          dcItem.GetValue(row, "SigningStatus"),
		Code:                   dcItem.GetValue(row, "Code"),
		LeaseStart:             dcItem.GetValue(row, "LeaseStart"),
		LeaseEnd:               dcItem.GetValue(row, "LeaseEnd"),
		Period:                 dcItem.GetValue(row, "Period"),
		DayRent:                dcItem.GetValue(row, "DayRent"),
		MonthRent:              dcItem.GetValue(row, "MonthRent"),
		PaymentCycle:           dcItem.GetValue(row, "PaymentCycle"),
		AdvancePayment:         dcItem.GetValue(row, "AdvancePayment"),
		RentFreeStart:          dcItem.GetValue(row, "RentFreeStart"),
		RentFreeEnd:            dcItem.GetValue(row, "RentFreeEnd"),
		DepositDueAmount:       dcItem.GetValue(row, "DepositDueAmount"),
		DepositActualAmount:    dcItem.GetValue(row, "DepositActualAmount"),
		SigningDate:            dcItem.GetValue(row, "SigningDate"),
		CustomerTenantType:     dcItem.GetValue(row, "CustomerTenantType"),
		CustomerName:           dcItem.GetValue(row, "CustomerName"),
		CustomerContactName:    dcItem.GetValue(row, "CustomerContactName"),
		CustomerContactTel:     dcItem.GetValue(row, "CustomerContactTel"),
		CustomerContactEmail:   dcItem.GetValue(row, "CustomerContactEmail"),
		CustomerContactAddress: dcItem.GetValue(row, "CustomerContactAddress"),
	}

	// 处理合同租赁起止日期
	if item.LeaseEnd == "" &&
		item.LeaseStart != "" &&
		strings.Index(item.LeaseStart, "-") > -1 {
		ss := strings.Split(item.LeaseStart, "-")
		item.LeaseStart = ss[0]
		item.LeaseEnd = ss[1]
	}

	// 处理免租期起止日期
	if item.RentFreeEnd == "" &&
		item.RentFreeStart != "" &&
		strings.Index(item.RentFreeStart, "-") > -1 {
		ss := strings.Split(item.RentFreeStart, "-")
		item.RentFreeStart = ss[0]
		item.RentFreeEnd = ss[1]
	}

	quarterIdxes := dcItem.GetIndexes("Quarter")
	item.QuarterY201901 = row[quarterIdxes[0]]
	item.QuarterS201901 = row[quarterIdxes[1]]
	item.QuarterY201902 = row[quarterIdxes[2]]
	item.QuarterS201902 = row[quarterIdxes[3]]
	item.QuarterY201903 = row[quarterIdxes[4]]
	item.QuarterS201903 = row[quarterIdxes[5]]
	item.QuarterY201904 = row[quarterIdxes[6]]
	item.QuarterS201904 = row[quarterIdxes[7]]
	item.QuarterY202001 = row[quarterIdxes[8]]
	item.QuarterS202001 = row[quarterIdxes[9]]
	item.QuarterY202002 = row[quarterIdxes[10]]
	item.QuarterS202002 = row[quarterIdxes[11]]
	item.QuarterY202003 = row[quarterIdxes[12]]
	item.QuarterS202003 = row[quarterIdxes[13]]
	item.QuarterY202004 = row[quarterIdxes[14]]
	item.QuarterS202004 = row[quarterIdxes[15]]

	return item
}
