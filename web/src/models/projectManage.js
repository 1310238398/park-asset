import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as projectManageService from '@/services/projectManage';
import * as formatManageService from '@/services/formatManage';

export default {
  namespace: 'projectManage',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '', // 项目ID
    formType: '',
    formVisible: false,
    newFormVisible: false,
    currentIndex: 0, // 编辑页面当前所在页面索引
    formData: {}, // 一条数据详情
    businessFormat: [], // 项目的业态数据

    allBusinessFormat: [], // 所有的业态列表
    deliveryStandard: {}, // 项目的交付标准
    companyList: [],
    poltList: [],
  },
  // 调service  call 调service函数 put 调reducer函数 select
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {
        //q: 'page',
      };

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.projectManage.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.projectManage.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(projectManageService.queryList, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put, select }) {
      if (payload.type === 'E') {
        yield put({
          type: 'saveCurrentIndex',
          payload: payload.currentIndex,
        });
        let index = yield select(state => state.projectManage.currentIndex);

        yield put({
          type: 'changeNewFormVisible',
          payload: true,
        });
      } else if (payload.type === 'A') {
        yield put({
          type: 'changeNewFormVisible',
          payload: true,
        });
      }

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建项目',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),

        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑项目',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),

          put({
            type: 'fetchForm',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *fetchForm({ payload }, { call, put, select }) {
      const response = yield call(projectManageService.getProInfo, payload);
      if (response && response.asset_type) {
        response.asset_type = response.asset_type.split(',');
      }
      yield [
        put({
          type: 'saveFormData',
          payload: response,
        }),
      ];

      const response_format = yield call(projectManageService.getProFormat, payload);

      if (response_format && response_format.list) {
        yield [
          put({
            type: 'saveFormatData',
            payload: response_format.list,
          }),
        ];
      }

      // 查询所有业态
      const all_format = yield call(formatManageService.queryList, {});
      if (all_format && all_format.list) {
        yield [
          put({
            type: 'saveAllFormatData',
            payload: all_format.list,
          }),
        ];
      }

      // 修改allFormatData
      const allBusinessFormat = yield select(state => state.projectManage.allBusinessFormat);
      const businessFormat = yield select(state => state.projectManage.businessFormat);

      for (let i = 0; i < allBusinessFormat.length; i++) {
        console.log('hhhhhh');
        for (let j = 0; j < businessFormat.length; j++) {
          console.log('rrrrr');
          if (allBusinessFormat[i].record_id === businessFormat[j].business_format_id) {
            allBusinessFormat[i].checked = true;
            console.log('选择');
          }

          if (j === businessFormat.length - 1) {
            allBusinessFormat[i].checked = false;
            console.log('未选择');
          }
        }
      }

      yield [
        put({
          type: 'saveAllFormatData',
          payload: [...allBusinessFormat],
        }),
      ];

      console.log('所有业态 ' + JSON.stringify(allBusinessFormat));

      // 交付标准
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.projectManage.formType);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.projectManage.formID);
        response = yield call(projectManageService.update, params);
      } else {
        response = yield call(projectManageService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeNewFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(projectManageService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *queryCompany(_, { call, put }) {
      const params = {
        q: 'company',
      };
      const response = yield call(projectManageService.companySecond, params);
      const result = response.list ? response.list : [];
      yield put({
        type: 'saveDataCompany',
        payload: result,
      });
    },
    *queryPlotList(_, { call, put }) {
      const params = {
        q: 'list',
      };
      const response = yield call(projectManageService.PoltList, params);
      const result = response.list ? response.list : [];
      yield put({
        type: 'savePolt',
        payload: result,
      });
    },
    *redirectBuilings({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assetdatamaint/assetdatamaintlist',
          query: {
            recordID: payload.record_id,
            type: payload.asset_type,
          },
        })
      );
    },
    *createPro({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      let response;
      response = yield call(projectManageService.createPro, params);

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },

   
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    changeNewFormVisible(state, { payload }) {
      return { ...state, newFormVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveCurrentIndex(state, { payload }) {
      return { ...state, currentIndex: payload };
    },
    saveFormatData(state, { payload }) {
      return { ...state, businessFormat: payload };
    },
    saveAllFormatData(state, { payload }) {
      return { ...state, allBusinessFormat: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveDataCompany(state, { payload }) {
      return { ...state, companyList: payload };
    },
    savePolt(state, { payload }) {
      return { ...state, poltList: payload };
    },
  },
};
