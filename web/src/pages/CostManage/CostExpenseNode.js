import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Tabs,
    Card
} from 'antd';
import styles from './CostAccount.less';
const { TabPane } = Tabs;
@connect(state => ({
    //salesPlan: state.salesPlan,
}))
class CostExpenseNode extends PureComponent {
    state = {

    };

    componentDidMount() {
        // this.dispatch({
        //   type: 'projectManage/queryCompany',
        // });
    }
    render() {

        return (
            <div  >
           和生活时尚
          </div>
        );
    }

}
export default CostExpenseNode;