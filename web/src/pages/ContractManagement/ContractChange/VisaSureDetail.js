import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Card, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import VisaSureForm from './VisaSureForm';
const { Description } = DescriptionList;

@connect(({ visaChange }) => ({
  visaChange,
}))
class VisaSureDetail extends PureComponent {
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
      visaChange: {
        formDataSettlement,
        submitting,
      },
     visible,
      onCancel,
    } = this.props;
   
    return (
      <Modal
        title="签证确认信息"
        width={860}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <VisaSureForm></VisaSureForm>
        
      </Modal>
    );
  }
}

export default VisaSureDetail;
