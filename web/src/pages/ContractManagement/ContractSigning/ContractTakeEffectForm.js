import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input,InputNumber, Select,DatePicker,Row,Col } from 'antd';
import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
import FinishquotingModel from './FinishquotingModel';

@connect(({ contractSiging }) => ({
  contractSiging,
}))
@Form.create()
class ContractTakeEffectForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {Option} = Select;
    const {
      contractSiging: {
        formVisibleSettlement,
        formDataSettlement,
        submitting,
      },
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
            <Form.Item {...formItemLayout} label="生效日期">
              {getFieldDecorator('jiafang', {
                 initialValue: formDataSettlement.jiafang ,
                rules: [
                  {
                    required: true,
                    message: '请选择生效日期',
                  },
                ],
              })( <DatePicker style={{ width: '100%' }} placeholder="请选择生效日期" />)}
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
                    required: true,
                    message: '请选择',
                  },
                ],
              })(<UploadFile bucket="contract"/>)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ContractTakeEffectForm;
