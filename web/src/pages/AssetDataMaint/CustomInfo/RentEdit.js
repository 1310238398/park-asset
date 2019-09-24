import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Modal, Row, Col, InputNumber, DatePicker } from 'antd';

@connect(({ assetDatamaint }) => ({
  assetDatamaint,
}))
@Form.create()
class RentEdit extends PureComponent {
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
                <Form.Item {...formItemLayout} label="缴费开始日期">
                  {getFieldDecorator('name', {
                    initialValue: formDataJF.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="缴费截止日期">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="缴费金额（元））">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="缴费截止日期">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<DatePicker format="YYYY-MM-DD" placeholder="请选择" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default RentEdit;
