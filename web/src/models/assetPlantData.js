import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetPlantDataService from '@/services/assetPlantData';

export default {
  namespace: 'assetPlantData',
  state: {
    searchPlant: {},
    paginationPlant: {},
    dataPlant: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '',
    // 楼栋数据
    formTypePlant: '',
    formVisiblePlant: false,
    formDataPlant: {},
    formTitlePlant: '',
    formIDPlant: '',
  },
  effects: {
    // 查询厂房列表
    *fetchPlant({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchPlant',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetPlantData.searchPlant);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationPlant',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetPlantData.paginationPlant);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetPlantDataService.queryPlantPage, params);
      yield [
        put({
          type: 'savePlantList',
          payload: response,
        }),
      ];
    },
    // 查询厂房单条数据
    *fetchFormPlant({ payload }, { call, put }) {
      const response = yield call(assetPlantDataService.getPlantOne, payload);
      yield put({
        type: 'saveFormDataPlant',
        payload: response,
      });
    },

    *LoadPlant({ payload }, { put }) {
      yield put({
        type: 'changeFormVisiblePlant',
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
          type: 'saveFormTypePlant',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitlePlant',
          payload: '新建厂房',
        }),
        put({
          type: 'saveFormIDPlant',
          payload: '',
        }),
        put({
          type: 'saveFormDataPlant',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitlePlant',
            payload: '编辑厂房',
          }),
          put({
            type: 'saveFormIDPlant',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormPlant',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitlePlant',
            payload: '查看厂房',
          }),
          put({
            type: 'saveFormIDPlant',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormPlant',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetPlantDataService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitPlant({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetPlantData.formTypePlant);
      const proid = payload.project_id;
      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetPlantData.formIDPlant);
        response = yield call(assetPlantDataService.updatePlant, params);
      } else {
        response = yield call(assetPlantDataService.createPlant, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisiblePlant',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchPlant',
          search:{project_id:proid}
        });
      }
    },

    // 删除厂房
    *delPlant({ payload }, { call, put }) {
      const response = yield call(assetPlantDataService.delPlant, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchPlant' });
      }
    },
  },
  reducers: {
    // 楼层数据
    savePlantList(state, { payload }) {
      return { ...state, dataPlant: payload };
    },
    saveSearchPlant(state, { payload }) {
      return { ...state, searchPlant: payload };
    },
    savePaginationPlant(state, { payload }) {
      return { ...state, paginationPlant: payload };
    },
    changeFormVisiblePlant(state, { payload }) {
      return { ...state, formVisiblePlant: payload };
    },
    saveFormTitlePlant(state, { payload }) {
      return { ...state, formTitlePlant: payload };
    },
    saveFormTypePlant(state, { payload }) {
      return { ...state, formTypePlant: payload };
    },
    saveFormIDPlant(state, { payload }) {
      return { ...state, formIDPlant: payload };
    },
    saveFormDataPlant(state, { payload }) {
      return { ...state, formDataPlant: payload };
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
