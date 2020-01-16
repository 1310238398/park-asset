import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Button, Tabs, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from '../../ProjectManage/ProjectManage.less';
import BasicInfo from './BasicInfo';
import Node from './Node';
 import ApprovalProgress from './ApprovalProgress';
const { TabPane } = Tabs;
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,
  loading: state.loading.models.entrustedConstruction,
}))
class ContractDetail extends PureComponent {
  state = {};
  componentWillMount() {
    const {
      location: {
        query: { key, operType },
      },
    } = this.props;
    // key :record_id
    this.dispatch({
      type: 'entrustedConstruction/saveFormType',
      payload: operType,
    });

    this.dispatch({
      type: 'entrustedConstruction/saveFormID',
      payload: key,
    });
  }
  componentDidMount() {}
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleChange = (value, label) => {
    // const { costAccount: { formType}} = this.props;
    console.log('label ' + label);

    console.log('选择项目');
    console.log(value);
    // 刷新路由
    //    this.dispatch({
    //      type: 'costAccount/replaceDetail',
    //      payload: {
    //        record_id: value,
    //        operType: formType
    //      },

    //    });
    location.reload();
  };
  render() {
    const { entrustedConstruction:{  formID }} = this.props;
    const breadcrumbList = [{ title: '营销管理' }, { title: '大客户销售' }, { title: '合同详情' }];
    const treeData = [
      {
        selectable: false,
        title: <span style={{ color: '#cccccc' }}>Node1</span>,
        value: '0-0',
        key: '组织',

        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '项目',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '组织1',
        selectable: false,
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
            <span>当前合同：</span>
            <TreeSelect
             // value={formID}
              treeData={treeData}
              style={{ width: 200 }}
              // onBlur={this.handleChange}
              onChange={this.handleChange}
              // onSelect ={this.handleSelect}
            ></TreeSelect>
          </div>
        }
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="基本信息" key="1">
            <BasicInfo></BasicInfo>
            </TabPane>
            <TabPane tab="执行节点" key="2">
           <Node></Node>
            </TabPane>
            <TabPane tab="审批进度" key="3">
            <ApprovalProgress></ApprovalProgress>
            </TabPane>      
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default ContractDetail;
