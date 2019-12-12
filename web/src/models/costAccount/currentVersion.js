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
    currentVersionID: '', // 当前版本的record_id
    canSave: true, // 是否可以保存当前版本
    compareTree: [], // 保存版本前，查询回来的对比信息树
    saveVersionType: '', // 1  创建新版本 2 更新版本
    saveTitle: '', // 保存版本时的标题
    compareVersionList: [], //进行对比的版本
    versionNameVisible: false,
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
            payload: response.info.record_id,
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
    *fetchCompare({ payload }, { call, put }) {
      yield put({
        type: 'saveSaveVersionType',
        payload: payload.saveType,
      });
      yield put({
        type: 'saveSaveTitle',
        payload: payload.saveTitle,
      });
      const response = yield call(costAccountService.queryBeforeSaveVersion, payload.params);
      if (response && response.data) {
        yield put({
          type: 'saveCompareTree',
          payload: response.data,
        });
        if (response && response.version_list) {
          yield put({
            type: 'saveCompareVersionList',
            payload: response.version_list,
          });
        }
        yield put({
          type: 'saveNewFormVisible',
          payload: true,
        });
      }
    },
    *createNewVersion({payload}, {call }) {
      const response = yield call(costAccountService.saveNewVersion, payload);
      if (response.status === "OK") {
        message.success("创建版本成功");
      }
    },
    *updateOldVersion({payload}, {call }) {
      const response = yield call(costAccountService.saveOldVersion, payload);
      if (response.status === "OK") {
        message.success("更新版本成功");
      }
    }

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
    },
    saveCompareTree(state, { payload }) {
      return { ...state, compareTree: payload };
    },
    saveSaveVersionType(state, { payload }) {
      return { ...state, saveVersionType: payload };
    },
    saveSaveTitle(state, { payload }) {
      return { ...state, saveTitle: payload };
    },
    saveCompareVersionList(state, { payload }) {
      return { ...state, compareVersionList: payload };
    },
    saveVersionNameVisible(state, { payload }) {
      return { ...state, versionNameVisible: payload};
    }
  },
};
