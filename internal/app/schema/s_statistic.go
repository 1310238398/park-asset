package schema

// Statistic 统计查询
type Statistic struct {
	RecordID string `json:"record_id" swaggo:"false,记录ID"`
	Creator  string `json:"creator" swaggo:"false,创建者"`
}

// StatisticQueryParam 查询条件
type StatisticQueryParam struct {
}

// StatisticQueryOptions 查询可选参数项
type StatisticQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// StatisticQueryResult 查询结果
type StatisticQueryResult struct {
	Data       Statistics
	PageResult *PaginationResult
}

// Statistics 统计查询列表
type Statistics []*Statistic

// ProjectStatisticQueryParam 项目统计查询条件
type ProjectStatisticQueryParam struct {
	LikeOrgName     string // 组织名称
	LikeProjectName string // 项目名称
	AssetType       int    // 资产类型
	RentCycle       []int  // 租金收缴周期（年、季度）
}

// ProjectStatisticQueryOptions 查询可选参数项
type ProjectStatisticQueryOptions struct {
	PageParam *PaginationParam // 分页参数
}

// ProjectStatistic 项目统计
type ProjectStatistic struct {
	OrgID         string `json:"org_id" swaggo:"false,组织ID"`
	OrgName       string `json:"org_name" swaggo:"false,组织名称"`
	ProjectID     string `json:"project_id" swaggo:"false,项目ID"`
	ProjectName   string `json:"project_name" swaggo:"false,项目名称"`
	AssetType     int    `json:"asset_type" swaggo:"false,资产类型:1：写字楼  2：商铺  3：厂房  4：公寓 5： 酒店  6：农贸市场  7：车改商"`
	RentArea      int    `json:"rent_area" swaggo:"false,计租面积"`
	RentedArea    int    `json:"rented_area" swaggo:"false,已租面积"`
	PaymentAmount int    `json:"payment_amount" swaggo:"false,应收租金"`
	ActualAmount  int    `json:"actual_amount" swaggo:"false,实收租金"`
}

// ProjectStatisticQueryResult 项目统计查询条件
type ProjectStatisticQueryResult struct {
	Data       []*ProjectStatistic
	PageResult *PaginationResult
}

// IncomeClassificationStatisticQueryParam 收入分类占比查询参数
type IncomeClassificationStatisticQueryParam struct {
	Year int
}

// IncomeClassificationStatistic 收入分类占比统计项
type IncomeClassificationStatistic struct {
	AssetTypeName string `json:"asset_type_name" swaggo:"false,资产类型名称"`
	ActualAmount  int    `json:"actual_amount" swaggo:"false,实收金额"`
}

// OperationalIndicatorStatisticQueryParam 运营指标查询参数
type OperationalIndicatorStatisticQueryParam struct {
	Year int
}

// OperationalIndicatorStatistic 运营指标统计项
type OperationalIndicatorStatistic struct {
	ContractNum                    int `json:"contract_num" swaggo:"false,合同数"`
	ThisMonthAddContractNum        int `json:"this_month_add_contract_num" swaggo:"false,本月新签合同数"`
	ThisMonthWithdrawalContractNum int `json:"this_month_withdrawal_contract_num" swaggo:"false,本月退租合同数"`
	ThisMonthRenewContractNum      int `json:"this_month_renew_contract_num" swaggo:"false,本月续签合同数"`
	EnterpriseNum                  int `json:"enterprise_num" swaggo:"false,入住企业总数"`
	MerchantNum                    int `json:"merchant_num" swaggo:"false,入住商家总数"`
}

// OverviewStatisticQueryParam 概览查询参数
type OverviewStatisticQueryParam struct {
	Year int
}

// OverviewStatistic 概览统计项
type OverviewStatistic struct {
	AnnualPlanIncome   int `json:"annual_plan_income" swaggo:"false,年度计划收入"`
	AnnualActualIncome int `json:"annual_actual_income" swaggo:"false,年度实际收入"`
	ProjectNum         int `json:"project_num" swaggo:"false,项目总数"`
	BuildingArea       int `json:"building_area" swaggo:"false,建筑总面积"`
	RentArea           int `json:"rent_area" swaggo:"false,建筑计租总面积"`
	RentedArea         int `json:"rented_area" swaggo:"false,建筑已租面积"`
}
