import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractMaterialPricingService from '@/services/contractMaterialPricing';
import * as contractSigingService from '@/services/contractSiging';
import * as contractDesignChangeService from '@/services/contractDesignChange';
import * as contractVisaChangeService from '@/services/contractVisaChange';

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
    treeOriginConData: [],
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
    // 是否还有并列合同余额是否可见
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
    signTreeData: [],
    designTreeData: [],
  },
  effects: {

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
      const response = yield call(contractSigingService.query, params);
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

    // 原合同名列表
    *fetchOriginConTree({ payload }, { call, put }) {
      let params = {
        q: 'page',
        current: 1,
        pageSize: 50,
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSigingService.querySigingPage, params);
      console.log(response);
      const list = response.list || [];
      yield put({
        type: 'saveOriTreeData',
        payload: list,
      });
    },
    // 提交审核合同
    *commitMaterialPricingForm({ payload }, { call, put, select }) {
      const proID = yield select(state => state.materialPricing.proID);
      console.log(proID)
      const response = yield call(contractMaterialPricingService.commitMaterialPricing, payload);
      if (response.status === 'OK') {
        message.success('提交审核成功');
        yield put({
          type: 'fetchMaterialPricing',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },
    // 设计变更名称
    *fetchDesignConTree({ payload }, { call, put }) {
      let params;
      let search = payload.search;
      let pagination = payload.pagination;
      let proID = payload.proID;
      if (search) {
        params = { ...params, ...search };
      }
      if (pagination) {
        params = { ...params, ...pagination };
      }
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractDesignChangeService.queryDesignChangePage, params, proID);
      const list = response.list || [];
      yield put({
        type: 'saveDesignTreeData',
        payload: list,
      });
    },
    // 签证变更名称
    *fetchSignConTree({ payload }, { call, put }) {
      let params;
      let search = payload.search;
      let pagination = payload.pagination;
      let proID = payload.proID;
      if (search) {
        params = { ...params, ...search };
      }
      if (pagination) {
        params = { ...params, ...pagination };
      }
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractVisaChangeService.queryVisaChangePage, params, proID);
      const list = response.list || [];
      yield put({
        type: 'saveSignTreeData',
        payload: list,
      });
    },
    // 查询材料批价列表
    *fetchMaterialPricing({ payload }, { call, put, select }) {
      console.log(payload);
      let params;
      let search = payload.search;
      let pagination = payload.pagination;
      let proID = payload.proID;
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
      const response = yield call(
        contractMaterialPricingService.queryMaterialPricingPage,
        params,
        proID
      );
      yield [
        put({
          type: 'saveMaterialPricingList',
          payload: response,
        }),
      ];
    },

    // 查询厂房单条数据
    *fetchFormMaterialPricing({ payload }, { call, put, select }) {
      const response = yield call(contractMaterialPricingService.getMaterialPricingOne, payload);
      // 变更原因
      if (response.reason) {
        const arrReason = response.reason.split(',');
        response.reason = arrReason;
      }
      yield put({
        type: 'saveFormDataMaterialPricing',
        payload: response,
      });
    },

    // 查看详情界面
    *loadMaterialPricingForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleMaterialPricing',
        payload: true,
      });
      if (payload.proID) {
        // 保存proId
        yield put({
          type: 'saveProjectID',
          payload: payload.proID,
        });
        yield put({
          type: 'fetchDesignConTree',
          payload: {
            search: {},
            pagination: {},
            proID: payload.proID,
          },
        });
        yield put({
          type: 'fetchSignConTree',
          payload: {
            search: {},
            pagination: {},
            proID: payload.proID,
          },
        });
      }
      yield put({
        type: 'fetchOriginConTree',
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
          type: 'saveFormIDMaterialPricing',
          payload: '',
        }),
        put({
          type: 'saveFormDataMaterialPricing',
          payload: {},
        }),
        put({
          type: 'fetchChangeReason',
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
            type: 'saveFormIDMaterialPricing',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormMaterialPricing',
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
            type: 'saveFormIDMaterialPricing',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormMaterialPricing',
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

    // 保存
    *submitMaterialPricing({ payload }, { call, put, select }) {
      const proID = yield select(state => state.materialPricing.proID);
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeMaterialPricing = yield select(
        state => state.materialPricing.formTypeMaterialPricing
      );
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
        console.log(proID);
        // TODO 查询门牌列表
        yield put({
          type: 'fetchMaterialPricing',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },

    // 删除厂房
    *delMaterialPricing({ payload }, { call, put, select }) {
      const proID = yield select(state => state.materialPricing.proID);
      console.log(payload);
      console.log(proID);
      const response = yield call(contractMaterialPricingService.delMaterialPricing, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({
          type: 'fetchMaterialPricing',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
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
    //批价原因
    saveReasonList(state, { payload }) {
      return { ...state, materialPricingList: payload };
    },
    //保存原合同
    saveOriTreeData(state, { payload }) {
      return { ...state, treeOriginConData: payload };
    },
    // 保存设计变更
    saveDesignTreeData(state, { payload }) {
      return { ...state, designTreeData: payload };
    },
    // 保存签证变更
    saveSignTreeData(state, { payload }) {
      return { ...state, signTreeData: payload };
    },
  },
};
