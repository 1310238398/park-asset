import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col,Checkbox } from 'antd';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
import * as styles from './ContractChange.less';
import MaterialPricingAddTable from './MaterialPricingAddTable';

@connect(({ materialPricing }) => ({
  materialPricing,
}))
@Form.create()
class MaterialPricingForm extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'materialPricing/fetchChangeReason',
    });
  }
	
	// 数组排序
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const { Option } = Select;
    const {
      materialPricing: { formVisibleSettlement, formDataMaterialPricing, submitting,materialPricingList },
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
      <div>
        
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="申请材料批价名称">
              {getFieldDecorator('jiafang')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="批价编号">
              {getFieldDecorator('jiafang')(<Input placeholder="请输入批价编号" />)}
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
            <Form.Item {...formItemLayout} label="合同编号">
              {getFieldDecorator('jiafang')(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="施工单位">
              {getFieldDecorator('jiafang')(<Input placeholder="请输入施工单位" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="工程名称">
              {getFieldDecorator('jiafang')(<Input placeholder="请输入工程名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.textAreaStyle}>
            <Form.Item {...formItemLayout2} label="批价原因">
              {getFieldDecorator('remark', {
                initialValue: formDataMaterialPricing.remark,
                rules: [
                  {
                    required: false,
                    message: '请输入批价原因',
                  },
                ],
              })(<Checkbox.Group style={{ width: '100%' }} options={materialPricingList.sort(this.compare('value'))}>
              </Checkbox.Group>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.textAreaStyle}>
            <Form.Item {...formItemLayout2} label="其他原因">
              {getFieldDecorator('remark', {
                initialValue: formDataMaterialPricing.remark,
                rules: [
                  {
                    required: false,
                    message: '请输入其他原因',
                  },
                ],
              })(<Input.TextArea rows={2} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="设计变更名称">
              {getFieldDecorator('category', {
                initialValue: formDataMaterialPricing.category,
                rules: [
                  {
                    required: false,
                    message: '请输入设计变更名称',
                  },
                ],
              })(<Input placeholder="请输入设计变更名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="设计变更编号">
              {getFieldDecorator('category', {
                initialValue: formDataMaterialPricing.category,
                rules: [
                  {
                    required: false,
                    message: '请输入设计变更编号',
                  },
                ],
              })(<Input placeholder="请输入设计变更编号" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="签证变更名称">
              {getFieldDecorator('category', {
                initialValue: formDataMaterialPricing.category,
                rules: [
                  {
                    required: false,
                    message: '请输入签证变更名称',
                  },
                ],
              })(<Input placeholder="请输入签证变更名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="签证变更编号">
              {getFieldDecorator('category', {
                initialValue: formDataMaterialPricing.category,
                rules: [
                  {
                    required: false,
                    message: '请输入签证变更编号',
                  },
                ],
              })(<Input placeholder="请输入签证变更编号" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="发起部门">
              {getFieldDecorator('jiafang_sign', {
                initialValue: formDataMaterialPricing.jiafang_sign,
                rules: [
                  {
                    required: false,
                    message: '请输入发起人',
                  },
                ],
              })(<Input placeholder="请输入发起人" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="发起人">
              {getFieldDecorator('jiafang_sign', {
                initialValue: formDataMaterialPricing.jiafang_sign,
                rules: [
                  {
                    required: false,
                    message: '请输入发起人',
                  },
                ],
              })(<Input placeholder="请输入发起人" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="发起日期">
              {getFieldDecorator('jiafang_sign', {
                initialValue: formDataMaterialPricing.jiafang_sign,
                rules: [
                  {
                    required: false,
                    message: '请输入发起人',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <MaterialPricingAddTable></MaterialPricingAddTable>
      </div>
    );
  }
}

export default MaterialPricingForm;
