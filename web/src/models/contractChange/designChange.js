import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractDesignChangeService from '@/services/contractDesignChange';

export default {
  namespace: 'designChange',
  state: {
    searchDesignChange: {},
    paginationDesignChange: {},
    // 列表数据
    dataDesignChange: {
      list: [],
      pagination: {},
    },
    proData: {},
    
    proID: '', // 当前选中的项目ID
    projectTreeData: [],
    // 新增还是编辑类型
    formTypeDesignChange: '',
    // 新增框是否可见
    formVisibleDesignChange: false,
    // 合约规划弹框是否可见
    formVisiblePlanning: false,
    // 数据
    formDataDesignChange: {},
    formTitleDesignChange: '',
    formIDDesignChange: '',
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
    changeList:[]
  },
  effects: {
    // 查询树状结构
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.designChange.treeData);
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
      const response = yield call(contractDesignChangeService.query, params);
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
        parent_code:'contract$#ChangeReason'
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractDesignChangeService.queryChangeReason, params);
      const list = response.list || [];
      const arr =[];
      list.forEach(el => {
        arr.push({
          label:el.name,
          value:el.code
        })
      });
      yield put({
        type: 'saveChangeList',
        payload: arr,
      });
    },
    
    // 查询厂房列表
    *fetchDesignChange({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchDesignChange',
          payload: search,
        });
      } else {
        const s = yield select(state => state.designChange.searchDesignChange);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationDesignChange',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.designChange.paginationDesignChange);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractDesignChangeService.queryDesignChangePage, params);
      yield [
        put({
          type: 'saveDesignChangeList',
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
          type: 'saveSearchDesignChange',
          payload: search,
        });
      } else {
        const s = yield select(state => state.designChange.searchDesignChange);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationDesignChange',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.designChange.paginationDesignChange);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractDesignChangeService.queryDesignChangePage, params);
      yield [
        put({
          type: 'saveDesignChangeList',
          payload: response,
        }),
      ];
    },
    // 对余额处理方式进行保存
    *saveFinishquotingData({ payload }, { put }) {
      // yield put({
      //   type: 'saveFormFinishquotingDataDesignChange',
      //   payload: payload,
      // });
      yield put({
        type: 'contractDesignChange/changeFormVisibleFinishquoting',
        payload: payload.visible,
      });
    },
    // 查询厂房单条数据
    *fetchFormDesignChange({ payload }, { call, put }) {
      const response = yield call(contractDesignChangeService.getDesignChangeOne, payload);
      yield put({
        type: 'saveFormDataDesignChange',
        payload: response,
      });
    },

    *loadDesignChangeForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleDesignChange',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeDesignChange',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleDesignChange',
          payload: '新增设计变更',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveformDataDesignChange',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleDesignChange',
            payload: '编辑设计变更',
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
            type: 'saveFormTitleDesignChange',
            payload: '查看设计变更详情',
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
      const response = yield call(contractDesignChangeService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitDesignChange({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeDesignChange = yield select(state => state.designChange.formTypeDesignChange);
      const proid = payload.project_id;
      let response;
      if (formTypeDesignChange === 'E') {
        params.record_id = yield select(state => state.designChange.formIDDesignChange);
        response = yield call(contractDesignChangeService.updateDesignChange, params);
      } else {
        response = yield call(contractDesignChangeService.createDesignChange, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleDesignChange',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchDesignChange',
          search: { project_id: proid },
        });
      }
    },

    // 删除厂房
    *delDesignChange({ payload }, { call, put }) {
      const response = yield call(contractDesignChangeService.delDesignChange, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchDesignChange' });
      }
    },

     // 合同生效
     *EntryContract({ payload }, { call, put }) {
       
      const response = yield call(contractDesignChangeService.delDesignChange, payload);
      if (response.status === 'OK') {
        message.success('生效成功');
        yield put({ type: 'fetchContractList' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveDesignChangeList(state, { payload }) {
      return { ...state, dataDesignChange: payload };
    },
    saveSearchDesignChange(state, { payload }) {
      return { ...state, searchDesignChange: payload };
    },
    savePaginationDesignChange(state, { payload }) {
      return { ...state, paginationDesignChange: payload };
    },
    changeFormVisibleDesignChange(state, { payload }) {
      return { ...state, formVisibleDesignChange: payload };
    },
    saveFormTitleDesignChange(state, { payload }) {
      return { ...state, formTitleDesignChange: payload };
    },
    saveFormTypeDesignChange(state, { payload }) {
      return { ...state, formTypeDesignChange: payload };
    },
    saveFormIDDesignChange(state, { payload }) {
      return { ...state, formIDDesignChange: payload };
    },
    saveFormDataDesignChange(state, { payload }) {
      return { ...state, formDataDesignChange: payload };
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
    saveFormFinishquotingDataDesignChange(state, { payload }) {
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

    // 变更原因列表
    saveChangeList(state, { payload }) {
      return { ...state, changeList: payload };
    },
  },
};
