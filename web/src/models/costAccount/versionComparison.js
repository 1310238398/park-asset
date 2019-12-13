import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 版本对比
export default {
  namespace: 'versionComparison',
  state: {
    data: [],
    compareVersionList: [], //进行对比的版本(接口返回的)
    // start_version:"", // 起始版本 对象字符串
    // end_version:"",//最终版本 对象字符串
    // middle_version: [], // 中间版本 对象字符串数组
    columns: [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 150,
      },
      // {
      //     title: '起始版本',
      //     dataIndex: 'start',
      //     width: 100,

      //     align: 'center',

      // },
      // {
      //     title: '中间版本',

      //     children: [
      //         {
      //             title: '中间版本1',
      //             dataIndex: 'middle01',
      //             width: 100,
      //             align: 'center',
      //         },
      //         {
      //             title: '中间版本2',
      //             dataIndex: 'middle02',
      //             width: 100,
      //             align: 'center',
      //         },
      //         {
      //             title: '中间版本3',
      //             dataIndex: 'middle03',
      //             width: 100,
      //             align: 'center',
      //         },
      //     ]

      // },
      // {
      //     title: '最终版本',
      //     dataIndex: 'end',
      //     width: 100,

      //     align: 'center',

      // },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 150,
        editable: true,
        inputType: 'text',

        align: 'center',
      },
    ],
  },
  effects: {
    *fetchCompare({ payload }, { call, put }) {
      const response = yield call(costAccountService.queryBeforeSaveVersion, payload.params);
      if (response && response.data) {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
        if (response && response.version_list) {
          yield put({
            type: 'saveCompareVersionList',
            payload: response.version_list,
          });
          yield put({
            type: 'updateColumns',
            payload: {},
          });
        }
      }
    },
    *updateColumns({}, { put, select }) {
      let co = yield select(state => state.versionComparison.columns);
      let versions = yield select(state => state.versionComparison.compareVersionList);

      let start_version = {
        title: versions[0] && versions[0].value,
        dataIndex: versions[0] && versions[0].key,
        width: 100,

        align: 'center',
      };
      let end_version = {
        title: versions[versions.length - 1] && versions[versions.length - 1].value,
        dataIndex: versions[versions.length - 1] && versions[versions.length - 1].key,
        width: 100,

        align: 'center',
      };
      co.splice(1, 0, start_version);
      co.splice(co.length - 2, 0, end_version);

      let middles = [];

      for (let i = 0; i < versions.length; i++) {
        if (i === 0 || i === versions.length - 1) {
          continue;
        }
        let middle_item = {
          title: versions[i].value,
          dataIndex: versions[i].key,
          width: 100,
          align: 'center',
        };
        middles.push(middle_item);
      }
      let middle_version = {
        title: '中间版本',
        children: middles,
      };
      co.splice(2, 0, middle_version);

      yield put({
        type: 'saveColumns',
        payload: co,
      });
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveCompareVersionList(state, { payload }) {
      return { ...state, compareVersionList: payload };
    },
    saveColumns(state, { payload }) {
      return { ...state, columns: payload };
    },
  },
};
