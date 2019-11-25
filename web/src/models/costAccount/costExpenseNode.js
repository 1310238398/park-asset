import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
// 成本核算:成本支出节点
export default {
    namespace: 'costExpenseNode',
    state: {
        selectListNode: [ // 资金支出时间选择项
            "完成时间",
            "完成时间前30天",
            "平摊之每个月"
        ]

    },
    effects: {

    },
    reducers: {
        saveSelectListNode(state, { payload }) {
            return { ...state, selectListNode: payload };
        },


    },
};
