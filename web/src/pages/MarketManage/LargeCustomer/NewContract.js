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
  Steps,
  Button,
  message,
  InputNumber,
  DatePicker,
  Card
} from 'antd';
import PicturesWall2 from '../../../components/PicturesWall2/PicturesWall2';
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,
}))
@Form.create()
class NewContract extends PureComponent {
  state = {};

  componentDidMount() {}
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onOKClick = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log('formData ' + JSON.stringify(formData));

      this.dispatch({
        type: '',
        payload: submitData,
      });
    });
  };

  onCancelClick = () => {
    this.dispatch({
      type: 'entrustedConstruction/saveFormVisible',
      payload: false,
    });
  };

  render() {
    const {
      entrustedConstruction: { formVisible },
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <Modal
        title="新建合同"
        width="60%"
        centered={true}
        visible={formVisible}
        maskClosable={false}
        // confirmLoading={submitting}
        destroyOnClose={true}
        onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '500px', overflowY: 'auto' }}
      >
        <Card bordered={false} >
        <Form labelAlign="left" >
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="合同名称" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_name', {
                  rules: [
                    {
                      required: true,
                      message: '请填写合同名称',
                    },
                  ],
                })(<Input placeholder="请输入合同名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同编号" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_num', {
                  rules: [
                    {
                      required: true,
                      message: '请填写合同编号',
                    },
                  ],
                })(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="甲方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_jia', {
                  rules: [
                    {
                      required: true,
                      message: '请填写甲方名称',
                    },
                  ],
                })(<Input placeholder="请输入甲方名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="乙方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_yi', {
                  rules: [
                    {
                      required: true,
                      message: '请填写乙方名称',
                    },
                  ],
                })(<Input placeholder="请输入乙方名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="项目" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_project', {
                  rules: [
                    {
                      required: true,
                      message: '请选择项目',
                    },
                  ],
                })(
                  <Select placeholder="请选择项目" style={{ width: '100%' }}>
                    <Select.Option key="01" value="项目1">
                      项目1
                    </Select.Option>
                    <Select.Option key="02" value="项目2">
                      项目2
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="楼栋" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute', {
                  rules: [
                    {
                      required: true,
                      message: '请选择楼栋',
                    },
                  ],
                })(
                  <Select placeholder="请选择楼栋" style={{ width: '100%' }}>
                    <Select.Option key="01" value="楼栋1">
                      楼栋1
                    </Select.Option>
                    <Select.Option key="02" value="楼栋2">
                      楼栋2
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="负责人" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_response', {
                  rules: [
                    {
                      required: true,
                      message: '请填写负责人名字',
                    },
                  ],
                })(<Input placeholder="请输入负责人名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="联系电话" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_phone', {
                  rules: [
                    {
                      required: true,
                      message: '请填写联系电话',
                    },
                  ],
                })(<Input placeholder="请输入联系电话" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="建筑面积" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_area', {
                  rules: [
                    {
                      required: true,
                      message: '请填写建筑面积',
                    },
                  ],
                })(<InputNumber placeholder="请输入建筑面积" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="建设费标准" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_standard', {
                  rules: [
                    {
                      required: true,
                      message: '请填写建设费标准',
                    },
                  ],
                })(<InputNumber placeholder="请输入建设费标准" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="单价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_unit', {
                  rules: [
                    {
                      required: true,
                      message: '请填写单价',
                    },
                  ],
                })(<InputNumber placeholder="请输入单价" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同总价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_total', {
                  rules: [
                    {
                      required: true,
                      message: '请填写总价',
                    },
                  ],
                })(<InputNumber placeholder="请输入合同总价" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="车位(个)" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_car')(
                  <InputNumber placeholder="请输入车位个数" style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同类型" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择合同类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择合同类型" style={{ width: '100%' }}>
                    <Select.Option key="01" value="常规合同">
                      常规合同
                    </Select.Option>
                    <Select.Option key="02" value="委托建设合同">
                      委托建设合同
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item {...formItemLayout} label="签订时间" labelAlign="left">
                {getFieldDecorator('sign_time', {
                  // initialValue: moment(formData.end_time),
                  rules: [
                    {
                      required: true,
                      message: '请选择时间',
                    },
                  ],
                })(
                  <DatePicker
                    // showTime
                    style={{ width: '100%' }}
                    placeholder="请选择结束时间"
                    format="YYYY-MM-DD"
                    //locale={locale}
                  />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item {...formItemLayout} label="上传合同" labelAlign="left">
                {getFieldDecorator('upload', {
                  // initialValue: moment(formData.end_time),
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请选择时间',
                  //   },
                  // ],
                })(<PicturesWall2 num={5} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item {...formItemLayout} label="备注" labelAlign="left">
                {getFieldDecorator('contract_remark', {
                  // initialValue: formDataSupplement.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入备注',
                    },
                  ],
                })(<Input.TextArea rows={4} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </Card>
      </Modal>
    );
  }
}
export default NewContract;
