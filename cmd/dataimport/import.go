package main

import (
	"context"
	icontext "gxt-park-assets/internal/app/context"
	"gxt-park-assets/internal/app/model"
	"gxt-park-assets/internal/app/schema"
	"gxt-park-assets/pkg/util"
)

// 执行数据导入
func execImport(dcItem *DataConfigItem, excelData [][][]string) error {
	var err error
	container.Invoke(func(mTAssetData model.ITAssetData, mTrans model.ITrans) {
		err = execTrans(context.Background(), mTrans, func(ctx context.Context) error {
			for _, row := range excelData[dcItem.SheetIndex] {
				item := getDataItem(dcItem, row)
				err := mTAssetData.Create(ctx, item)
				if err != nil {
					return err
				}
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
		ProjectName:            row[dcItem.GetIndex("ProjectName")],
		AssetName:              row[dcItem.GetIndex("AssetName")],
		BuildingName:           row[dcItem.GetIndex("BuildingName")],
		UnitName:               row[dcItem.GetIndex("UnitName")],
		LayerName:              row[dcItem.GetIndex("LayerName")],
		HouseName:              row[dcItem.GetIndex("HouseName")],
		Business:               row[dcItem.GetIndex("Business")],
		BuildingArea:           row[dcItem.GetIndex("BuildingArea")],
		RentArea:               row[dcItem.GetIndex("RentArea")],
		SigningStatus:          row[dcItem.GetIndex("SigningStatus")],
		Code:                   row[dcItem.GetIndex("Code")],
		LeaseStart:             row[dcItem.GetIndex("LeaseStart")],
		LeaseEnd:               row[dcItem.GetIndex("LeaseEnd")],
		Period:                 row[dcItem.GetIndex("Period")],
		DayRent:                row[dcItem.GetIndex("DayRent")],
		MonthRent:              row[dcItem.GetIndex("MonthRent")],
		PaymentCycle:           row[dcItem.GetIndex("PaymentCycle")],
		AdvancePayment:         row[dcItem.GetIndex("AdvancePayment")],
		RentFreeStart:          row[dcItem.GetIndex("RentFreeStart")],
		RentFreeEnd:            row[dcItem.GetIndex("RentFreeEnd")],
		DepositDueAmount:       row[dcItem.GetIndex("DepositDueAmount")],
		DepositActualAmount:    row[dcItem.GetIndex("DepositActualAmount")],
		SigningDate:            row[dcItem.GetIndex("SigningDate")],
		CustomerTenantType:     row[dcItem.GetIndex("CustomerTenantType")],
		CustomerName:           row[dcItem.GetIndex("CustomerName")],
		CustomerContactName:    row[dcItem.GetIndex("CustomerContactName")],
		CustomerContactTel:     row[dcItem.GetIndex("CustomerContactTel")],
		CustomerContactEmail:   row[dcItem.GetIndex("CustomerContactEmail")],
		CustomerContactAddress: row[dcItem.GetIndex("CustomerContactAddress")],
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
