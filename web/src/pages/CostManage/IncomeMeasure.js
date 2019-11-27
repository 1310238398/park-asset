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
class IncomeMeasure extends PureComponent {
    state = {

    };

    componentDidMount() {
        // this.dispatch({
        //   type: 'projectManage/queryCompany',
        // });
        console.log("收益测算初始化界面")
    }
    render() {

        return (
            <div  >
            <Tabs type="card" >
              <TabPane tab="最新版本" key="1">
               <div style={{background:"white"}}>hdhdhdh </div>
              </TabPane>
              <TabPane tab="历史版本" key="2">
                <p>Content of Tab Pane 2</p>
                <p>Content of Tab Pane 2</p>
                <p>Content of Tab Pane 2</p>
              </TabPane>
              <TabPane tab="版本对比" key="3"> 
                <p>Content of Tab Pane 3</p>
                <p>Content of Tab Pane 3</p>
                <p>Content of Tab Pane 3</p>
              </TabPane>
            </Tabs>
          </div>
        );
    }

}
export default IncomeMeasure;