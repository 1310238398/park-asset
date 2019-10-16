import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetCarDealerDataService from '@/services/assetCarDealerData';

export default {
  namespace: 'assetCarDealerData',
  state: {
    searchCarDealer: {},
    paginationCarDealer: {},
    dataCarDealer: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '',
    // 楼栋数据
    formTypeCarDealer: '',
    formVisibleCarDealer: false,
    formDataCarDealer: {},
    formTitleCarDealer: '',
    formIDCarDealer: '',
  },
  effects: {
    // 查询车改商列表
    *fetchCarDealer({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchCarDealer',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetCarDealerData.searchCarDealer);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationCarDealer',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetCarDealerData.paginationCarDealer);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetCarDealerDataService.queryCarDealerPage, params);
      yield [
        put({
          type: 'saveCarDealerList',
          payload: response,
        }),
      ];
    },
    // 查询车改商单条数据
    *fetchFormCarDealer({ payload }, { call, put }) {
      const response = yield call(assetCarDealerDataService.getCarDealerOne, payload);
      yield put({
        type: 'saveFormDataCarDealer',
        payload: response,
      });
    },

    *LoadCarDealer({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleCarDealer',
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
          type: 'saveFormTypeCarDealer',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleCarDealer',
          payload: '新建车改商',
        }),
        put({
          type: 'saveFormIDCarDealer',
          payload: '',
        }),
        put({
          type: 'saveFormDataCarDealer',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleCarDealer',
            payload: '编辑车改商',
          }),
          put({
            type: 'saveFormIDCarDealer',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormCarDealer',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleCarDealer',
            payload: '查看车改商',
          }),
          put({
            type: 'saveFormIDCarDealer',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormCarDealer',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetCarDealerDataService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitCarDealer({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetCarDealerData.formTypeCarDealer);
      const proid = payload.project_id;
      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetCarDealerData.formIDCarDealer);
        response = yield call(assetCarDealerDataService.updateCarDealer, params);
      } else {
        response = yield call(assetCarDealerDataService.createCarDealer, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleCarDealer',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchCarDealer',
          search:{project_id:proid}
        });
      }
    },

    // 删除车改商
    *delCarDealer({ payload }, { call, put }) {
      const response = yield call(assetCarDealerDataService.delCarDealer, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchCarDealer' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveCarDealerList(state, { payload }) {
      return { ...state, dataCarDealer: payload };
    },
    saveSearchCarDealer(state, { payload }) {
      return { ...state, searchCarDealer: payload };
    },
    savePaginationCarDealer(state, { payload }) {
      return { ...state, paginationCarDealer: payload };
    },
    changeFormVisibleCarDealer(state, { payload }) {
      return { ...state, formVisibleCarDealer: payload };
    },
    saveFormTitleCarDealer(state, { payload }) {
      return { ...state, formTitleCarDealer: payload };
    },
    saveFormTypeCarDealer(state, { payload }) {
      return { ...state, formTypeCarDealer: payload };
    },
    saveFormIDCarDealer(state, { payload }) {
      return { ...state, formIDCarDealer: payload };
    },
    saveFormDataCarDealer(state, { payload }) {
      return { ...state, formDataCarDealer: payload };
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
