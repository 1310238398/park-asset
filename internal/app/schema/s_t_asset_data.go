package schema

// TAssetData 资产数据
type TAssetData struct {
	RecordID               string `json:"record_id" swaggo:"false,记录ID"`
	OrgName                string `json:"org_name" swaggo:"false,公司名称"`
	ProjectName            string `json:"project_name" swaggo:"false,项目名称"`
	AssetType              int    `json:"asset_type" swaggo:"false,资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"`
	AssetName              string `json:"asset_name" swaggo:"false,资产名称(商铺号、车位号、厂房号、摊位号)"`
	BuildingName           string `json:"building_name" swaggo:"false,楼栋名称"`
	UnitName               string `json:"unit_name" swaggo:"false,单元名称"`
	LayerName              string `json:"layer_name" swaggo:"false,楼层名称"`
	HouseName              string `json:"house_name" swaggo:"false,门牌名称"`
	Business               string `json:"business" swaggo:"false,业态"`
	BuildingArea           string `json:"building_area" swaggo:"false,建筑面积"`
	RentArea               string `json:"rent_area" swaggo:"false,计租面积"`
	SigningStatus          string `json:"signing_status" swaggo:"false,签约情况"`
	Code                   string `json:"code" swaggo:"false,合同编号"`
	LeaseStart             string `json:"lease_start" swaggo:"false,租赁开始日期"`
	LeaseEnd               string `json:"lease_end" swaggo:"false,租赁结束日期"`
	Period                 string `json:"period" swaggo:"false,合同年限"`
	DayRent                string `json:"day_rent" swaggo:"false,日租金"`
	MonthRent              string `json:"month_rent" swaggo:"false,月租金"`
	PaymentCycle           string `json:"payment_cycle" swaggo:"false,缴费周期(月)"`
	AdvancePayment         string `json:"advance_payment" swaggo:"false,提前付款天数"`
	RentFreeStart          string `json:"rent_free_start" swaggo:"false,免租期开始日期"`
	RentFreeEnd            string `json:"rent_free_end" swaggo:"false,免租期结束日期"`
	DepositDueAmount       string `json:"deposit_due_amount" swaggo:"false,押金应交金额(分)"`
	DepositActualAmount    string `json:"deposit_actual_amount" swaggo:"false,押金实缴金额(分)"`
	SigningDate            string `json:"signing_date" swaggo:"false,合同签署日期"`
	QuarterY201901         string `json:"quarter_y201901" swaggo:"false,一季度应收"`
	QuarterS201901         string `json:"quarter_s201901" swaggo:"false,一季度实收"`
	QuarterY201902         string `json:"quarter_y201902" swaggo:"false,二季度应收"`
	QuarterS201902         string `json:"quarter_s201902" swaggo:"false,二季度实收"`
	QuarterY201903         string `json:"quarter_y201903" swaggo:"false,三季度应收"`
	QuarterS201903         string `json:"quarter_s201903" swaggo:"false,三季度实收"`
	QuarterY201904         string `json:"quarter_y201904" swaggo:"false,四季度应收"`
	QuarterS201904         string `json:"quarter_s201904" swaggo:"false,四季度实收"`
	QuarterY2019           string `json:"quarter_y2019" swaggo:"false,2019应收"`
	QuarterS2019           string `json:"quarter_s2019" swaggo:"false,2019实收"`
	QuarterY202001         string `json:"quarter_y202001" swaggo:"false,一季度应收"`
	QuarterS202001         string `json:"quarter_s202001" swaggo:"false,一季度实收"`
	QuarterY202002         string `json:"quarter_y202002" swaggo:"false,二季度应收"`
	QuarterS202002         string `json:"quarter_s202002" swaggo:"false,二季度实收"`
	QuarterY202003         string `json:"quarter_y202003" swaggo:"false,三季度应收"`
	QuarterS202003         string `json:"quarter_s202003" swaggo:"false,三季度实收"`
	QuarterY202004         string `json:"quarter_y202004" swaggo:"false,四季度应收"`
	QuarterS202004         string `json:"quarter_s202004" swaggo:"false,四季度实收"`
	QuarterY2020           string `json:"quarter_y2020" swaggo:"false,2020应收"`
	QuarterS2020           string `json:"quarter_s2020" swaggo:"false,2020实收"`
	CustomerTenantType     string `json:"customer_tenant_type" swaggo:"false,租户类型"`
	CustomerName           string `json:"customer_name" swaggo:"false,客户名称"`
	CustomerBrandName      string `json:"customer_brand_name" swaggo:"false,客户品牌名称"`
	CustomerContactName    string `json:"customer_contact_name" swaggo:"false,联系人姓名"`
	CustomerContactTel     string `json:"customer_contact_tel" swaggo:"false,联系人手机号"`
	CustomerContactEmail   string `json:"customer_contact_email" swaggo:"false,联系人邮箱"`
	CustomerContactAddress string `json:"customer_contact_address" swaggo:"false,联系人地址"`
}

// TAssetDataQueryParam 查询条件
type TAssetDataQueryParam struct {
}

// TAssetDataQueryOptions 查询可选参数项
type TAssetDataQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// TAssetDataQueryResult 查询结果
type TAssetDataQueryResult struct {
	Data       []*TAssetData
	PageResult *PaginationResult
}
