import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
import { getProFormat} from '@/services/projectManage';
// 成本核算:销售计划
export default {
  namespace: 'salesPlan',
  state: {
    search: {},
    pagination: {},
    // 销售计划列表
    data: [], //所有年份所有季度的列表数据
    formatData:[
      // {
      //   proj_business_id: "a",// 项目业态ID
      //   proj_business_name: "住宅",// 项目业态名称
      // }
    ], // 所有的业态
     
    displayList:[],// 需要根据用户的筛选条件，自己重构数据值
    submitting: false,
    formTitle: '',
    formID: '',
   
    addSalesPlanVisible: false,
    //formData: {},
  
  },
  // 调service  call 调service函数 put 调reducer函数 select 暂存
  effects: {
    *fetch({ search, pagination, pro_id }, { call, put, select }) {
      let params = {
        q: 'list',
        project_id: pro_id,
      };

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.salesPlan.search);
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
        const p = yield select(state => state.salesPlan.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(costAccountService.querySalesPlan, params);
      yield put({
        type: 'saveData',
        payload: response.list,
      });
      yield put({
        type: 'saveDisplayList',
        payload: response.list,
      });
      // 请求所有业态
      const response1 = yield call(getProFormat, { record_id: pro_id });

      if (response1 && response1.list) {

        let formatTemp = [];
      

        for (let i = 0; i < response1.list.length; i++) {

          let item = {};
          item.proj_business_id = response1.list[i].record_id;
          item.proj_business_name = response1.list[i].name;
          formatTemp.push(item);
        }

        yield put({
          type: 'saveFormatData',
          payload: formatTemp,
        });
      

      }

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
    // *fetchForm({ payload }, { call, put }) {
    //   const response = yield call(projectManageService.get, payload);
    //   if (response && response.asset_type) {
    //     response.asset_type = response.asset_type.split(',');
    //   }
    //   yield [
    //     put({
    //       type: 'saveFormData',
    //       payload: response,
    //     }),
    //   ];
    // },
    
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.salesPlan.formType);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.salesPlan.formID);
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
          type: 'changeSalesPlanFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *createPlan({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
     // const params = { ...payload };
     

      let response;
      
        response = yield call(costAccountService.createSalesPlan, payload);
      

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.status === "OK") {
        message.success('保存成功');
        yield put({
          type: 'changeSalesPlanFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }

    },
    *updatePlan({payload},{call}) { 
      let response;
      
     response = yield call(costAccountService.updateSalesPlan, payload);  
    },
    *del({ payload }, { call, put,select }) {
      const response = yield call(costAccountService.deletePlan, payload);
      let displayList = yield select(state => state.salesPlan.displayList);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({
           type: 'saveDisplayList',
           payload:displayList.filter(item => item.record_id !== payload)
      
      });
      let data = yield select(state => state.salesPlan.data);
      yield put({
        type: 'saveData',
        payload: data.filter(item => item.record_id !== payload)
      });

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
    saveFormatData(state, { payload }) {
      return { ...state, formatData: payload };
    },
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
