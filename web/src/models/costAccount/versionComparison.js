import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 版本对比
export default {
  namespace: 'versionComparison',
  state: {
    data: [],
    compareVersionList: [], //进行对比的版本
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
        }
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveCompareVersionList(state, { payload }) {
      return { ...state, compareVersionList: payload };
    },
  },
};
