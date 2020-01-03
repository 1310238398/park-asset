import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractVisaChangeService from '@/services/contractVisaChange';
import * as contractSigingService from '@/services/contractSiging';
import * as contractDesignChangeService from '@/services/contractDesignChange';

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
    visaChangeList: [],
    porjectList: [],
    // 原合同名称
    treeOriginConData: [],
    // 设计变更名称
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
    // 查询签证变更列表
    *fetchVisaChange({ payload }, { call, put, select }) {
      let params;
      let search = payload.search;
      let pagination = payload.pagination;
      let proID = payload.proID;
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
      const response = yield call(contractVisaChangeService.queryVisaChangePage, params, proID);
      yield [
        put({
          type: 'saveDataVisaChange',
          payload: response,
        }),
      ];
    },

    // 获取变更原因的数据
    *fetchChangeReason({ payload }, { call, put }) {
      let params = {
        q: 'tree',
        parent_code: 'contract$#VisaReason',
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractVisaChangeService.queryChangeReason, params);
      const list = response.list || [];
      const arr = [];
      list.forEach(el => {
        arr.push({
          label: el.name,
          value: el.code,
        });
      });
      yield put({
        type: 'saveVisaChangeList',
        payload: arr,
      });
    },

    // 项目阶段
    *fetchChangeProject({ payload }, { call, put }) {
      let params = {
        q: 'tree',
        parent_code: 'contract$#ProjectStage',
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractVisaChangeService.queryChangeReason, params);
      const list = response.list || [];
      const arr = [];
      list.forEach(el => {
        arr.push({
          label: el.name,
          value: el.code,
        });
      });
      yield put({
        type: 'savePorjectList',
        payload: arr,
      });
    },

    // 查签证变更单条数据
    *fetchFormVisaChange({ payload }, { call, put }) {
      const response = yield call(contractVisaChangeService.getVisaChangeOne, payload);
      // 变更原因
      if (response.reason) {
        const arrReason = response.reason.split(',');
        response.reason = arrReason;
      }
      if (response.project_stage) {
        const arrStage = response.project_stage.split(',');
        response.project_stage = arrStage;
      }
      // 对附件进行处理
      if (response.attas && response.attas.length > 0) {
        const attas = [];

        response.attas.forEach(el => {
          let name;
          let sName = el.URL.split('/');
          if (el.Name) {
            name = el.Name;
          } else {
            name = sName[sName.length - 1];
          }
          attas.push({
            name: name,
            url: el.URL,
            uid: el.BizID,
          });
        });
        response.attas = attas;
      }
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
      }
      yield put({
        type: 'fetchOriginConTree',
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
          type: 'saveFormIDVisaChange',
          payload: '',
        }),
        put({
          type: 'saveFormDataVisaChange',
          payload: {},
        }),
        // 变化原因
        put({
          type: 'fetchChangeReason',
          payload: {},
        }),
        // 项目阶段
        put({
          type: 'fetchChangeProject',
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
            type: 'saveFormIDVisaChange',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormVisaChange',
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
            type: 'saveFormIDVisaChange',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormVisaChange',
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

    // 保存
    *submitVisaChange({ payload }, { call, put, select }) {
      const proID = yield select(state => state.visaChange.proID);
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
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },
    // 保存
    *submitSureVisaChange({ payload }, { call, put }) {
      const params = payload.data;
      delete params.record_id;
      const id = payload.id;
      const proID = payload.data.project_id;
      let response;
      response = yield call(contractVisaChangeService.commitSureChange, params, id);
      if (response.status === 'OK') {
        message.success('签证确认成功');
        yield put({
          type: 'changeFormVisibleVisaSure',
          payload: false,
        });
        // TODO 查签证变更列表
        yield put({
          type: 'fetchVisaChange',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },

    // 删除签证变更
    *delVisaChange({ payload }, { call, put, select }) {
      const proID = yield select(state => state.visaChange.proID);
      const response = yield call(contractVisaChangeService.delVisaChange, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({
          type: 'fetchVisaChange',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },

    // 提交审核合同
    *commitVisaChangeForm({ payload }, { call, put, select }) {
      const proID = yield select(state => state.visaChange.proID);
      const response = yield call(contractVisaChangeService.commitVisaChange, payload);
      if (response.status === 'OK') {
        message.success('提交审核成功');
        yield put({
          type: 'fetchVisaChange',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },
    // 原合同名列表
    *fetchOriginConTree({ payload }, { call, put, select }) {
      const proID = yield select(state => state.designChange.proID);
      let params = {
        q: 'page',
        current: 1,
        state: 2,
        pageSize: 50,
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSigingService.querySigingPage, params, proID);
      const list = response.list || [];
      yield put({
        type: 'saveOriTreeData',
        payload: list,
      });
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
  },
  reducers: {
    // 楼层数据
    saveDataVisaChange(state, { payload }) {
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
    // 签证确认quer
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
    //保存原合同
    saveOriTreeData(state, { payload }) {
      return { ...state, treeOriginConData: payload };
    },
    // 保存设计变更
    saveDesignTreeData(state, { payload }) {
      return { ...state, designTreeData: payload };
    },
  },
};
