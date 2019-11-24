import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 成本核算:销售计划
export default {
  namespace: 'salesPlan',
  state: {
    search: {},
    pagination: {},
    // 销售计划列表
    data: [], //所有年份所有季度的
     
    displayList:[],// 需要根据用户的筛选条件，自己重构数据值
    submitting: false,
    formTitle: '',
    formID: '',
   
    addSalesPlanVisible: false,
    //formData: {},
  
  },
  // 调service  call 调service函数 put 调reducer函数 select 暂存
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

      const response = yield call(costAccountService.querySalesPlan, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put }) {
      if (payload.type === 'addSalesPlan') {

        console.log("新增销售计划页面");
        yield put({
          type: 'changeSalesPlanFormVisible',
          payload: true,
        });

        yield [
          put({
            type: 'saveFormType',
            payload: payload.type,
          }),
          put({
            type: 'saveFormTitle',
            payload: '新增销售计划',
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
       


      } 
      // else if (payload.type === 'A') {
      //   yield put({
      //     type: 'changeNewFormVisible',
      //     payload: true,
      //   });
      // }

    

      // if (payload.type === 'E') {
      //   yield [
      //     put({
      //       type: 'saveFormTitle',
      //       payload: '编辑项目',
      //     }),
      //     put({
      //       type: 'saveFormID',
      //       payload: payload.id,
      //     }),
      //     // 请求数据
      //     put({
      //       type: 'fetchForm',
      //       payload: { record_id: payload.id },
      //     }),
      //   ];
      // }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(projectManageService.get, payload);
      if (response && response.asset_type) {
        response.asset_type = response.asset_type.split(',');
      }
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
          type: 'changeFormVisible',
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
   



    // 成本核算的接口
    // 查看详情
    *redirectDetail({ payload }, { put }) {
     
      yield put(
        routerRedux.push({
          pathname: '/cost/detail',
          query: {
            key: payload.key,
           
          },
        })
      );
    },
    
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveDisplayList(state, { payload }) {
      return { ...state, displayList: payload };
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
    changeSalesPlanFormVisible(state, { payload }) {
      console.log("修改新增计划的状态");
      return { ...state, addSalesPlanVisible: payload};
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
