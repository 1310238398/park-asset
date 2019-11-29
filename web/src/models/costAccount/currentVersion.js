import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 当前版本
export default {
    namespace: 'currentVersion',
    state: {
        data: [],

    },
    effects: {
        *fetch({ payload }, { call, put }) {

            const response = yield call(costAccountService.getCurrentVersionInfo, payload);
            if (response.list && response.list.length  >= 0 ) {

                yield put({
                    type: 'saveData',
                    payload: response.list || [],
                  });
            }
        }
    },
    reducers: {
        
    }
}