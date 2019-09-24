import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetDatamaintService from '@/services/assetDatamaint';

export default {
  namespace: 'assetDatamaint',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },
    searchBuild: {},
    paginationBuild: {},
    dataBuild: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
    // 楼栋数据
    formTypeBuild: '',
    formVisibleBuild: false,
    formDataBuild: {},
    formTitleBuild: '',
    formIDBuild: '',
    // 单元数据
    formTypeUnit: '',
    formVisibleUnit: false,
    formDataUnit: {},
    formTitleUnit: '',
    formIDUnit: '',

    // 租金数据
    formTypeZJ: '',
    formVisibleZJ: false,
    formDataZJ: {},
    formTitleZJ: '',
    formIDZJ: '',
    // 缴费数据
    formTypeJF: '',
    formVisibleJF: false,
    formDataJF: {},
    formTitleJF: '',
    formIDJF: '',
    // 项目数据
    proData: {},
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetDatamaint.search);
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
        const p = yield select(state => state.assetDatamaint.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(assetDatamaintService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

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
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.get, payload);
      yield [
        put({
          type: 'saveFormData',
          payload: response,
        }),
      ];
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetDatamaint.formType);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetDatamaint.formID);
        response = yield call(assetDatamaintService.update, params);
      } else {
        response = yield call(assetDatamaintService.create, params);
      }

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
    *del({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    // 楼栋数据
    *LoadBuild({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleBuild',
        payload: true,
      });
      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });
      }

      yield [
        put({
          type: 'saveFormTypeBuild',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleBuild',
          payload: '新建楼栋',
        }),
        put({
          type: 'saveFormIDBuild',
          payload: '',
        }),
        put({
          type: 'saveFormDataBuild',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleBuild',
            payload: '编辑楼栋',
          }),
          put({
            type: 'saveFormIDBuild',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormBuild',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleBuild',
            payload: '查看楼栋',
          }),
          put({
            type: 'saveFormIDBuild',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormBuild',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    // 查询楼栋单条数据
    *fetchFormBuild({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataBuild',
        payload: response,
      });
    },

    *submitBuild({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeBuild = yield select(state => state.assetDatamaint.formTypeBuild);

      let response;
      if (formTypeBuild === 'E') {
        params.record_id = yield select(state => state.assetDatamaint.formIDBuild);
        response = yield call(assetDatamaintService.updateBuild, params);
      } else {
        response = yield call(assetDatamaintService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleBuild',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetchBuidings',
        });
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    // 单元部分数据
    *cellRoute({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assetdatamaint/assetunitmaint',
          query: {
            recordID: payload.record_id,
            type: payload.asset_type,
          },
        })
      );
    },

    *LoadUnit({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleUnit',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeUnit',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleUnit',
          payload: '新建单元',
        }),
        put({
          type: 'saveFormIDUnit',
          payload: '',
        }),
        put({
          type: 'saveFormDataUnit',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleUnit',
            payload: '编辑单元',
          }),
          put({
            type: 'saveFormIDUnit',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormUnit',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleUnit',
            payload: '查看单元',
          }),
          put({
            type: 'saveFormIDUnit',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormUnit',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *fetchFormUnit({ payload }, { call, put }) {
      const response = yield call(assetDatamaintService.get, payload);
      yield [
        put({
          type: 'saveFormDataUnit',
          payload: response,
        }),
      ];
    },
    *submitUnit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetDatamaint.formType);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetDatamaint.formID);
        response = yield call(assetDatamaintService.update, params);
      } else {
        response = yield call(assetDatamaintService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleUnit',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetch',
        });
      }
    },
    // 楼层部分数据
    *floorRoute({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assetdatamaint/assetfloormaint',
          query: {
            recordID: payload.record_id,
            type: payload.asset_type,
          },
        })
      );
    },

    // 楼栋详情-作废操作TODO
    // 弹窗关闭-跳转哪儿？是否关闭父级弹窗
    // *SaveDataDisCard({ params }, { put }) {
    //   const response = yield call(assetDatamaintService.SaveDisCard, params);
    //   yield put({ type: 'fetch' });
    // },

    // 租金
    *loadFormZJ({ payload }, { put }) {
      if (payload.type === 'AZJ') {
        yield put({
          type: 'changeFormVisibleZJ',
          payload: true,
        });
        yield [
          put({
            type: 'saveFormTypeZJ',
            payload: payload.type,
          }),
          put({
            type: 'saveFormTitleZJ',
            payload: '新建租金',
          }),
          put({
            type: 'saveFormIDZJ',
            payload: '',
          }),
          put({
            type: 'saveFormDataZJ',
            payload: {},
          }),
        ];
      }
      if (payload.type === 'AJF') {
        yield put({
          type: 'changeFormVisibleJF',
          payload: true,
        });
        yield [
          put({
            type: 'saveFormTypeJF',
            payload: payload.type,
          }),
          put({
            type: 'saveFormTitleJF',
            payload: '新建缴费',
          }),
          put({
            type: 'saveFormIDJF',
            payload: '',
          }),
          put({
            type: 'saveFormDataJF',
            payload: {},
          }),
        ];
      }

      if (payload.type === 'EJF') {
        yield [
          put({
            type: 'saveFormTitleJF',
            payload: '编辑缴费',
          }),
          put({
            type: 'saveFormIDJF',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormJF',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 缴费信息
    *submitJF({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetDatamaint.formTypeJF);

      let response;
      if (formType === 'EJF') {
        params.record_id = yield select(state => state.assetDatamaint.formID);
        response = yield call(assetDatamaintService.update, params);
      } else {
        response = yield call(assetDatamaintService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleJF',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetch',
        });
      }
    },

    // 租金信息
    *submitZJ({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetDatamaint.formTypeZJ);

      let response;
      if (formType === 'EZJ') {
        params.record_id = yield select(state => state.assetDatamaint.formID);
        response = yield call(assetDatamaintService.update, params);
      } else {
        response = yield call(assetDatamaintService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleZJ',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetch',
        });
      }
    },
    // 查询写字楼列表
    *fetchBuidings({ search, pagination, select }, { call, put }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchBuild',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetDatamaint.searchBuild);
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
        const p = yield select(state => state.assetDatamaint.paginationBuild);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetDatamaintService.queryBuildingsPage, params);
      yield [
        put({
          type: 'saveBuidings',
          payload: response,
        }),
      ];
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
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    // 楼栋数据
    changeFormVisibleBuild(state, { payload }) {
      return { ...state, formVisibleBuild: payload };
    },
    saveFormTitleBuild(state, { payload }) {
      return { ...state, formTitleBuild: payload };
    },
    saveFormTypeBuild(state, { payload }) {
      return { ...state, formTypeBuild: payload };
    },
    saveFormIDBuild(state, { payload }) {
      return { ...state, formIDBuild: payload };
    },
    saveFormDataBuild(state, { payload }) {
      return { ...state, formDataBuild: payload };
    },
    // 单元数据
    changeFormVisibleUnit(state, { payload }) {
      return { ...state, formVisibleUnit: payload };
    },
    saveFormTitleUnit(state, { payload }) {
      return { ...state, formTitleUnit: payload };
    },
    saveFormTypeUnit(state, { payload }) {
      return { ...state, formTypeUnit: payload };
    },
    saveFormIDUnit(state, { payload }) {
      return { ...state, formIDUnit: payload };
    },
    saveFormDataUnit(state, { payload }) {
      return { ...state, formDataUnit: payload };
    },

    // 写字楼列表
    saveBuidings(state, { payload }) {
      return { ...state, dataBuild: payload };
    },
    saveSearchBuild(state, { payload }) {
      return { ...state, searchBuild: payload };
    },
    savePaginationBuild(state, { payload }) {
      return { ...state, paginationBuild: payload };
    },

    // 租金信息
    changeFormVisibleZJ(state, { payload }) {
      return { ...state, formVisibleZJ: payload };
    },
    saveFormTitleZJ(state, { payload }) {
      return { ...state, formTitleZJ: payload };
    },
    saveFormTypeZJ(state, { payload }) {
      return { ...state, formTypeZJ: payload };
    },
    saveFormIDZJ(state, { payload }) {
      return { ...state, formIDZJ: payload };
    },
    saveFormDataZJ(state, { payload }) {
      return { ...state, formDataZJ: payload };
    },

    // 缴费信息
    changeFormVisibleJF(state, { payload }) {
      return { ...state, formVisibleJF: payload };
    },
    saveFormTitleJF(state, { payload }) {
      return { ...state, formTitleJF: payload };
    },
    saveFormTypeJF(state, { payload }) {
      return { ...state, formTypeJF: payload };
    },
    saveFormIDJF(state, { payload }) {
      return { ...state, formIDJF: payload };
    },
    saveFormDataJF(state, { payload }) {
      return { ...state, formDataJF: payload };
    },

    // 项目名称
    saveProData(state, { payload }) {
      return { ...state, proData: payload };
    },
  },
};
