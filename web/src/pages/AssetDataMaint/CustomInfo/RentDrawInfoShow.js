import React, { PureComponent } from 'react';
import { Form, Card, Tabs, Modal, Row, Col, DatePicker, InputNumber, Input } from 'antd';
import { connect } from 'dva';
import DicCheckBox from '@/components/DictionaryNew/DicCheckBox';

@connect(({ menu }) => ({
  menu,
}))
@Form.create()
class RentDrawInfoShow extends PureComponent {
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
    const { TabPane } = Tabs;
    const horizontalItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const {
      menu: { formData, submitting },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;
    return (
      <Modal
        title="退租事项办结"
        width={900}
        visible
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card>
          <Form className="custominfo-form">
            <Tabs onChange={this.handleChange}>
              <TabPane tab="合同正常结束" value="1" key="1">
                <div>
                  <Row>
                    <Col span={7}>
                      <Form.Item label="退租日期" {...horizontalItemLayout}>
                        {getFieldDecorator('withdrawal_date_normal', {
                          initialValue: formData.withdrawal_date ? formData.withdrawal_date : '',
                          rules: [
                            {
                              required: true,
                              message: '请选择退租日期',
                            },
                          ],
                        })(<DatePicker />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Form.Item label="应退押金" {...horizontalItemLayout}>
                        {getFieldDecorator('deposit_refund_normal', {
                          initialValue: formData.deposit_refund ? formData.deposit_refund : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<InputNumber />)}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="实退押金" {...horizontalItemLayout}>
                        {getFieldDecorator('real_deposit_normal', {
                          initialValue: formData.real_deposit ? formData.real_deposit : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<InputNumber />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Form.Item label="操作人" {...horizontalItemLayout}>
                        {getFieldDecorator('user_normal', {
                          initialValue: formData.deposit_refund ? formData.deposit_refund : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<Input placeholder="请填写操作人" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8} offset={1}>
                      <Form.Item {...horizontalItemLayout}>
                        {getFieldDecorator('tel_normal', {
                          initialValue: formData.real_deposit ? formData.real_deposit : '',
                          rules: [
                            {
                              required: false,
                              message: '请填写',
                            },
                          ],
                        })(<Input placeholder="请填写电话号码" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="合同提前结束" value="2" key="2">
                <div>
                  <Row>
                    <Col span={7}>
                      <Form.Item label="退租日期" {...horizontalItemLayout}>
                        {getFieldDecorator('withdrawal_date', {
                          initialValue: formData.withdrawal_date ? formData.withdrawal_date : '',
                          rules: [
                            {
                              required: true,
                              message: '请选择退租日期',
                            },
                          ],
                        })(<DatePicker />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Form.Item label="应退押金" {...horizontalItemLayout}>
                        {getFieldDecorator('deposit_refund', {
                          initialValue: formData.deposit_refund ? formData.deposit_refund : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<InputNumber />)}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="实退押金" {...horizontalItemLayout}>
                        {getFieldDecorator('real_deposit', {
                          initialValue: formData.real_deposit ? formData.real_deposit : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<InputNumber />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="违约金收缴" {...horizontalItemLayout}>
                        {getFieldDecorator('liquidated_damages', {
                          initialValue: formData.liquidated_damages
                            ? formData.liquidated_damages
                            : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<InputNumber />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={24}
                      // style={{
                      //   display: this.state.value === 1 ? 'block' : 'none',
                      // }}
                    >
                      <Form.Item label="退租原因">
                        {getFieldDecorator('reason', {
                          initialValue: formData.reason ? formData.reason : '',
                          rules: [
                            {
                              required: true,
                              message: '退租原因不可空',
                            },
                          ],
                        })(<DicCheckBox vmode="string" pcode="pa$#withdrawreason" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Form.Item label="操作人" {...horizontalItemLayout}>
                        {getFieldDecorator('user', {
                          initialValue: formData.deposit_refund ? formData.deposit_refund : '',
                          rules: [
                            {
                              required: true,
                              message: '请填写',
                            },
                          ],
                        })(<Input placeholder="请填写操作人" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8} offset={1}>
                      <Form.Item {...horizontalItemLayout}>
                        {getFieldDecorator('tel', {
                          initialValue: formData.real_deposit ? formData.real_deposit : '',
                          rules: [
                            {
                              required: false,
                              message: '请填写',
                            },
                          ],
                        })(<Input placeholder="请填写电话号码" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default RentDrawInfoShow;
