import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  TreeSelect,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import UploadFile from '@/components/UploadFile/UploadFile';
import PicturesWall2 from '@/components/PicturesWall2/PicturesWall2';
import { getCompanyOne } from '@/services/contractVisaChange';
const { Description } = DescriptionList;

@connect(({ visaChange }) => ({
  visaChange,
}))
@Form.create()
class VisaSureDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sgData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'visaChange/fetchTree',
    });
  }
  // 施工单位选择的数据
  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      newData.push(item);
    }
    return newData;
  };
  // 选中之后的变化
  toSTreeSelect = item => {
    getCompanyOne({
      record_id: item,
    }).then(data => {
      this.setState({ sgData: data });
    });
  };

  // 点击确定
  onOKClick = () => {
    const { form, data, onSubmit } = this.props;
    const { sgData } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = data.project_id;
        formData.record_id = data.record_id;
        formData.working_name = sgData.name;
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
      visaChange: { formDataSettlement, submitting, treeData },
      data,
      visible,
      onCancel,
      form: { getFieldDecorator, getFieldValue },
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
      <Modal
        title="签证确认信息"
        width={860}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout3} label="签证申请单编号">
                {data.sn}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同名称">
                {data.comcontract_name}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同编号">
                {data.comcontract_sn}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="施工单位">
                {getFieldDecorator('affirm_working_company', {
                  initialValue: formDataSettlement.affirm_working_company,
                  rules: [
                    {
                      required: true,
                      message: '请选择施工单位',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toTreeSelect(treeData)}
                    onChange={this.toSTreeSelect}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="确认日期">
                {getFieldDecorator('affirm_date', {
                  initialValue: formDataSettlement.affirm_date,
                  rules: [
                    {
                      required: true,
                      message: '请选择确认日期',
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择确认日期" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="工程量">
                {getFieldDecorator('affirm_work_num', {
                  initialValue: formDataSettlement.affirm_work_num,
                  rules: [
                    {
                      required: false,
                      message: '请输入工程量',
                    },
                  ],
                })(<Input placeholder="请输入工程量" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="结算金额">
                {getFieldDecorator('affirm_amount', {
                  initialValue: formDataSettlement.affirm_amount,
                  rules: [
                    {
                      required: true,
                      message: '请输入结算金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入结算金额" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('affirm_remark', {
                  initialValue: formDataSettlement.affirm_remark,
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
                {getFieldDecorator('attas', {
                  initialValue: formDataSettlement.attas,
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
      </Modal>
    );
  }
}

export default VisaSureDetail;
