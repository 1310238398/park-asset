import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, Row, Col, InputNumber } from 'antd';
import PicturesWall from '@/components/PicturesWall/PicturesWall';

@connect(({ assetDatamaint }) => ({
  assetDatamaint,
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
                <Form.Item {...formItemLayout} label="应缴金额（元）">
                  {getFieldDecorator('name', {
                    initialValue: formDataJF.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="实缴费（元）">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="收据照片（转账记录截图）">
                  {getFieldDecorator('router', {
                    initialValue: formDataJF.router,
                  })(<PicturesWall num={9} listType="picture-card" />)}
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
                <Form.Item {...formItemLayout} label="操作人联系方式">
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
