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
        path: '',
      },
    ],
  },
  {
    component: '404',
  },
];
