import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 历史版本
export default {
  namespace: 'hisVersion',
  state: {
    data: [],
    infoModalVisible: false,
    formData: [], // 某一个历史版本的详情
    formID: '', // 选中的某一个历史版本record_id
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const params = { ...payload };
      const response = yield call(costAccountService.queryHisVersionList, params);
      if (response.list) {
        yield put({
          type: 'saveData',
          payload: response.list || [],
        });
      }
    },
    *fetchForm({ payload }, { call, put }) {
      console.log('fetchForm ' + payload.record_id);
      const response = yield call(costAccountService.queryHisVersionDetail, payload.record_id);
      if (response && response.list) {
        yield put({
          type: 'saveFormData',
          payload: response.list,
        });

        yield put({
          type: 'changeInfoModalVisible',
          payload: true,
        });
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    changeInfoModalVisible(state, { payload }) {
      return { ...state, infoModalVisible: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
  },
};
