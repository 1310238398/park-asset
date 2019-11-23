import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
import * as projectManage from '@/services/projectManage';
// 成本核算列表
export default {
  namespace: 'costList',
  state:{
    data:[], // 成本核算列表
    formateData:[], // 当前项目下的所有业态列表
    formatUnitPriceData:[],
    formatTotalPriceData:[],

  },
  effects: {

    *fetch({ payload }, { call, put, select }) {
      const params = { ...payload };
      // 请求所有的核算列表
      const response = yield call(costAccountService.queryCostList, params);

      yield put({
        type: 'saveData',
        payload: response || [],
      });
    const response1 = yield call(projectManage.getProFormat,{record_id: params.project_id}) ;
  
    if (response1 && response1.list) {
     
      yield put({
        type: 'saveFormatData',
        payload: response.list,
      });

    }
    // 初始化单价 总价的 column

    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveFormatData(state, { payload }) {
      return { ...state, formateData: payload };
    },
    saveFormatUnitPriceData(state, { payload }) {
      return { ...state, formatUnitPriceData: payload };
    },
    savFormatTotalPriceData(state, { payload }) {
      return { ...state, formatTotalPriceData: payload };
    }
  }
}