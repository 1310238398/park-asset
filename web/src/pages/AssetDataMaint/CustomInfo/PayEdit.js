import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, Row, Col } from 'antd';

@connect(({ menu }) => ({
  menu,
}))
@Form.create()
class PayEdit extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      assetDatamaint: { submitting, formVisibleJF, formTitleJF, formDataJF },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const { TextArea } = Input;
    return (
      <Modal
        title={formTitleJF}
        width={900}
        visible={formVisibleJF}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="作废原因">
                  {getFieldDecorator('name', {
                    initialValue: formDataJF.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<TextArea placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="操作人">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="联系方式">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default PayEdit;
