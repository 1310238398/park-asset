import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetShopDataService from '@/services/assetShopData';

export default {
  namespace: 'assetShopData',
  state: {
    searchShop: {},
    paginationShop: {},
    dataShop: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '',
    // 楼栋数据
    formTypeShop: '',
    formVisibleShop: false,
    formDataShop: {},
    formTitleShop: '',
    formIDShop: '',
  },
  effects: {
    // 查询商铺列表
    *fetchShop({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchShop',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetShopData.searchShop);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationShop',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetShopData.paginationShop);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetShopDataService.queryShopPage, params);
      yield [
        put({
          type: 'saveShopList',
          payload: response,
        }),
      ];
    },
    // 查询商铺单条数据
    *fetchFormShop({ payload }, { call, put }) {
      const response = yield call(assetShopDataService.getShopOne, payload);
      yield put({
        type: 'saveFormDataShop',
        payload: response,
      });
    },

    *LoadShop({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleShop',
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
          type: 'saveFormTypeShop',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleShop',
          payload: '新建商铺',
        }),
        put({
          type: 'saveFormIDShop',
          payload: '',
        }),
        put({
          type: 'saveFormDataShop',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleShop',
            payload: '编辑商铺',
          }),
          put({
            type: 'saveFormIDShop',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormShop',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleShop',
            payload: '查看商铺',
          }),
          put({
            type: 'saveFormIDShop',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormShop',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetShopDataService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitShop({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetShopData.formTypeShop);
      const proid = payload.project_id;
      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetShopData.formIDShop);
        response = yield call(assetShopDataService.updateShop, params);
      } else {
        response = yield call(assetShopDataService.createShop, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleShop',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchShop',
          search:{project_id:proid}
        });
      }
    },

    // 删除商铺
    *delShop({ payload }, { call, put }) {
      const response = yield call(assetShopDataService.delShop, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchShop' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveShopList(state, { payload }) {
      return { ...state, dataShop: payload };
    },
    saveSearchShop(state, { payload }) {
      return { ...state, searchShop: payload };
    },
    savePaginationShop(state, { payload }) {
      return { ...state, paginationShop: payload };
    },
    changeFormVisibleShop(state, { payload }) {
      return { ...state, formVisibleShop: payload };
    },
    saveFormTitleShop(state, { payload }) {
      return { ...state, formTitleShop: payload };
    },
    saveFormTypeShop(state, { payload }) {
      return { ...state, formTypeShop: payload };
    },
    saveFormIDShop(state, { payload }) {
      return { ...state, formIDShop: payload };
    },
    saveFormDataShop(state, { payload }) {
      return { ...state, formDataShop: payload };
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
