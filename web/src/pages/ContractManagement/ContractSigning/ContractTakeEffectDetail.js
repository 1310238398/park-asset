import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Card, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import ContractTakeEffectForm from './ContractTakeEffectForm';
const { Description } = DescriptionList;

@connect(({ contractSiging }) => ({
  contractSiging,
}))
class ContractTakeEffectDetail extends PureComponent {
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
        formDataSettlement,
        submitting,
      },
     visible,
      onCancel,
    } = this.props;
   
    return (
      <Modal
        title="合同结算"
        width={800}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <DescriptionList title="" size="large" col={2} style={{marginLeft:45,marginBottom:10}}>
            <Description term="合同名称">22</Description>
            <Description term="合同编号">222</Description>
            <Description term="合同类别">22</Description>
            <Description term="合同性质">33</Description>
            <Description term="甲方单位">22</Description>
            <Description term="负责人">222</Description>
            <Description term="乙方单位">33</Description>
            <Description term="负责人">222</Description>
          </DescriptionList>
            <ContractTakeEffectForm></ContractTakeEffectForm>
      </Modal>
    );
  }
}

export default ContractTakeEffectDetail;
