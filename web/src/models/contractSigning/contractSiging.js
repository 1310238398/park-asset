import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as contractSigingService from '@/services/contractSiging';
import { isObjectNullOrUndefinedOrEmpty } from '@/utils/utils';
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
    saveSearchConSiging: {},
    paginationConSiging: {},
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
    // 数据
    formDataSiging: {},
    formTitleSiging: '',
    formIDSiging: '',
    // 合同结算页面是否可见
    formVisibleSettlement: false,
    // 合同结算页面数据
    formDataSettlement: {},
    // 合同生效页面数据
    formDataTakeEffect: {},
    // 选择乙方单位树形结构
    treeData: [],
    expandedKeys: [],
    // 合约生效界面是否可见
    formVisibleTakeEffect: false,
    dataOptions: [],
    // 合约规划相关
    searchSupplement: {},
    paginationSupplement: {},
    // 合同一览列表数据
    dataSupplement: {
      list: [],
      pagination: {},
    },
    // 新增还是编辑类型
    formTypeSupplement: '',
    // 新增框是否可见
    formVisibleSupplement: false,
    // 数据
    formDataSupplement: {},
    formTitleSupplement: '',
    formIDSupplement: '',
    // 原合同名称
    treeOriginConData: [],
    // 合约规划的名字
    planName: '',
    //合同生效时所需的字段
    loadTakeEffectData: {},
    // 合同结算
    searchSettlement: {},
    paginationSettlement: {},
    // 设计变更
    desiginData: {},
    //合约规划数组
    hyArr: [],
    selectPlanName: '',
    hyList: [],
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
    // 选择合约规划列表
    *fetchOptionsTree({ payload }, { call, put }) {
      let params = {
        q: 'contract',
        project_id: payload,
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(contractSigingService.contractPlanList, params);
      const list = response.list || [];
      yield put({
        type: 'saveOptinsData',
        payload: list,
      });
    },

    // 查询合同草稿的列表
    *fetchSiging({ payload }, { call, put, select }) {
      let params = {
        state: 1,
      };
      const proID = payload.proID;
      let search = payload.search;
      let pagination = payload.pagination;

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
      const response = yield call(contractSigingService.querySigingPage, params, proID);
      yield [
        put({
          type: 'saveSigingList',
          payload: response,
        }),
      ];
    },

    // 查询一览列表
    *fetchContractList({ payload }, { call, put, select }) {
      let params = {
        state: 2,
      };
      const proID = payload.proID;
      let search = payload.search;
      let pagination = payload.pagination;
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
      const response = yield call(contractSigingService.querySigingPage, params, proID);
      yield [
        put({
          type: 'saveSigingConList',
          payload: response,
        }),
      ];
    },

    // 查询单条合同信息的操作
    *fetchFormSiging({ payload }, { call, put }) {
      const response = yield call(contractSigingService.getSigingOne, payload);
      console.log(response);
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
      const proId = response.project_id;
      console.log(proId);
      let para = {
        q: 'contract',
        project_id: proId,
      };
      const pdata = yield call(contractSigingService.contractPlanList, para);
      console.log('第170行');
      console.log(pdata);
      if (response.contract_planning_id) {
        const plann = response.contract_planning_id.split('/');
        let params = {
          q: 'list',
          project_id: proId,
          cost_id: plann[plann.length - 1],
        };
        const result = yield call(contractSigingService.contractCList, params);
        const list = result.list || [];
        console.log('第181行');
        console.log(list);
        if (list.length > 0) {
          yield put({
            type: 'savePlanName',
            payload: list[0].cost_name_path + '/' + list[0].name,
          });
        } else {
          yield put({
            type: 'savePlanName',
            payload: '',
          });
        }
      }

      yield put({
        type: 'saveFormDataSiging',
        payload: response,
      });
    },
    // 获取合同的信息
    *fetchDesiginOne({ payload }, { call, put }) {
      console.log(payload);
      if (payload.project_id) {
        let proID = payload.project_id;
        let para = {
          q: 'contract',
          project_id: proID,
        };
        const pdata = yield call(contractSigingService.contractPlanList, para);
        console.log('第170行');
        console.log(pdata);
        if (payload.contract_planning_id) {
          const plann = payload.contract_planning_id.split('/');
          console.log(plann);
          let params = {
            q: 'list',
            project_id: proID,
            cost_id: plann[plann.length - 1],
          };
          const result = yield call(contractSigingService.contractCList, params);
          console.log(result);
          const list = result.list || [];
          console.log(list)
          if (list.length > 0) {
            yield put({
              type: 'savePlanName',
              payload: list[0].cost_name_path + '/' + list[0].name,
            });
            yield put({
              type: 'saveSelectPlanName',
              payload: list[0].cost_name_path,
            });
            yield put({
              type: 'saveSelectHy',
              payload: list[0],
            });
          } else {
            yield put({
              type: 'savePlanName',
              payload: '',
            });
            yield put({
              type: 'saveSelectPlanName',
              payload: '',
            });
            yield put({
              type: 'saveSelectHy',
              payload: {},
            });
          }
        }
      }
    },
    // 通过合同id查询设计变更
    *fetchDesiginOneSiging({ payload }, { call, put }) {
      const response0 = yield call(contractSigingService.getDesignOne, payload);
      const response1 = yield call(contractSigingService.getVisaOne, payload);
      const response2 = yield call(contractSigingService.getMaterialOne, payload);
      const response3 = yield call(contractSigingService.querySettlementPageOne, payload);
      const response = [];
      response.push({
        designData: response0,
        visaData: response1,
        materialData: response2,
        settlementData: response3,
      });
      yield put({
        type: 'saveDesignDataSiging',
        payload: response,
      });
    },

    // 判断新增合同还是编辑
    *loadSigingForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleSiging',
        payload: true,
      });

      if (payload.proID) {
        // 保存proId
        yield [
          put({
            type: 'saveProjectID',
            payload: payload.proID,
          }),
          // put({
          //   type: 'fetchOptionsTree',
          //   payload: payload.proID,
          // }),
        ];
      }
      yield [
        put({
          type: 'saveFormTypeSiging',
          payload: payload.type,
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

    // 弹出界面渲染数据
    *loadSupplementForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleSupplement',
        payload: true,
      });
      if (payload.proID) {
        // 保存proId
        yield [
          put({
            type: 'saveProjectID',
            payload: payload.proID,
          }),
          // put({
          //   type: 'fetchOptionsTree',
          //   payload: payload.proID,
          // }),
        ];
      }
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
          type: 'saveFormIDSupplement',
          payload: '',
        }),

        put({
          type: 'fetchOriginConTree',
        }),
        put({
          type: 'saveFormDataSupplement',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleSupplement',
            payload: '编辑补充合同',
          }),
          put({
            type: 'saveFormIDSupplement',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSupplement',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleSupplement',
            payload: '查看补充合同详情',
          }),
          put({
            type: 'saveFormIDSupplement',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSupplement',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询单个补充合同的详情
    *fetchFormSupplement({ payload }, { call, put }) {
      const response = yield call(contractSigingService.getSigingOne, payload);
      console.log(response)
      if(response.contract_planning_id){
        yield  put({
          type: 'savePlanName',
          payload: response.contract_planning_id,
        })
        yield  put({
          type: 'fetchDesiginOne',
          payload: response,
        })
        
      };
      yield put({
        type: 'saveFormDataSupplement',
        payload: response,
      });
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
      const data = payload.data;

      const params = { ...data };
      const formTypeSiging = yield select(state => state.contractSiging.formTypeSiging);
      const formTypeSupplement = yield select(state => state.contractSiging.formTypeSupplement);
      let response;
      if (formTypeSiging === 'E') {
        params.record_id = yield select(state => state.contractSiging.formIDSiging);
        response = yield call(contractSigingService.updateSiging, params);
      } else if (formTypeSupplement === 'E') {
        params.record_id = yield select(state => state.contractSiging.formIDSupplement);
        response = yield call(contractSigingService.updateSiging, params);
      } else {
        response = yield call(contractSigingService.createSiging, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        if ((payload.type = 'siging')) {
          yield put({
            type: 'changeFormVisibleSiging',
            payload: false,
          });
        }
        if ((payload.type = 'supple')) {
          yield put({
            type: 'changeFormVisibleSupplement',
            payload: false,
          });
        }

        // TODO 合同草稿列表
        yield put({
          type: 'fetchSiging',
          payload: {
            search: {},
            pagination: {},
            proID: data.project_id,
          },
        });
      }
    },

    // 保存合同结算
    *settlementSave({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      let params = {
        record_id: payload.record_id,
        data: payload.data,
      };
      let response;
      if (payload.data && payload.data.record_id) {
        response = yield call(contractSigingService.saveEditSettlement, params);
      } else {
        response = yield call(contractSigingService.saveSettlement, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('结算保存成功');
        yield put({
          type: 'saveFormDataSettlement',
          payload: {},
        });
      }
      // TODO 合同草稿列表
      yield put({
        type: 'fetchSettlemet',
        record_id: payload.record_id,
      });
    },
    // 查询合同结算的列表
    *fetchSettlemet({ search, pagination, record_id }, { call, put, select }) {
      let para = {
        record_id,
        params: '',
      };
      if (search) {
        para.params = { ...para.params, ...search };
        yield put({
          type: 'saveSearchSettlement',
          payload: search,
        });
      } else {
        const s = yield select(state => state.contractSiging.searchSettlement);
        if (s) {
          para.params = { ...para.params, ...s };
        }
      }

      if (pagination) {
        para.params = { ...para.params, ...pagination };
        yield put({
          type: 'savePaginationSettlement',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.contractSiging.paginationSettlement);
        if (p) {
          para.params = { ...para.params, ...p };
        }
      }
      const response = yield call(contractSigingService.querySettlementPage, para);
      yield [
        put({
          type: 'saveSettlement',
          payload: response,
        }),
      ];
    },

    // 提交审核合同
    *commitSigingForm({ payload }, { call, put, select }) {
      const proID = yield select(state => state.contractSiging.proID);
      const response = yield call(contractSigingService.commitSiging, payload);

      if (response.status === 'OK') {
        message.success('提交审核成功');
        yield put({
          type: 'fetchSiging',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },

    // 删除合同
    *delSiging({ payload }, { call, put, select }) {
      const proID = yield select(state => state.contractSiging.proID);
      const response = yield call(contractSigingService.delSiging, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({
          type: 'fetchSiging',
          payload: {
            search: {},
            pagination: {},
            proID: proID,
          },
        });
      }
    },

    // 删除结算信息
    *delSettlement({ payload }, { call, put }) {
      const response = yield call(contractSigingService.delSettlement, payload.record_id);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchSettlemet', record_id: payload.comcontract_id });
      }
    },
    // 合同生效
    *EntryContract({ payload }, { call, put }) {
      delete payload.data.record_id;
      const response = yield call(contractSigingService.entrySiging, payload);
      if (response.status === 'OK') {
        message.success('生效成功');
        yield put({ type: 'fetchContractList' });
        yield put({
          type: 'changeFormVisibleTakeEffect',
          payload: false,
        });
      }
    },

    // 查询单个结算信息的详情
    *fetchFormSettlement({ payload }, { call, put }) {
      const response = yield call(contractSigingService.getSettlementOne, payload);
      yield put({
        type: 'saveFormDataSettlement',
        payload: response,
      });
    },

    // 获取项目列表
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
      const list = response.list || [];
      yield put({
        type: 'saveOriTreeData',
        payload: list,
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
    // 补充合同相关
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
    //保存原合同
    saveOriTreeData(state, { payload }) {
      return { ...state, treeOriginConData: payload };
    },
    //保存选择的合约规划的名字
    savePlanName(state, { payload }) {
      return { ...state, planName: payload };
    },
    saveSelectPlanName(state, { payload }) {
      return { ...state, selectPlanName: payload };
    },
    saveSelectHy(state, { payload }) {
      return { ...state, hyList: payload };
    },
    // 保存合同信息
    saveLoadTakeEffect(state, { payload }) {
      return { ...state, loadTakeEffectData: payload };
    },
    // 合同结算
    saveSearchSettlemente(state, { payload }) {
      return { ...state, searchSettlement: payload };
    },
    savePaginationSettlement(state, { payload }) {
      return { ...state, paginationSettlement: payload };
    },
    saveSettlement(state, { payload }) {
      return { ...state, dataSupplement: payload };
    },
    saveFormDataSettlement(state, { payload }) {
      return { ...state, formDataSettlement: payload };
    },
    // 通过合同id 查询设计变更
    saveDesignDataSiging(state, { payload }) {
      return { ...state, desiginData: payload };
    },
    // 保存合约规划数组
    saveHyArr(state, { payload }) {
      return { ...state, hyArr: payload };
    },
  },
};
