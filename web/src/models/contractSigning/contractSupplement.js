import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractSupplementService from '@/services/contractSupplement';

export default {
  namespace: 'contractSupplement',
  state: {
    searchSupplement: {},
    paginationSupplement: {},
    // 列表数据
    dataSupplement: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '',
    // 新增还是编辑类型
    formTypeSupplement: '',
    // 新增框是否可见
    formVisibleSupplement: false,
    // 合约规划弹框是否可见
    formVisiblePlanning: false,
    // 数据
    formDataSupplement: {},
    formTitleSupplement: '',
    formIDSupplement: '',
    // 合约规划是否引用完余额是否可见
    formVisibleFinishquoting: false,
    FinishquotingData: {},
    treeData: [],
    // 原合同名称
    treeOriginConData: [],
  },
  effects: {
    // 甲乙单位树状结构
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.contractSupplement.treeData);
      const expandedKeys = [];
      if (treeData.length > 0) {
        expandedKeys.push(treeData[0].record_id);
      }
      yield put({
        type: 'saveExpandedKeys',
        payload: expandedKeys,
      });
    },

    // 甲乙单位树状结构
    *fetchTree({ payload }, { call, put }) {
      let params = {
        q: 'page',
        current: 1,
        pageSize: 50,
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSupplementService.query, params);
      console.log(response);
      const list = response.list || [];
      yield put({
        type: 'saveTreeData',
        payload: list,
      });
    },
    // 原合同名称树状结构
    *loadOriginConTree(_, { put, select }) {
      yield yield put({ type: 'fetchOriginConTree' });
      const treeOriginConData = yield select(state => state.contractSupplement.treeOriginConData);
      const expandedKeys = [];
      if (treeOriginConData.length > 0) {
        expandedKeys.push(treeOriginConData[0].record_id);
      }
      yield put({
        type: 'saveOriExpandedKeys',
        payload: expandedKeys,
      });
    },

    // 甲乙单位树状结构
    *fetchOriginConTree({ payload }, { call, put }) {
      let params = {
        q: 'page',
        current: 1,
        pageSize: 50,
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSupplementService.querySupplementPage, params);
      console.log(response);
      const list = response.list || [];
      yield put({
        type: 'saveOriTreeData',
        payload: list,
      });
    },
    // 查询厂房列表
    *fetchSupplement({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchSupplement',
          payload: search,
        });
      } else {
        const s = yield select(state => state.contractSupplement.searchSupplement);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationSupplement',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.contractSupplement.paginationSupplement);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractSupplementService.querySupplementPage, params);
      yield [
        put({
          type: 'saveSupplementList',
          payload: response,
        }),
      ];
    },
    // 查询厂房单条数据
    *fetchFormSupplement({ payload }, { call, put }) {
      const response = yield call(contractSupplementService.getSupplementOne, payload);
      yield put({
        type: 'saveFormDataSupplement',
        payload: response,
      });
    },

    *loadSupplementForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleSupplement',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeSupplement',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleSupplement',
          payload: '新增补充合同',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveformDataSupplement',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleSupplement',
            payload: '编辑合同',
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
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleSupplement',
            payload: '查看合同详情',
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

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(contractSupplementService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitSupplement({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeSupplement = yield select(state => state.contractSupplement.formTypeSupplement);
      const proid = payload.project_id;
      let response;
      if (formTypeSupplement === 'E') {
        params.record_id = yield select(state => state.contractSupplement.formIDSupplement);
        response = yield call(contractSupplementService.updateSupplement, params);
      } else {
        response = yield call(contractSupplementService.createSupplement, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleSupplement',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchSupplement',
          search: { project_id: proid },
        });
      }
    },
    // 对余额处理方式进行保存
    *saveFinishquotingData({ payload }, { put }) {
      // yield put({
      //   type: 'saveFormFinishquotingDataSiging',
      //   payload: payload,
      // });
      yield put({
        type: 'contractSupplement/changeFormVisibleFinishquoting',
        payload: payload.visible,
      });
    },
    // 删除厂房
    *delSupplement({ payload }, { call, put }) {
      const response = yield call(contractSupplementService.delSupplement, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchSupplement' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveSupplementList(state, { payload }) {
      return { ...state, dataSupplement: payload };
    },
    saveSearchSupplement(state, { payload }) {
      return { ...state, searchSupplement: payload };
    },
    savePaginationSupplement(state, { payload }) {
      return { ...state, paginationSupplement: payload };
    },
    changeFormVisibleSupplement(state, { payload }) {
      return { ...state, formVisibleSupplement: payload };
    },
    saveFormTitleSupplement(state, { payload }) {
      return { ...state, formTitleSupplement: payload };
    },
    saveFormTypeSupplement(state, { payload }) {
      return { ...state, formTypeSupplement: payload };
    },
    saveFormIDSupplement(state, { payload }) {
      return { ...state, formIDSupplement: payload };
    },
    saveFormDataSupplement(state, { payload }) {
      return { ...state, formDataSupplement: payload };
    },
    // 项目名称
    saveProData(state, { payload }) {
      return { ...state, proData: payload };
    },
    // 保存项目ID
    saveProjectID(state, { payload }) {
      return { ...state, proID: payload };
    },
    // 选择合约规划是否可见
    changeFormVisiblePlanning(state, { payload }) {
      return { ...state, formVisiblePlanning: payload };
    },
    // 选择合约规划余额选择是否可见
    changeFormVisibleFinishquoting(state, { payload }) {
      return { ...state, formVisibleFinishquoting: payload };
    },
    // 保存余额处理方式
    saveFormFinishquotingDataSiging(state, { payload }) {
      return { ...state, FinishquotingData: payload };
    },
    //保存树结构
    saveTreeData(state, { payload }) {
      return { ...state, treeData: payload };
    },
    //保存原合同
    saveOriTreeData(state, { payload }) {
      return { ...state, treeOriginConData: payload };
    },
  },
};
