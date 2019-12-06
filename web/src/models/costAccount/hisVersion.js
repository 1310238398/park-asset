import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 收益测算 历史版本
export default {
    namespace: 'hisVersion',
    state: {
        data:[],
        infoModalVisible: false,
    },
    effects: {

    },
    reducers: {
        changeInfoModalVisible(state, { payload }) {
          
            return { ...state, infoModalVisible: payload };
        }

        
    }
}