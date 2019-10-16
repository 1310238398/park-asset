import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetFarmmarketDataService from '@/services/assetFarmmarketData';

export default {
  namespace: 'assetFarmmarketData',
  state: {
    searchFarmmarket: {},
    paginationFarmmarket: {},
    dataFarmmarket: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '',
    // 楼栋数据
    formTypeFarmmarket: '',
    formVisibleFarmmarket: false,
    formDataFarmmarket: {},
    formTitleFarmmarket: '',
    formIDFarmmarket: '',
  },
  effects: {
    // 查询农贸市场列表
    *fetchFarmmarket({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchFarmmarket',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetFarmmarketData.searchFarmmarket);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationFarmmarket',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetFarmmarketData.paginationFarmmarket);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetFarmmarketDataService.queryFarmmarketPage, params);
      yield [
        put({
          type: 'saveFarmmarketList',
          payload: response,
        }),
      ];
    },
    // 查询农贸市场单条数据
    *fetchFormFarmmarket({ payload }, { call, put }) {
      const response = yield call(assetFarmmarketDataService.getFarmmarketOne, payload);
      yield put({
        type: 'saveFormDataFarmmarket',
        payload: response,
      });
    },

    *LoadFarmmarket({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleFarmmarket',
        payload: true,
      });

      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });

        // 保存proId
        yield put({
          type: 'saveProjectID',
          payload: payload.inProjectID,
        });
      }
      yield [
        put({
          type: 'saveFormTypeFarmmarket',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleFarmmarket',
          payload: '新建农贸市场',
        }),
        put({
          type: 'saveFormIDFarmmarket',
          payload: '',
        }),
        put({
          type: 'saveFormDataFarmmarket',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleFarmmarket',
            payload: '编辑农贸市场',
          }),
          put({
            type: 'saveFormIDFarmmarket',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormFarmmarket',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleFarmmarket',
            payload: '查看农贸市场',
          }),
          put({
            type: 'saveFormIDFarmmarket',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormFarmmarket',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetFarmmarketDataService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitFarmmarket({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetFarmmarketData.formTypeFarmmarket);
      const proid = payload.project_id;
      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetFarmmarketData.formIDFarmmarket);
        response = yield call(assetFarmmarketDataService.updateFarmmarket, params);
      } else {
        response = yield call(assetFarmmarketDataService.createFarmmarket, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleFarmmarket',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchFarmmarket',
          search:{project_id:proid}
        });
      }
    },

    // 删除农贸市场
    *delFarmmarket({ payload }, { call, put }) {
      const response = yield call(assetFarmmarketDataService.delFarmmarket, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchFarmmarket' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveFarmmarketList(state, { payload }) {
      return { ...state, dataFarmmarket: payload };
    },
    saveSearchFarmmarket(state, { payload }) {
      return { ...state, searchFarmmarket: payload };
    },
    savePaginationFarmmarket(state, { payload }) {
      return { ...state, paginationFarmmarket: payload };
    },
    changeFormVisibleFarmmarket(state, { payload }) {
      return { ...state, formVisibleFarmmarket: payload };
    },
    saveFormTitleFarmmarket(state, { payload }) {
      return { ...state, formTitleFarmmarket: payload };
    },
    saveFormTypeFarmmarket(state, { payload }) {
      return { ...state, formTypeFarmmarket: payload };
    },
    saveFormIDFarmmarket(state, { payload }) {
      return { ...state, formIDFarmmarket: payload };
    },
    saveFormDataFarmmarket(state, { payload }) {
      return { ...state, formDataFarmmarket: payload };
    },
    // 项目名称
    saveProData(state, { payload }) {
      return { ...state, proData: payload };
    },
    // 保存项目ID
    saveProjectID(state, { payload }) {
      return { ...state, proID: payload };
    },
  },
};
