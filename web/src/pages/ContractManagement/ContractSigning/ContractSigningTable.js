import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PaymentInformation from './PaymentInformation';
import FinancialInformation from './FinancialInformation';
import ContractSettlement from './ContractSettlement';
import DesignChange from './DesignChange';
import VisaChange from './VisaChange';
import MaterialPricing from './MaterialPricing';
import OtherInformation from './OtherInformation';
@connect(state => ({
  contractSiging: state.contractSiging,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSigningTable extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="审批流程" key="1">
                  待定
              </TabPane>
            <TabPane tab="付款信息" key="2">
                <PaymentInformation></PaymentInformation>
            </TabPane>
            <TabPane tab="财务信息" key="3">
              <FinancialInformation></FinancialInformation>
            </TabPane>
            <TabPane tab="签证变更" key="4">
              <VisaChange></VisaChange>
            </TabPane>
            <TabPane tab="设计变更" key="5">
             <DesignChange></DesignChange>
            </TabPane>
            <TabPane tab="材料批价" key="6">
              <MaterialPricing></MaterialPricing>
            </TabPane>
            <TabPane tab="合同结算" key="7">
             <ContractSettlement></ContractSettlement>
            </TabPane>
            {/* <TabPane tab="其他信息" key="8">
              <OtherInformation></OtherInformation>
            </TabPane> */}
          </Tabs>
        </Card>
      </div>
    );
  }
}
export default ContractSigningTable;
