import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Card, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import ContractSettlementForm from './ContractSettlementForm';
const { Description } = DescriptionList;
import ContractSupplementAdd from './ContractSupplementAdd';

@connect(({ contractSiging }) => ({
  contractSiging,
}))
class ContractSettlementDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  // 点击确定
  onOKClick = () => {
    
  };


  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      contractSiging: {
        formVisibleSettlement,
        formDataSettlement,
        submitting,
      },
     
      onCancel,
    } = this.props;
   
    return (
      <Modal
        title="合同结算"
        width={1000}
        visible={formVisibleSettlement}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card title="合同基本信息" >
        <DescriptionList title="" size="large" col={3}>
            <Description term="合同名称">22</Description>
            <Description term="合同编号">222</Description>
            <Description term="合同类别">22</Description>
            <Description term="所属科目">222</Description>
            <Description term="合同性质">33</Description>
            <Description term="甲方单位">22</Description>
            <Description term="乙方单位">33</Description>
            <Description term="丙方单位">222</Description>
            <Description term="当前状态">22</Description>
            <Description term="生效时间">222</Description>
            <Description term="合同金额（含甲供材）">33</Description>
            <Description term="甲供材金额">22</Description>
          </DescriptionList>
        </Card>
        <Card title="结算信息"  style={{marginTop:20}}>
            <ContractSettlementForm></ContractSettlementForm>
        </Card>
        <Card style={{marginTop:10}}> 
             <ContractSupplementAdd></ContractSupplementAdd>
        </Card>
      </Modal>
    );
  }
}

export default ContractSettlementDetail;
