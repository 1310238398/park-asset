import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractVisaChangeService from '@/services/contractVisaChange';

export default {
  namespace: 'visaChange',
  state: {
    searchVisaChange: {},
    paginationVisaChange: {},
    // 列表数据
    dataVisaChange: {
      list: [],
      pagination: {},
    },
    proData: {},
    
    proID: '', // 当前选中的项目ID
    projectTreeData: [],
    // 新增还是编辑类型
    formTypeVisaChange: '',
    // 新增框是否可见
    formVisibleVisaChange: false,
    // 合约规划弹框是否可见
    formVisiblePlanning: false,
    // 数据
    formDataVisaChange: {},
    formTitleVisaChange: '',
    formIDVisaChange: '',
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
    // 签证确认界面弹出框
    formVisibleVisaSure:false,
    visaChangeList:[],
    porjectList:[]
  },
  effects: {
    // 查询树状结构
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.visaChange.treeData);
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
      const response = yield call(contractVisaChangeService.query, params);
      const list = response.list || [];
      yield put({
        type: 'saveTreeData',
        payload: list,
      });
    },
    // 查询厂房列表
    *fetchVisaChange({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchVisaChange',
          payload: search,
        });
      } else {
        const s = yield select(state => state.visaChange.searchVisaChange);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationVisaChange',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.visaChange.paginationVisaChange);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractVisaChangeService.queryVisaChangePage, params);
      yield [
        put({
          type: 'saveVisaChangeList',
          payload: response,
        }),
      ];
    },

   // 获取变更原因的数据
   *fetchChangeReason({ payload }, { call, put }) {
    console.log(payload)
    let params = {
      q: 'tree',
      parent_code:'contract$#VisaReason'
    };
    if (payload) {
      params = { ...params, ...payload };
    }
    const response = yield call(contractVisaChangeService.queryChangeReason, params);
    const list = response.list || [];
    const arr =[];
    list.forEach(el => {
      arr.push({
        label:el.name,
        value:el.code
      })
    });
    yield put({
      type: 'saveVisaChangeList',
      payload: arr,
    });
  },

  *fetchChangeProject({ payload }, { call, put }) {
    console.log(payload)
    let params = {
      q: 'tree',
      parent_code:'contract$#ProjectStage'
    };
    if (payload) {
      params = { ...params, ...payload };
    }
    const response = yield call(contractVisaChangeService.queryChangeReason, params);
    const list = response.list || [];
    const arr =[];
    list.forEach(el => {
      arr.push({
        label:el.name,
        value:el.code
      })
    });
    yield put({
      type: 'savePorjectList',
      payload: arr,
    });
  },
  

    // 查询一览列表
    *fetchContractList({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchVisaChange',
          payload: search,
        });
      } else {
        const s = yield select(state => state.visaChange.searchVisaChange);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationVisaChange',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.visaChange.paginationVisaChange);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(contractVisaChangeService.queryVisaChangePage, params);
      yield [
        put({
          type: 'saveVisaChangeList',
          payload: response,
        }),
      ];
    },
    // 对余额处理方式进行保存
    *saveFinishquotingData({ payload }, { put }) {
      // yield put({
      //   type: 'saveFormFinishquotingDataVisaChange',
      //   payload: payload,
      // });
      yield put({
        type: 'contractVisaChange/changeFormVisibleFinishquoting',
        payload: payload.visible,
      });
    },
    // 查询厂房单条数据
    *fetchFormVisaChange({ payload }, { call, put }) {
      const response = yield call(contractVisaChangeService.getVisaChangeOne, payload);
      yield put({
        type: 'saveFormDataVisaChange',
        payload: response,
      });
    },

    *loadVisaChangeForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleVisaChange',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormTypeVisaChange',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleVisaChange',
          payload: '新增签证变更',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveformDataVisaChange',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleVisaChange',
            payload: '编辑签证变更',
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
            type: 'saveFormTitleVisaChange',
            payload: '查看签证变更详情',
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
      const response = yield call(contractVisaChangeService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    *submitVisaChange({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeVisaChange = yield select(state => state.visaChange.formTypeVisaChange);
      const proid = payload.project_id;
      let response;
      if (formTypeVisaChange === 'E') {
        params.record_id = yield select(state => state.visaChange.formIDVisaChange);
        response = yield call(contractVisaChangeService.updateVisaChange, params);
      } else {
        response = yield call(contractVisaChangeService.createVisaChange, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleVisaChange',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchVisaChange',
          search: { project_id: proid },
        });
      }
    },

    // 删除厂房
    *delVisaChange({ payload }, { call, put }) {
      const response = yield call(contractVisaChangeService.delVisaChange, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchVisaChange' });
      }
    },

     // 合同生效
     *EntryContract({ payload }, { call, put }) {
       
      const response = yield call(contractVisaChangeService.delVisaChange, payload);
      if (response.status === 'OK') {
        message.success('生效成功');
        yield put({ type: 'fetchContractList' });
      }
    },
  },
  reducers: {
    // 楼层数据
    saveVisaChangeList(state, { payload }) {
      return { ...state, dataVisaChange: payload };
    },
    saveSearchVisaChange(state, { payload }) {
      return { ...state, searchVisaChange: payload };
    },
    savePaginationVisaChange(state, { payload }) {
      return { ...state, paginationVisaChange: payload };
    },
    changeFormVisibleVisaChange(state, { payload }) {
      return { ...state, formVisibleVisaChange: payload };
    },
    saveFormTitleVisaChange(state, { payload }) {
      return { ...state, formTitleVisaChange: payload };
    },
    saveFormTypeVisaChange(state, { payload }) {
      return { ...state, formTypeVisaChange: payload };
    },
    saveFormIDVisaChange(state, { payload }) {
      return { ...state, formIDVisaChange: payload };
    },
    saveFormDataVisaChange(state, { payload }) {
      return { ...state, formDataVisaChange: payload };
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
    saveFormFinishquotingDataVisaChange(state, { payload }) {
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
    
    // 变更原因列表
    saveVisaChangeList(state, { payload }) {
      return { ...state, visaChangeList: payload };
    },
    // 项目阶段
    savePorjectList(state, { payload }) {
      return { ...state, porjectList: payload };
    },
  },
};
