import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DesignChangeList from './DesignChangeList';
import MaterialPricing from './MaterialPricing';
import VisaChangeList from './VisaChangeList';
@connect(state => ({
  designChange: state.designChange,
  visaChange:state.visaChange,
  materialPricing:state.materialPricing,
  loading: state.loading.models.designChange,
}))
@Form.create()
class ContractChangeTab extends PureComponent {
  // tab 切换
  tabChange = () =>{
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
  }
  
  render() {
    const { TabPane } = Tabs;
    const breadcrumbList = [
      { title: '合同管理' },
      { title: '合同变更', href: '/contractmanagement/changeTab' },
    ];
    return (
      <PageHeaderLayout title="合同变更" breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            <TabPane tab="设计变更" key="1">
              {/* 合同设计变更的列表 */}
             <DesignChangeList></DesignChangeList>
            </TabPane>
            <TabPane tab="签证变更" key="2">
             <VisaChangeList></VisaChangeList>
            </TabPane>
            <TabPane tab="材料批价" key="3">
             <MaterialPricing></MaterialPricing>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default ContractChangeTab;
