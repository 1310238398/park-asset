import * as assetDatamaintService from '@/services/assetDatamaint';

export default {
  namespace: 'dataDashboad',
  state: {
    showCompany: false,
    companyInfo: {},
  },
  effects: {
    *LoadCompangShow({ payload }, { put }) {
      yield [
        put({
          type: 'changeShowCompany',
          payload: true,
        }),
        put({
          type: 'fetchFormCompany',
          payload: { record_id: payload.id },
        }),
      ];
    },
    *fetchFormCompany({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataCompany',
        payload: response,
      });
    },
  },
  reducers: {
    changeShowCompany(state, { payload }) {
      return { ...state, showCompany: payload };
    },
    saveFormDataCompany(state, { payload }) {
      return { ...state, companyInfo: payload };
    },
  },
};
