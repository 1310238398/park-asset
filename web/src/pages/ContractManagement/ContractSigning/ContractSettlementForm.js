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
class ContractSettlementForm extends PureComponent {
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
            <Form.Item {...formItemLayout} label="报告编号">
              {getFieldDecorator('sn')(<Input  disabled/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="报告名称">
              {getFieldDecorator('name', {
                initialValue: formDataSettlement.name,
                rules: [
                  {
                    required: false,
                    message: '请输入报告名称',
                  },
                ],
              })(<Input placeholder="请输入报告名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="送审值">
              {getFieldDecorator('category', {
                initialValue: formDataSettlement.category ? formDataSettlement.category:0,
                rules: [
                  {
                    required: true,
                    message: '请输入送审值',
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入" />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="甲供金额">
              {getFieldDecorator('subject', {
                initialValue: formDataSettlement.subject,
                rules: [
                  {
                    required: false,
                    message: '请输入甲供金额',
                  },
                ],
              })( <InputNumber style={{ width: '100%' }} placeholder="请输入甲供金额" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="审定值">
              {getFieldDecorator('subject_subitem', {
                initialValue: formDataSettlement.subject_subitem?formDataSettlement.subject_subitem:0,
                rules: [
                  {
                    required: true,
                    message: '请输入审定值',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入审定值" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="甲供金额">
              {getFieldDecorator('contract_planning_id', {
                initialValue: formDataSettlement.contract_planning_id,
                rules: [
                  {
                    required: false,
                    message: '请输入甲供金额',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入甲供金额" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <Form.Item {...formItemLayout} label="审减值">
              {getFieldDecorator('contract_planning_id', {
                initialValue: formDataSettlement.contract_planning_id?formDataSettlement.contract_planning_id:0,
                rules: [
                  {
                    required: true,
                    message: '请输入审减值',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入审减值" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item {...formItemLayout} label="审减率">
              {getFieldDecorator('contract_planning_id', {
                initialValue: formDataSettlement.contract_planning_id,
                rules: [
                  {
                    required: false,
                    message: '请输入审减率',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入审减率" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="一审值">
              {getFieldDecorator('amount', {
                initialValue: formDataSettlement.amount,
                rules: [
                  {
                    required: true,
                    message: '请输入一审值',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入一审值" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="甲供金额">
              {getFieldDecorator('finishquoting', {
                initialValue: formDataSettlement.finishquoting,
                rules: [
                  {
                    required: false,
                    message: '请输入甲供金额',
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入甲供金额" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="最终审定值">
              {getFieldDecorator('property', {
                initialValue: formDataSettlement.property,
                rules: [
                  {
                    required: true,
                    message: '请输入最终审定值',
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入最终审定值" />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="甲供金额">
              {getFieldDecorator('settlement', {
                initialValue: formDataSettlement.settlement,
                rules: [
                  {
                    required: false,
                    message: '请输入甲供金额',
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入甲供金额" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout3} label="造价咨询单位">
              {getFieldDecorator('virtual', {
                initialValue: formDataSettlement.virtual,
                rules: [
                  {
                    required: true,
                    message: '请选择造价咨询单位',
                  },
                ],
              })(
               <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="经办人">
              {getFieldDecorator('vali_sign_amount', {
                initialValue: formDataSettlement.vali_sign_amount,
                rules: [
                  {
                    required: false,
                    message: '请输入经办人',
                  },
                ],
              })(<Input placeholder="请输入经办人" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="报告日期">
              {getFieldDecorator('jiafang', {
                 initialValue: formDataSettlement.jiafang ,
                rules: [
                  {
                    required: true,
                    message: '请选择报告日期',
                  },
                ],
              })( <DatePicker style={{ width: '100%' }} placeholder="请选择报告日期" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="份数">
              {getFieldDecorator('jiafang_sign', {
                initialValue: formDataSettlement.jiafang_sign,
                rules: [
                  {
                    required: false,
                    message: '请输入份数',
                  },
                ],
              })( <InputNumber style={{ width: '100%' }} placeholder="请输入份数" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="存档号">
              {getFieldDecorator('yifang', {
                initialValue: formDataSettlement.yifang,
                rules: [
                  {
                    required: false,
                    message: '请输入存档号',
                  },
                ],
              })(<Input placeholder="请输入存档号" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="是否终止">
              {getFieldDecorator('yifang_sign', {
                initialValue: formDataSettlement.yifang_sign ? formDataSettlement.yifang_sign : '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>
                )}
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
              })(<UploadFile bucket="contract"/>)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ContractSettlementForm;
