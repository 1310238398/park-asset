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
          collection_data: { list: [], pagination: {} },
          formID: '', // 当前选中的合同ID
          formType: 'E', // "E" 编辑 "V" 查看
          formVisible: false, // 创建合同弹窗是否可见
          newNodeFormVisible: false, // 创建新的节点
          contractTreeData: [], // 合同的树状列表
          addNodeType: "", // 添加新节点的类型 upr 向上添加  up 向下添加
          addNodeRecordID: "", // 添加新节点时相邻的兄弟的record_id 
          
    
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
      saveData(state, { payload }) {
        return { ...state, data: payload };
      },
      saveCollection_data(state, { payload }) {
        return { ...state, collection_data: payload };
      },
      saveFormID(state, { payload }) {
        return { ...state, formID: payload };
      },
      saveFormType(state, { payload }) {
        return { ...state, formType: payload };
      },
      saveFormVisible(state, { payload }) {
        return { ...state, formVisible: payload };
      },
      saveNewNodeFormVisible(state, { payload }) {
        return { ...state, newNodeFormVisible: payload  }
      },
      saveAddNodeType(state, { payload }) {
        return { ...state, addNodeType: payload  }
      },
      saveAddNodeRecordID(state, { payload }) {
        return { ...state, addNodeRecordID: payload  }
      }
    }
}