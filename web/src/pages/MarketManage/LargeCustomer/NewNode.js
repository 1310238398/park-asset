import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Radio,
  Button,
  message,
  InputNumber,
  DatePicker,
  Card,
} from 'antd';
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,
}))
@Form.create()
class NewNode extends PureComponent {
  state = {};
  componentDidMount() {}
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  onOKClick = () => {};
  onCancelClick = () => {
    this.dispatch({
      type: 'entrustedConstruction/saveNewNodeFormVisible',
      payload: false,
    });
  };

  render() {
    const RadioGroup = Radio.Group;
    const {
      entrustedConstruction: { newNodeFormVisible },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
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
        title="新建节点"
        width="60%"
        centered={true}
        visible={newNodeFormVisible}
        maskClosable={false}
        // confirmLoading={submitting}
        destroyOnClose={true}
        onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          height: '500px',
          overflowY: 'auto',
          paddingTop: '15px',
        }}
      >
        <Card bordered={false} bodyStyle={{ paddingTop: '10px' }}>
          <Form >
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label="节点名称" {...formItemLayout} >
                  {getFieldDecorator('node_name', {
                    rules: [
                      {
                        required: true,
                        message: '请填写节点名称',
                      },
                    ],
                  })(<Input placeholder="请输入节点名称" />)}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label="父级节点" {...formItemLayout} >
                  {getFieldDecorator('node_father', {})(<div>自动带出</div>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item label="时间模式" {...formItemLayout} >
                  {getFieldDecorator('time_type', {
                    rules: [
                      {
                        required: true,
                        message: '请选择时间模式',
                      },
                    ],
                  })(
                    <Select placeholder="请选择时间模式" style={{ width: '100%' }}>
                      <Select.Option key="01" value="相对时间">
                        相对时间
                      </Select.Option>
                      <Select.Option key="02" value="绝对时间">
                        绝对时间
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col md={12} sm={24}>
                <Form.Item label="完成时间" {...formItemLayout} >
                  {getFieldDecorator('time_value', {
                    rules: [
                      {
                        required: true,
                        message: '请选择完成时间',
                      },
                    ],
                  })(
                    <div>
                      {getFieldValue('time_type') === '相对时间' ? 
                        <Select placeholder="请选择节点" style={{ width: '100%' }}>
                          <Select.Option key="01" value="节点1">
                            节点1
                          </Select.Option>
                          <Select.Option key="02" value="节点2">
                            节点2
                          </Select.Option>
                        </Select>
                      :

                      
                        <DatePicker
                          // showTime
                          style={{ width: '100%' }}
                          placeholder="请选择完成时间"
                          format="YYYY-MM-DD"
                          //locale={locale}
                        />
                      }
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {getFieldValue('time_type') === '相对时间' && (
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item label="节点前后" {...formItemLayout} >
                    {getFieldDecorator('node_before_after', {
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Select.Option key="01" value="之前">
                          之前
                        </Select.Option>
                        <Select.Option key="02" value="之后">
                          之后
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="间隔时间(日)" {...formItemLayout} >
                    {getFieldDecorator('time_interval', {
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        },
                      ],
                    })(<InputNumber placeholder="请输入间隔天数" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item {...formItemLayout} label="是否需要付款">
                  {getFieldDecorator('is_payment', {
                      initialValue: 1,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label="负责人" {...formItemLayout} >
                  {getFieldDecorator('responsible_person', {
                    rules: [
                      {
                        required: true,
                        message: '请填写负责人',
                      },
                    ],
                  })(<Input placeholder="请输入负责人" />)}
                </Form.Item>
              </Col>
            </Row>
            {getFieldValue('is_payment') === 1 && (
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Form.Item {...formItemLayout} label="付款比例">
                    {getFieldDecorator('pay_rate', {
                      rules: [
                        {
                          required: true,
                          message: '请选择付款比例',
                        },
                      ],
                    })(<InputNumber placeholder="请输入付款比例" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="付款金额" {...formItemLayout} >
                    {getFieldDecorator('pay_amount ', {
                      rules: [
                        {
                          required: true,
                          message: '请填写付款金额',
                        },
                      ],
                    })(<InputNumber placeholder="请输入付款金额" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col md={12} sm={24}>
                <Form.Item  labelCol= {{span:7}} wrapperCol={{span:14}}
           label="备注" >
                  {getFieldDecorator('node_remark', {
                    // initialValue: formDataSupplement.remark,
                    rules: [
                      {
                        required: false,
                        message: '请输入备注',
                      },
                    ],
                  })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}
export default NewNode;
