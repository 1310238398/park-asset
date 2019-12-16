import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, Steps, Button, message } from 'antd';
@connect(state => ({
  currentVersion: state.currentVersion,
  costAccount: state.costAccount,
}))
@Form.create()
class SelectNewVersionMode extends PureComponent {
  state = {
    value: 1,
  };

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  componentDidMount() {}

  onCancelClick = () => {
    console.log('onCancelClick');

    this.dispatch({
      type: 'currentVersion/saveSelectNewModeVisile',
      payload: false,
    });
  };

  onOKClick = () => {
    const { value } = this.state;
    const {
      costAccount: { formID },
    } = this.props;
    this.dispatch({
      type: 'currentVersion/saveSelectNewModeVisile',
      payload: false,
    });
    if (value === 1) {
      // 创建新的
      this.dispatch({
        type: 'currentVersion/fetchCompare',
        payload: {
          saveType: "1",
          saveTitle: "创建新版本",
          params: {
            project_id: formID,
            list: ['current', 'last'],
          },
        },
      });
    } else if (value === 2) {
      // 覆盖上一版本
      this.dispatch({
        type: 'currentVersion/fetchCompare',
        payload: {
          saveType: "2",
          saveTitle: "更新版本",
          params: {
            project_id: formID,
            list: ['current', 'beforeLast'],
          }
          
        },
      });
    }
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      currentVersion: { selectNewModeVisile },
    } = this.props;

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Modal
        title="选择创建方式"
        width={500}
        centered={true}
        visible={selectNewModeVisile}
        maskClosable={false}
        // confirmLoading={submitting}
        destroyOnClose={true}
        onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        // bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '150px', overflowY: 'auto' }}
      >
        <Radio.Group onChange={this.onChange} value={this.state.value}>
          <Radio style={radioStyle} value={1}>
            创建新版本
          </Radio>
          <Radio style={radioStyle} value={2}>
            覆盖更新前一版本
          </Radio>
        </Radio.Group>
      </Modal>
    );
  }
}
export default SelectNewVersionMode;
