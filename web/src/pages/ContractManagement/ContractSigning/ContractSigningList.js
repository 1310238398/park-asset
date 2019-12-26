import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ContractSigningView from './ContractSigningView';
import DraftContract from './DraftContract';
import Search from 'antd/lib/input/Search';
@connect(state => ({
  contractSiging: state.contractSiging,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSigningList extends PureComponent {
  state = {
    pro_ID: '',
    activeKey: '1',
  };
  // tab 切换
  tabChange = activeKey => {
    const { pro_ID } = this.state;
    this.setState({ activeKey });
    if (activeKey === '1') {
      //合同草稿
      this.props.dispatch({
        type: 'contractSiging/fetchSiging',
        payload: {
          proID: pro_ID,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '2') {
      //合同一栏
      this.props.dispatch({
        type: 'contractSiging/fetchContractList',
        payload: {
          proID: pro_ID,
          search: {},
          pagination: {},
        },
      });
    }
    this.props.dispatch({
      type: 'contractSiging/changeFormVisibleSettlement',
      payload: false,
    });
    this.props.dispatch({
      type: 'contractSiging/changeFormVisibleTakeEffect',
      payload: false,
    });
    this.props.dispatch({
      type: 'contractSiging/changeFormVisibleSiging',
      payload: false,
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'contractSiging/queryProTree',
      payload: {},
    });
  
  }

  // 当前项目选择
  handleChange = (value, label) => {
    const { activeKey } = this.state;
    this.setState({
      pro_ID: value,
    });
    this.props.dispatch({
      type: 'contractSiging/saveProjectID',
      payload: value,
    });
    if (activeKey === '1') {
      //合同草稿
      this.props.dispatch({
        type: 'contractSiging/fetchSiging',
        payload: {
          proID: value,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '2') {
      //合同一栏
      this.props.dispatch({
        type: 'contractSiging/fetchContractList',
        payload: {
          proID: value,
          search: {},
          pagination: {},
        },
      });
    }
  };

  formateTree(list) {
    // 组织机构的颜色为浅色
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (!item.selectable) {
        item.title = <span style={{ color: '#cccccc' }}>{item.title}</span>;
      }
      if (item.children && item.children.length > 0) {
        this.formateTree(item.children);
      }
    }
  }
  render() {
    const { TabPane } = Tabs;
    const {
      contractSiging: { projectTreeData,proID },
    } = this.props;
    const { pro_ID } = this.state;
    this.formateTree(projectTreeData);
    const breadcrumbList = [
      { title: '合同管理' },
      { title: '合同签订', href: '/contractmanagement/signingList' },
    ];
    return (
      <PageHeaderLayout
        title={
          <div>
            <span>当前项目：</span>
            <TreeSelect
             value={proID}
              treeData={projectTreeData}
              style={{ width: 200 }}
              onChange={this.handleChange}
            ></TreeSelect>
          </div>
        }
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            <TabPane tab="合同草稿" key="1">
              {/* 合同签订的列表 */}
              <DraftContract proID={proID}></DraftContract>
            </TabPane>
            <TabPane tab="合同一览" key="2">
              <ContractSigningView proID={proID}></ContractSigningView>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default ContractSigningList;
