import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Tabs,
    Card
} from 'antd';
import styles from './CostAccount.less';
import CurrentVersion from './CurrentVersion';
import HisVersion from './HisVersion';
import VersionComparison from './VersionComparison';
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
            <Tabs
            // type="card" 
             defaultActiveKey="1" 
             tabPosition="left"
             >
              <TabPane tab="当前版本" key="1" >
               <CurrentVersion></CurrentVersion>
              </TabPane>
              <TabPane tab="历史版本" key="2">
             <HisVersion></HisVersion>
              </TabPane>
              <TabPane tab="版本对比" key="3"> 
              <VersionComparison></VersionComparison>
              </TabPane>
            </Tabs>
          </div>
        );
    }

}
export default IncomeMeasure;