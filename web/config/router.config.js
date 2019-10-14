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
          {
            path: '/assettypedata/assetshop',
            component: './AssetTypeData/AssetShopData/AssetShopData',
          }
        ],
      }
    ],
  },
  {
    component: '404',
  },
];
