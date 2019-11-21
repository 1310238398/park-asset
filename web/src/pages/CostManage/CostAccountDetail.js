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
}))
export default class CostAccountDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    formData: {},
    treeData: [],
  };

  componentDidMount() {
    const {
      location: {
        query: { key },
      },
    } = this.props;
    console.log('传入的key ' + key);
    // 初始化Tab1的数据


  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  callback(key) {
    console.log("Tab callback");
    //message.success("你点击了Tab "+ key);
  }
  renderDataForm() {
    return (
      <AddNewSalesPlan
        onCancel={this.handleDataFormCancel}
        onSubmit={this.handleDataFormSubmit}
      />
    );
  }

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'salesPlan/changeSalesPlanFormVisible',
      payload: false,
    });

    

  };
  handleDataFormSubmit = data => {
    console.log("哈哈哈2");
    this.dispatch({
      type: 'costAccount/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  changeTab(param) {
    console.log("changeTab");
    console.log(param);
  }

  render() {
    const breadcrumbList = [{ title: '成本管理' }, { title: '成本核算', href:'/cost/list' },{ title: '项目详情', href: '/cost/detail' }];
    return (
      <PageHeaderLayout
        title="项目详情"
        breadcrumbList={breadcrumbList}
        //content={this.renderContent()}
      >
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback} onChange={this.changeTab}>
            <TabPane tab="收益测算" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="成本核算" key="2">
              <CostList></CostList>
            </TabPane>
            <TabPane tab="销售计划" key="3" style={{minHeight: 500, maxHeight: 500}}>
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
        {
          this.renderDataForm()
        }
      </PageHeaderLayout>
    );
  }
}
