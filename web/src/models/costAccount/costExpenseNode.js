import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 成本核算:成本支出节点
export default {
    namespace: 'costExpenseNode',
    state: {
        selectListNode: [ // 资金支出时间选择项

          {
              key:1,
              name: "完成时间前30天"
             
          },
          {
            key:2,
            name: "完成时间"
           
        },
        {
            key:3,
            name: "完成时间后30天"
           
        },
        {
            key:4,
            name: "完成时间后2个月"
           
        },
        {
            key:5,
            name: "完成时间后6个月"
           
        },
        {
            key:6,
            name: "完成时间后1年"
           
        },
        {
            key:7,
            name: "平摊道每个月"
           
        },
        {
            key:8,
            name: "平摊道每个季度"
           
        },
       
       

            
        ],
        data:[],// tree
        costNodeItems:[],// 可选择的科目tree

    },
    effects: {
        *fetch({ payload }, { call, put, select }) {
          //  const params = { ...payload };
            // 请求所有的核算列表
            const response = yield call(costAccountService.queryCostExpenditureList, payload);
            if (response.list && response.list.length >=0) {
              yield put({
              type: 'saveData',
              payload: response.list || [],
            });
            } 

            const response1 = yield call(costAccountService.queryCostitems, payload);
            if (response1.list && response1.list.length >=0) {
              
                yield put({
                    type: 'saveCostNodeItems',
                    payload: response1.list || [],
                  });
            }
         
           
          },

    },
    reducers: {

        saveSelectListNode(state, { payload }) {
            return { ...state, selectListNode: payload };
        },
        saveData(state, { payload }) {
            return { ...state, data: payload };
        },
        saveCostNodeItems(state, { payload }) {
            return { ...state, costNodeItems: payload };
        }


    },
};
