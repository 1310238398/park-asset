export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login/Index' },
    ],
  },
  {
    path: '/datadashboad',
    component: '../layouts/ModalLayout',
    routes: [{ path: '/datadashboad', component: './DataDashboad/DataDashboad' }],
  },
  {
    path: '/',
    component: '../layouts/AdminLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard/Home' },
      {
        path: '/example',
        routes: [{ path: '/example/demo', component: './Demo/DemoList' }],
      },
      {
        path: '/system',
        routes: [
          { path: '/system/menu', component: './Menu/MenuList' },
          { path: '/system/role', component: './Role/RoleList' },
          { path: '/system/user', component: './User/UserList' },
          { path: '/system/systemparameter', component: './SystemParameter/SystemParameterList' },
        ],
      },
      {
        path: 'basic',
        routes: [
          { path: '/basic/dictionary', component: './Dictionary/DictionaryList' },
          { path: '/basic/organstructurelist', component: './OrganStructure/OrganStructureList' },
        ],
      },
      {
        path: 'project',
        routes: [
          {
            path: '/project/projectmanage',
            component: './ProjectManage/ProjectManageList',
          },
        ],
      },
      {
        path: 'assetdatamaint',
        routes: [
          {
            path: '/assetdatamaint/assetdatamaintlist',
            component: './AssetDataMaint/AssetDataMaintList',
          },
          {
            path: '/assetdatamaint/assetcustominfo',
            component: './AssetDataMaint/CustomInfo/CustomInfo',
          },
          {
            path: '/assetdatamaint/assetrentdraw',
            component: './AssetDataMaint/CustomInfo/RentDrawInfoShow',
          },
          {
            path: '/assetdatamaint/assetagreementinfo',
            component: './AssetDataMaint/CustomInfo/AgreementInfo',
          },
          {
            path: '/assetdatamaint/assetunitmaint',
            component: './AssetDataMaint/AssetUnitMaint',
          },
          {
            path: '/assetdatamaint/assetfloormaint',
            component: './AssetDataMaint/AssetFloorMaint',
          },
          {
            path: '/assetdatamaint/assetsearch',
            component: './AssetDataMaint/AssetSearch/AssetSearch',
          },
        ],
      },
      {
        path: 'assetssituation',
        routes: [
          {
            path: '/assetssituation/assetssituation',
            component: './AssetsSituation/AssetsSituationList',
          },
        ],
      },
      {
        path: 'datadashboad',
        routes: [
          {
            path: '/datadashboad',
            component: './DataDashboad/DataDashboad',
          },
        ],
      },
      {
        path: 'massif',
        routes: [
          {
            path: '/massif/massiflist',
            component: './MassifManage/MassifList',
          },
        ],
      },
      // 资产管理-写字楼-2019-10-12 基础数据录入
      {
        path:'assettypedata',
        routes: [
          {
            path: '/assettypedata/assetbuilddata',
            component: './AssetTypeData/AssetBuildData/AssetBuildData',
          },
          {
            path: '/assettypedata/assetunit',
            component: './AssetTypeData/AssetBuildData/AssetUnitData/AssetUnitData',
          },
          {
            path: '/assettypedata/assetfloor',
            component: './AssetTypeData/AssetBuildData/AssetFloorData/AssetFloorData',
          },
          {
            path: '/assettypedata/assetnumplate',
            component: './AssetTypeData/AssetBuildData/AssetNumPlate/AssetNumPlate',
          },
          {
            path: '/assettypedata/assetsubdoor',
            component: './AssetTypeData/AssetBuildData/AssetNumPlate/AssetSubDoor',
          },
          // 商铺
          {
            path: '/assettypedata/assetshop',
            component: './AssetTypeData/AssetShopData/AssetShopData',
          },
           // 厂房
           {
            path: '/assettypedata/assetplant',
            component: './AssetTypeData/AssetPlantData/AssetPlantData',
          },
           // 车改商
           {
            path: '/assettypedata/assetcardealer',
            component: './AssetTypeData/AssetCarDealerData/AssetCarDealerData',
          },
            // 农贸市场
            {
              path: '/assettypedata/assetfarmmarket',
              component: './AssetTypeData/AssetFarmmarketData/AssetFarmmarketData',
            },
            // 公寓
            {
              path: '/assettypedata/assetapartmentdata',
              component: './AssetTypeData/AssetApartmentData/AssetApartmentData',
            },
            {
              path: '/assettypedata/assetapartmentunit',
              component: './AssetTypeData/AssetApartmentData/AssetUnitData/AssetUnitData',
            },
            {
              path: '/assettypedata/assetapartmentfloor',
              component: './AssetTypeData/AssetApartmentData/AssetFloorData/AssetFloorData',
            },
            {
              path: '/assettypedata/assetapartmentnumplate',
              component: './AssetTypeData/AssetApartmentData/AssetNumPlate/AssetNumPlate',
            },
            {
              path: '/assettypedata/assetapartmentsubdoor',
              component: './AssetTypeData/AssetApartmentData/AssetNumPlate/AssetSubDoor',
            },
             // 酒店
             {
              path: '/assettypedata/assethoteldata',
              component: './AssetTypeData/AssetHotelData/AssetHotelData',
            },
            {
              path: '/assettypedata/assethotelunit',
              component: './AssetTypeData/AssetHotelData/AssetUnitData/AssetUnitData',
            },
            {
              path: '/assettypedata/assethotelfloor',
              component: './AssetTypeData/AssetHotelData/AssetFloorData/AssetFloorData',
            },
            {
              path: '/assettypedata/assethotelnumplate',
              component: './AssetTypeData/AssetHotelData/AssetNumPlate/AssetNumPlate',
            },
            {
              path: '/assettypedata/assethotelsubdoor',
              component: './AssetTypeData/AssetHotelData/AssetNumPlate/AssetSubDoor',
            },
        ],
      },
      //基础设定-系统设定--模板
      {
        path : 'systemset',
        routes: [  
          //业态管理
          {
            path : '/systemset/formatManage',
            component : './SystemSetting/FormatParameter/FormatManage',
          },
          //税目管理
          { 
            path : "/systemset/taxManage",
            component : './SystemSetting/TaxParameter/TaxManage',
          },
          // 项目成本管理
          { 
            path : "/systemset/projectCostManage",
            component : './SystemSetting/ProjectCostParameter/ProjectCostManage',
          },
          // 合约规划模板
          { 
            path : "/systemset/contractPlanManage",
            component : './SystemSetting/ContractPlanne/ContractPlanManage',
          },
        ]
      },
      // 成本管理
      {

        path: '/cost',
        routes: [
          { path: '/cost/list', component: './CostManage/CostAccountList' },
          { path: '/cost/detail', component: './CostManage/CostAccountDetail'},
          // { path: '/system/user', component: './User/UserList' },
          // { path: '/system/systemparameter', component: './SystemParameter/SystemParameterList' },

          //合约规划
          { path: '/cost/contractPlan', component: './CostManage/ContractPlan/ContractPlanInfo' },
          //动态成本
          { path: '/cost/dynamicCost', component: './CostManage/DynamicCost/DynamicCostProj'},
          { path : '/cost/costmove', component: './CostManage/CostMove/CostMoveMange'}

        ],
      },
      // 营销管理
      {
        path: '/market',
        routes: [
          // 委托建设合同
          {path: '/market/bidCustomer/entrustedConstruction', component: './MarketManage/LargeCustomer/EntrustedConstruction'},
          // 文件管理
          {path: '/market/bidCustomer/fileManage', component: './MarketManage/LargeCustomer/FileManage'},
          // 合同详情
          {path: '/market/bidCustomer/contract_detail', component: './MarketManage/LargeCustomer/ContractDetail'},
        ]
      },
      // 合同管理
      {

        path: '/contractmanagement',
        routes: [
          // 合同签订
          { path: '/contractmanagement/signingList', component: './ContractManagement/ContractSigning/ContractSigningList' },
          // 合同变更
           { path: '/contractmanagement/changeTab', component: './ContractManagement/ContractChange/ContractChangeTab'},
          // { path: '/system/user', component: './User/UserList' },
          // { path: '/system/systemparameter', component: './SystemParameter/SystemParameterList' },
        ],
      },

    ],
  },
  {
    component: '404',
  },
];
