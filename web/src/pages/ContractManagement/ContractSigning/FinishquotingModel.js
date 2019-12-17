import React, { PureComponent } from 'react';

import { Modal, Form, Row, Select, Col } from 'antd';
import styles from './ContractSigning.less';

@Form.create()
class FinishquotingModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      balanceMethod: '',
      balancList: [
        {
          value: '1',
          label: '节约费用',
        },
        {
          value: '2',
          label: '暂不处理',
        },
      ],
    };
  }

  // 渲染下拉框的内容
  renderToposNode = data => {
    let ret = [];
    ret = data.map(obj => {
      return (
        <Select.Option key={obj.value} value={obj.value}>
          {obj.label}
        </Select.Option>
      );
    });
    return ret;
  };

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
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      this.props.onSubmit(formData);
    });
    
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { balancList } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <Modal
        title="余额处理"
        width={500}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 19 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout} label="余额处理方式">
                {getFieldDecorator('balanceMethod', {
                  rules: [
                    {
                      required: true,
                      message: '请选择余额处理方式',
                    },
                  ],
                })(
                  <Select placeholder="请选择" >
                    {this.renderToposNode(balancList)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default FinishquotingModel;
