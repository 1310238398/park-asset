import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col } from 'antd';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';

@connect(({ visaChange }) => ({
  visaChange,
}))
@Form.create()
class VisaSureForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { Option } = Select;
    const {
      visaChange: { formVisibleSettlement, formDataSettlement, submitting },
      form: { getFieldDecorator, getFieldValue },
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
    const formItemLayout2 = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    const formItemLayout3 = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="签证申请单编号">
              {getFieldDecorator('jiafang')(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="合同编号">
              {getFieldDecorator('jiafang')(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="合同名称">
              {getFieldDecorator('jiafang')(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="施工单位">
              {getFieldDecorator('jiafang')(<Input  placeholder="请输入施工单位"/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="确认日期">
              {getFieldDecorator('jiafang', {
                initialValue: formDataSettlement.jiafang,
                rules: [
                  {
                    required: false,
                    message: '请选择确认日期',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择确认日期" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="工程量">
            {getFieldDecorator('remark')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item {...formItemLayout2} label="备注">
              {getFieldDecorator('remark', {
                initialValue: formDataSettlement.remark,
                rules: [
                  {
                    required: false,
                    message: '请输入备注',
                  },
                ],
              })(<Input.TextArea rows={2} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item {...formItemLayout2} label="附件">
              {getFieldDecorator('memo', {
                initialValue: formDataSettlement.memo,
                rules: [
                  {
                    required: false,
                    message: '请选择',
                  },
                ],
              })(<UploadFile bucket="contract" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default VisaSureForm;
