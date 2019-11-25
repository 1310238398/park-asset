import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SalesPlan from './SalesPlan';
import CostList from './CostList';
import AddNewSalesPlan from './AddNewSalesPlan';
import  IncomeMeasure  from "./IncomeMeasure";
import CostExpenseNode from "./CostExpenseNode";

const { TabPane } = Tabs;

import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(state => ({
  //projectManage: state.projectManage,
 
  costAccount: state.costAccount,
  costList: state.costList,
   salesPlan: state.salesPlan,
}))
export default class CostAccountDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
   pro_id:'fff',
   formType:"", // E V
  };

  componentWillMount() {
    const {
      location: {
        query: { key, operType },
      },
    } = this.props;
    console.log('CostAccountDetail pro_id ' + key);
    this.setState({pro_id: key});
    this.setState({formType: operType});

    //存储到model

    this.dispatch({
      type: 'costAccount/saveFormType',
      payload: operType,
    });

    this.dispatch({
      type: 'costAccount/saveFormID',
      payload: key,
    });
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
    const { pro_id, formType} = this.state;
    return (
      <PageHeaderLayout
        title="项目详情"
        breadcrumbList={breadcrumbList}
        //content={this.renderContent()}
      >
        <Card bordered={false}>
          <Tabs defaultActiveKey="2" onChange={this.callback}>
            <TabPane tab="收益测算" key="1">
            <IncomeMeasure></IncomeMeasure>
            </TabPane>
            <TabPane tab="成本核算" key="2">
              <CostList  ></CostList>
            </TabPane>
            <TabPane tab="销售计划" key="3" >
              <SalesPlan></SalesPlan>
            </TabPane>
            <TabPane tab="成本支出节点" key="4">
             <CostExpenseNode></CostExpenseNode>
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
