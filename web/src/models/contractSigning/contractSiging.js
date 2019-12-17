import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractSigingService from '@/services/contractSiging';

export default {
  namespace: 'contractSiging',
  state: {
    // 合同草稿
    searchSiging: {},
    paginationSiging: {},
    dataSiging: {
      list: [],
      pagination: {},
    },
    // 合同一览
    saveSearchConSiging:{},
    paginationConSiging:{},
    // 合同一览列表
    dataConSiging: {
      list: [],
      pagination: {},
    },
    proData: {},
    proID: '', // 当前选中的项目ID
    // 项目的列表
    projectTreeData: [],
    // 新增还是编辑类型
    formTypeSiging: '',
    // 新增框是否可见
    formVisibleSiging: false,
    // 合约规划弹框是否可见
    formVisiblePlanning: false,
    // 数据
    formDataSiging: {},
    formTitleSiging: '',
    formIDSiging: '',
    // 合约规划是否引用完余额是否可见
    formVisibleFinishquoting: false,
    FinishquotingData:{},
    // 合同结算页面是否可见
    formVisibleSettlement: false,
    // 合同结算页面数据
    formDataSettlement:{},
    // 选择乙方单位树形结构
    treeData: [],
    expandedKeys: [],
    // 合约生效界面是否可见
    formVisibleTakeEffect: false,
    dataOptions:[]
  },
  effects: {

    // 甲乙单位树状结构
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.contractSiging.treeData);
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
        pageSize : 50
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSigingService.query, params);
      console.log(response)
      const list = response.list || [];
      yield put({
        type: 'saveTreeData',
        payload: list,
      });
    },
    // 选择合约规划列表
    *fetchOptionsTree({ payload }, { call, put }) {
      console.log(payload)
      let params = {
        q: 'contract',
        project_id:payload
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSigingService.contractPlanList, params);
      console.log(response)
      const list = response.list || [];
      yield put({
        type: 'saveOptinsData',
        payload: list,
      });
    },
    // 查询合同草稿的列表
    *fetchSiging({ search, pagination }, { call, put, select }) {
      let params = {
        state: 1
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchSiging',
          payload: search,
        });
      } else {
        const s = yield select(state => state.contractSiging.searchSiging);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationSiging',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.contractSiging.paginationSiging);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractSigingService.querySigingPage, params);
      yield [
        put({
          type: 'saveSigingList',
          payload: response,
        }),
      ];
    },

    // 查询一览列表
    *fetchContractList({ search, pagination }, { call, put, select }) {
      let params = {
        state:2
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchConSiging',
          payload: search,
        });
      } else {
        const s = yield select(state => state.contractSiging.searchConSiging);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationConSiging',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.contractSiging.paginationConSiging);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractSigingService.querySigingPage, params);
      yield [
        put({
          type: 'saveSigingConList',
          payload: response,
        }),
      ];
    },
    // 对余额处理方式进行保存
    *saveFinishquotingData({ payload }, { put }) {
      // yield put({
      //   type: 'saveFormFinishquotingDataSiging',
      //   payload: payload,
      // });
      yield put({
        type: 'contractSiging/changeFormVisibleFinishquoting',
        payload: payload.visible,
      });
    },

    // 查询单条合同信息的操作
    *fetchFormSiging({ payload }, { call, put }) {
      const response = yield call(contractSigingService.getSigingOne, payload);
      yield put({
        type: 'saveFormDataSiging',
        payload: response,
      });
    },

    // 判断新增合同还是编辑
    *loadSigingForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleSiging',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeSiging',
          payload: payload.type,
        }),
        put({
          type: 'saveProjectID',
          payload: payload.proID,
        }),
        put({
          type: 'fetchOptionsTree',
          payload: payload.proID,
        }),
        put({
          type: 'saveFormTitleSiging',
          payload: '新增合同',
        }),
        put({
          type: 'saveFormIDSiging',
          payload: '',
        }),
        put({
          type: 'saveFormDataSiging',
          payload: {},
        }),
      ];
      console.log(payload)
      
      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleSiging',
            payload: '编辑合同',
          }),
          put({
            type: 'saveFormIDSiging',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSiging',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleSiging',
            payload: '查看合同详情',
          }),
          put({
            type: 'saveFormIDSiging',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSiging',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(contractSigingService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    // 保存表单
    *submitSiging({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeSiging = yield select(state => state.contractSiging.formTypeSiging);
      console.log(formTypeSiging)
      const proid = payload.project_id;
      let response;
      if (formTypeSiging === 'E') {
        console.log(params)

        params.record_id = yield select(state => state.contractSiging.formIDSiging);
        console.log(params)
        response = yield call(contractSigingService.updateSiging, params);
      } else {
        console.log(111)
        response = yield call(contractSigingService.createSiging, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleSiging',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchSiging',
          search: { project_id: proid },
        });
      }
    },
    // 提交审核合同
    *commitSigingForm({ payload }, { call, put }) {
      const response = yield call(contractSigingService.commitSiging, payload);
      if (response.status === 'OK') {
        message.success('提交审核成功');
        yield put({ type: 'fetchSiging' });
      }
    },

    // 删除合同
    *delSiging({ payload }, { call, put }) {
      const response = yield call(contractSigingService.delSiging, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchSiging' });
      }
    },

     // 合同生效
     *EntryContract({ payload }, { call, put }) {
       
      const response = yield call(contractSigingService.entrySiging, payload);
      if (response.status === 'OK') {
        message.success('生效成功');
        yield put({ type: 'fetchContractList' });
      }
    },

    *queryProTree({ payload }, { put, call }) {
      const params = {
        q: 'nodes',
      };
      const response = yield call(contractSigingService.queryProTree, params);
      const result = response.list ? response.list : [];
     
      yield put({
        type: 'saveProjectTreeData',
        payload: result,
      });
    
    },
  },
  reducers: {
    // 合同草稿
    saveSigingList(state, { payload }) {
      return { ...state, dataSiging: payload };
    },
    saveSearchSiging(state, { payload }) {
      return { ...state, searchSiging: payload };
    },
    savePaginationSiging(state, { payload }) {
      return { ...state, paginationSiging: payload };
    },
    //合同一览
    saveSearchConSiging(state, { payload }) {
      return { ...state, searchConSiging: payload };
    },
    savePaginationConSiging(state, { payload }) {
      return { ...state, paginationConSiging: payload };
    },
    saveSigingConList(state, { payload }) {
      return { ...state, dataConSiging: payload };
    },
  
    changeFormVisibleSiging(state, { payload }) {
      return { ...state, formVisibleSiging: payload };
    },
    saveFormTitleSiging(state, { payload }) {
      return { ...state, formTitleSiging: payload };
    },
    saveFormTypeSiging(state, { payload }) {
      return { ...state, formTypeSiging: payload };
    },
    saveFormIDSiging(state, { payload }) {
      return { ...state, formIDSiging: payload };
    },
    saveFormDataSiging(state, { payload }) {
      return { ...state, formDataSiging: payload };
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
    saveProjectTreeData(state, { payload }) {
      return { ...state, projectTreeData: payload };
    },
    //保存合约规划的
    saveOptinsData(state, { payload }) {
      return { ...state, dataOptions: payload };
    },
  },
};
