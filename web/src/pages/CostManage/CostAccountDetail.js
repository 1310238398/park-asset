import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SalesPlan from './SalesPlan';
import CostList from './CostList';
import AddNewSalesPlan from './AddNewSalesPlan';

const { TabPane } = Tabs;

import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(state => ({
  //projectManage: state.projectManage,
  salesPlan: state.salesPlan,
  costAccount: state.costAccount,
  costList: state.costList,
}))
export default class CostAccountDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
   pro_id:'',
  };

  componentDidMount() {
    const {
      location: {
        query: { key, operType },
      },
    } = this.props;
    console.log('传入的项目ID ' + key);
    this.setState({pro_id: key});
    // 初始化Tab1的数据
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  callback = key => {
    const {
      pro_id
    } = this.state;
 

    if (key === "1") {
      
    } else if (key === "2") {
      // 成本核算
    
      this.dispatch({
        type: 'costList/fetch',
        payload: {
          project_id: pro_id,
        },
      });
    } else if (key === "3") {
    } else if (key === "4") {
    } else if (key === "5") {
    }
  };
  renderDataForm() {
    return (
      <AddNewSalesPlan onCancel={this.handleDataFormCancel} onSubmit={this.handleDataFormSubmit} />
    );
  }

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'salesPlan/changeSalesPlanFormVisible',
      payload: false,
    });
  };
  handleDataFormSubmit = data => {
    console.log('哈哈哈2');
    this.dispatch({
      type: 'costAccount/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  render() {
    const breadcrumbList = [
      { title: '成本管理' },
      { title: '成本核算', href: '/cost/list' },
      { title: '项目详情', href: '/cost/detail' },
    ];
    return (
      <PageHeaderLayout
        title="项目详情"
        breadcrumbList={breadcrumbList}
        //content={this.renderContent()}
      >
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="收益测算" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="成本核算" key="2">
              <CostList></CostList>
            </TabPane>
            <TabPane tab="销售计划" key="3" style={{ minHeight: 500, maxHeight: 500 }}>
              <SalesPlan></SalesPlan>
            </TabPane>
            <TabPane tab="成本支出节点" key="4">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="资本化利息" key="5">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="土地增值税" key="6">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}
