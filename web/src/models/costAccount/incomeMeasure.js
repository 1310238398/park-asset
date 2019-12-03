import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 当前版本
export default {
    namespace: 'incomeMeasure',
    state: {
        data: [],

    },
    effects: {
        *fetch({ payload }, { call, put }) {

         
        }
    },
    reducers: {
        
    }
}