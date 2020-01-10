import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as entrustedConstructionService from '@/services/bigCustomerSale';
//import * as projectManageService from '@/services/projectManage';

export default {
    namespace: 'entrustedConstruction',
    state: {
        data: {
            list: [],
            pagination: {},
          },
          formID: '', // 当前选中的合同ID
          formType: 'E', // "E" 编辑 "V" 查看
          formVisible: false, // 创建合同弹窗是否可见
          contractTreeData: [], // 合同的树状列表
    
    },
     // 调service  call 调service函数 put 调reducer函数 select 暂存
    effects: {
        *fetch({ search, pagination}, {call, put, select}) {

        },
        // 查询基本信息
        *fetchBasic({ payload }, {put, call}) {

          console.log("查询基本信息");
        },
        *redirectFileDown({ payload }, { put, call }) {
            yield put(
                routerRedux.push({
                  pathname: '/market/bidCustomer/fileManage',
                       
                })
              );
        },
        *redirectDetail({ payload }, { put, call }) {
          yield put(
            routerRedux.push({
              pathname: '/market/bidCustomer/contract_detail',
              query: {
                key: payload.record_id,
                operType: payload.operType,
              },
            })
          );
        }

    },
    reducers: {
      saveFormID(state, { payload }) {
        return { ...state, formID: payload };
      },
      saveFormType(state, { payload }) {
        return { ...state, formType: payload };
      },
      saveFormVisible(state, { payload }) {
        return { ...state, formVisible: payload };
      }
    }
}