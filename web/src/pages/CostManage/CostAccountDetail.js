import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Card, message, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SalesPlan from './SalesPlan';
import CostList from './CostList';
import AddNewSalesPlan from './AddNewSalesPlan';
import  IncomeMeasure  from "./IncomeMeasure";
import CostExpenseNode from "./CostExpenseNode";
import LandValueAddedTax from './LandValueAddedTax';
import CapitalizedInterest from './CapitalizedInterest';

const { TabPane } = Tabs;

import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(state => ({
  projectManage: state.projectManage,
 
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

  renderAllProject(data) {
    let ret = [];
    ret = data.map(obj => {
      return (<Select.Option key={obj.record_id} value={obj}>{obj.name}</Select.Option>)
    })
    return ret;
  }

   handleChange = (value) => {
    console.log("选择项目");
    console.log(value);
  }
  render() {
    const breadcrumbList = [
      { title: '成本管理' },
      { title: '成本核算', href: '/cost/list' },
      { title: '项目详情', href: '/cost/detail' },
    ];
    const { pro_id, formType} = this.state;
    const { projectManage:{ data:{list}}} = this.props;
    
    const treeData = [
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            title: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            title: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            title: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ];
    return (
      <PageHeaderLayout
        title={
          <div>
            <span>当前项目：</span>
            <TreeSelect
           treeData={treeData}
            style={{ width: 200 }}

           // onBlur={this.handleChange}
           onChange={this.handleChange}
          >
           
          </TreeSelect>
          </div>
        }
        breadcrumbList={breadcrumbList}
        //content={this.renderContent()}
      >
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback} >
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
             <CapitalizedInterest></CapitalizedInterest>
            </TabPane>
            <TabPane tab="土地增值税" key="6">
              {/* Content of Tab Pane 3 */}
              <LandValueAddedTax></LandValueAddedTax>
            </TabPane>
          </Tabs>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}
