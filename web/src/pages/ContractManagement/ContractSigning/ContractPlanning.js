
import React, { PureComponent } from 'react';

import { Modal, Card,pagination,Table,Popconfirm } from 'antd';
import styles from './ContractSigning.less';
import ContractPlanningTable from './ContractPlanningTable';
class ContractPlanning extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.formData ? props.formData : {},
      address: {},
      type: 1,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('formData' in nextProps) {
      return { ...state, data: nextProps.formData ? nextProps.formData : {} };
    }
    return state;
  }

  // 点击取消
  onCancelClick = () => {
    const { callback } = this.props;
    callback();
  };

  // 点击确定
  onOKClick = () => {
    const { address } = this.state;
    this.props.onSubmit(address);
  };

  onChangeRuzhu = value => {
    this.setState({
      type: parseInt(value.target.value, 10),
    });
  };

  // 选择
  handleFormChange = (fields, item) => {
    const typeIn = this.state.type;
    this.setState({
      address: {
        btype: item.btype,
        building_id: item.record_id,
        building_name: fields,
        incoming_type: typeIn,
      },
    });
  };

  render() {
    const { visible, onCancel } = this.props;
    const { address, type } = this.state;
    return (
      <Modal
        title="选择合约规划"
        width={1200}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 19 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
       <ContractPlanningTable ></ContractPlanningTable>
      </Modal>
    );
  }
}

export default ContractPlanning;
