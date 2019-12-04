import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 当前版本
export default {
  namespace: 'currentVersion',
  state: {
    data: [],
    submitting: false,
    newFormVisible: false,
    selectNewModeVisile: false,
    currentVersionID: "", // 当前版本的record_id
    canSave: true, // 是否可以保存当前版本
    

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(costAccountService.getCurrentVersionInfo, payload);
      if (response.list && response.list.length >= 0) {
        yield put({
          type: 'saveData',
          payload: response.list || [],
        });
      
        if (response.info && response.info.record_id) {
          yield put({
            type: 'saveCurrentVersionID',
            payload:response.info.record_id
          });
        }

        if (response.info && response.info.flag !== 1) {
          // 不可保存
          yield put({
            type: 'saveCanSave',
            payload: false,
          });
        }
      }
    },
    *createNewVersion({}, {}) {},
  },
  reducers: {
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveNewFormVisible(state, { payload }) {
      return { ...state, newFormVisible: payload };
    },
    saveSelectNewModeVisile(state, { payload }) {
      return { ...state, selectNewModeVisile: payload };
    },
    saveCanSave(state, { payload }) {
      return { ...state, canSave: payload };
    },
    saveCurrentVersionID(state, { payload }) {
      return { ...state, currentVersionID: payload };
    }
  },
};
