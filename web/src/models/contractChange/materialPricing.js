import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractMaterialPricingService from '@/services/contractMaterialPricing';

export default {
  namespace: 'materialPricing',
  state: {
    searchMaterialPricing: {},
    paginationMaterialPricing: {},
    // 列表数据
    dataMaterialPricing: {
      list: [],
      pagination: {},
    },
    proData: {},

    proID: '', // 当前选中的项目ID
    projectTreeData: [],
    // 新增还是编辑类型
    formTypeMaterialPricing: '',
    // 新增框是否可见
    formVisibleMaterialPricing: false,
    // 合约规划弹框是否可见
    formVisiblePlanning: false,
    // 数据
    formDataMaterialPricing: {},
    formTitleMaterialPricing: '',
    formIDMaterialPricing: '',
    // 合约规划是否引用完余额是否可见
    formVisibleFinishquoting: false,
    FinishquotingData: {},
    // 合同结算页面是否可见
    formVisibleSettlement: false,
    // 合同结算页面数据
    formDataSettlement: {},
    // 选择乙方单位树形结构
    treeData: [],
    expandedKeys: [],
    // 合约生效界面是否可见
    formVisibleTakeEffect: false,
    // 签证确认界面弹出框
    formVisibleVisaSure: false,
    materialPricingList: [],
  },
  effects: {
    // 查询树状结构
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.materialPricing.treeData);
      const expandedKeys = [];
      if (treeData.length > 0) {
        expandedKeys.push(treeData[0].record_id);
      }
      yield put({
        type: 'saveExpandedKeys',
        payload: expandedKeys,
      });
    },

    *fetchTree({ payload }, { call, put }) {
      let params = {
        q: 'tree',
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractMaterialPricingService.query, params);
      const list = response.list || [];
      yield put({
        type: 'saveTreeData',
        payload: list,
      });
    },

    // 获取变更原因的数据
    *fetchChangeReason({ payload }, { call, put }) {
      let params = {
        q: 'tree',
        parent_code: 'contract$#PricingReason',
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractMaterialPricingService.queryChangeReason, params);
      const list = response.list || [];
      const arr = [];
      list.forEach(el => {
        arr.push({
          label: el.name,
          value: el.code,
        });
      });
      yield put({
        type: 'saveReasonList',
        payload: arr,
      });
    },

    // 查询厂房列表
    *fetchMaterialPricing({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchMaterialPricing',
          payload: search,
        });
      } else {
        const s = yield select(state => state.materialPricing.searchMaterialPricing);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationMaterialPricing',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.materialPricing.paginationMaterialPricing);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractMaterialPricingService.queryMaterialPricingPage, params);
      yield [
        put({
          type: 'saveMaterialPricingList',
          payload: response,
        }),
      ];
    },

    // 查询一览列表
    *fetchContractList({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchMaterialPricing',
          payload: search,
        });
      } else {
        const s = yield select(state => state.materialPricing.searchMaterialPricing);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationMaterialPricing',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.materialPricing.paginationMaterialPricing);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractMaterialPricingService.queryMaterialPricingPage, params);
      yield [
        put({
          type: 'saveMaterialPricingList',
          payload: response,
        }),
      ];
    },
    // 对余额处理方式进行保存
    *saveFinishquotingData({ payload }, { put }) {
      // yield put({
      //   type: 'saveFormFinishquotingDataMaterialPricing',
      //   payload: payload,
      // });
      yield put({
        type: 'contractMaterialPricing/changeFormVisibleFinishquoting',
        payload: payload.visible,
      });
    },
    // 查询厂房单条数据
    *fetchFormMaterialPricing({ payload }, { call, put }) {
      const response = yield call(contractMaterialPricingService.getMaterialPricingOne, payload);
      yield put({
        type: 'saveFormDataMaterialPricing',
        payload: response,
      });
    },

    *loadMaterialPricingForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleMaterialPricing',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeMaterialPricing',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleMaterialPricing',
          payload: '新增材料批价',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveformDataMaterialPricing',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleMaterialPricing',
            payload: '编辑材料批价',
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
            type: 'saveFormTitleMaterialPricing',
            payload: '查看材料批价详情',
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
      const response = yield call(contractMaterialPricingService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitMaterialPricing({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeMaterialPricing = yield select(
        state => state.materialPricing.formTypeMaterialPricing
      );
      const proid = payload.project_id;
      let response;
      if (formTypeMaterialPricing === 'E') {
        params.record_id = yield select(state => state.materialPricing.formIDMaterialPricing);
        response = yield call(contractMaterialPricingService.updateMaterialPricing, params);
      } else {
        response = yield call(contractMaterialPricingService.createMaterialPricing, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleMaterialPricing',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchMaterialPricing',
          search: { project_id: proid },
        });
      }
    },

    // 删除厂房
    *delMaterialPricing({ payload }, { call, put }) {
      const response = yield call(contractMaterialPricingService.delMaterialPricing, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchMaterialPricing' });
      }
    },

    // 合同生效
    *EntryContract({ payload }, { call, put }) {
      const response = yield call(contractMaterialPricingService.delMaterialPricing, payload);
      if (response.status === 'OK') {
        message.success('生效成功');
        yield put({ type: 'fetchContractList' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveMaterialPricingList(state, { payload }) {
      return { ...state, dataMaterialPricing: payload };
    },
    saveSearchMaterialPricing(state, { payload }) {
      return { ...state, searchMaterialPricing: payload };
    },
    savePaginationMaterialPricing(state, { payload }) {
      return { ...state, paginationMaterialPricing: payload };
    },
    changeFormVisibleMaterialPricing(state, { payload }) {
      return { ...state, formVisibleMaterialPricing: payload };
    },
    saveFormTitleMaterialPricing(state, { payload }) {
      return { ...state, formTitleMaterialPricing: payload };
    },
    saveFormTypeMaterialPricing(state, { payload }) {
      return { ...state, formTypeMaterialPricing: payload };
    },
    saveFormIDMaterialPricing(state, { payload }) {
      return { ...state, formIDMaterialPricing: payload };
    },
    saveFormDataMaterialPricing(state, { payload }) {
      return { ...state, formDataMaterialPricing: payload };
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
    saveFormFinishquotingDataMaterialPricing(state, { payload }) {
      return { ...state, FinishquotingData: payload };
    },
    // 结算弹出框是否可见
    changeFormVisibleSettlement(state, { payload }) {
      return { ...state, formVisibleSettlement: payload };
    },
    //保存树结构
    saveTreeData(state, { payload }) {
      return { ...state, treeData: payload };
    },
    //
    saveExpandedKeys(state, { payload }) {
      return { ...state, expandedKeys: payload };
    },
    // 生效弹出框是否可见
    changeFormVisibleTakeEffect(state, { payload }) {
      return { ...state, formVisibleTakeEffect: payload };
    },
    // 签证确认
    changeFormVisibleVisaSure(state, { payload }) {
      return { ...state, formVisibleVisaSure: payload };
    },
    // 项目阶段
    saveReasonList(state, { payload }) {
      return { ...state, materialPricingList: payload };
    },
  },
};
