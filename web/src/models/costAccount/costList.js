import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 成本核算列表
export default {
  namespace: 'costList',
  state:{
    data:[], // 成本核算列表
    formateData:[], // 当前项目下的所有业态列表


  },
  effects: {

    *fetch({ payload }, { call, put, select }) {
      const params = { ...payload };
      console.log("请求成本项列表");

      const response = yield call(costAccountService.queryCostList, params);

      yield put({
        type: 'saveData',
        payload: response || [],
      });
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
  }
}