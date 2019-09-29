import * as dataDashboadService from '@/services/dataDashboad';

export default {
  namespace: 'dataDashboad',
  state: {
    showCompany: false,
    companyInfo: {},
    companyList: [],
    comPanyId: '',
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
          payload: { record_id: payload.id, year: payload.year },
        }),
        put({
          type: 'saveCompanyID',
          payload: payload.id,
        }),
      ];
    },
    *fetchFormCompany({ payload }, { call, put }) {
      const response = yield call(dataDashboadService.queryCompanyOne, payload);
      yield put({
        type: 'saveFormDataCompany',
        payload: response,
      });
    },

    // 查询子公司列表
    *queryCompanyList({ payload }, { call, put }) {
      const response = yield call(dataDashboadService.queryCompanyList, payload);
      const result = response.list || [];
      yield put({
        type: 'saveCompanyList',
        payload: result,
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
    saveCompanyList(state, { payload }) {
      return { ...state, companyList: payload };
    },
    saveCompanyID(state, { payload }) {
      return { ...state, comPanyId: payload };
    },
  },
};
