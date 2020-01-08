import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DesignChangeList from './DesignChangeList';
import MaterialPricing from './MaterialPricing';
import VisaChangeList from './VisaChangeList';
@connect(state => ({
  designChange: state.designChange,
  visaChange: state.visaChange,
  materialPricing: state.materialPricing,
  contractSiging: state.contractSiging,
  loading: state.loading.models.designChange,
}))
@Form.create()
class ContractChangeTab extends PureComponent {
  state = {
    pro_ID: '',
    activeKey: '1',
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
      type: 'designChange/saveProjectID',
      payload: value,
    });
    this.props.dispatch({
      type: 'visaChange/saveProjectID',
      payload: value,
    });
    this.props.dispatch({
      type: 'materialPricing/saveProjectID',
      payload: value,
    });
    if (activeKey === '1') {
      //设计变更
      this.props.dispatch({
        type: 'designChange/fetchDesignChange',
        payload: {
          proID: value,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '2') {
      //签证变更
      this.props.dispatch({
        type: 'visaChange/fetchVisaChange',
        payload: {
          proID: value,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '3') {
      //材料批价
      this.props.dispatch({
        type: 'materialPricing/fetchMaterialPricing',
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

  // tab 切换
  tabChange = activeKey => {
    const { pro_ID } = this.state;
    console.log(pro_ID)
    this.setState({ activeKey });
    // 点击的是设计变更
    if (activeKey === '1') {
      this.props.dispatch({
        type: 'designChange/fetchDesignChange',
        payload: {
          proID: pro_ID,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '2') {
      // 点击的是签证变更
      this.props.dispatch({
        type: 'visaChange/fetchVisaChange',
        payload: {
          proID: pro_ID,
          search: {},
          pagination: {},
        },
      });
    } else if (activeKey === '3') {
      // 点击的是材料批价
      this.props.dispatch({
        type: 'materialPricing/fetchMaterialPricing',
        payload: {
          proID: pro_ID,
          search: {},
          pagination: {},
        },
      });
    }
    this.props.dispatch({
      type: 'visaChange/changeFormVisibleVisaChange',
      payload: false,
    });
    this.props.dispatch({
      type: 'designChange/changeFormVisibleDesignChange',
      payload: false,
    });
    this.props.dispatch({
      type: 'visaChange/changeFormVisibleVisaSure',
      payload: false,
    });
    this.props.dispatch({
      type: 'materialPricing/changeFormVisibleMaterialPricing',
      payload: false,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const {
      contractSiging: { projectTreeData },
      designChange: { proID },
    } = this.props;
    const { pro_ID } = this.state;
    this.formateTree(projectTreeData);
    const breadcrumbList = [
      { title: '合同管理' },
      { title: '合同变更', href: '/contractmanagement/changeTab' },
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
            <TabPane tab="设计变更" key="1">
              {/* 合同设计变更的列表 */}
              <DesignChangeList proID={proID} />
            </TabPane>
            <TabPane tab="签证变更" key="2">
              <VisaChangeList proID={proID} />
            </TabPane>
            <TabPane tab="材料批价" key="3">
              <MaterialPricing proID={proID} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default ContractChangeTab;
