import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Card,
  Modal,
  InputNumber,
  Row,
  Col,
  Radio,
  Tabs,
  Button,
  Select,
  TreeSelect,
  Checkbox,
  DatePicker,
} from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
// import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
import * as styles from './ContractChange.less';
// import FinishquotingModel from './FinishquotingModel';

@connect(({ visaChange }) => ({
  visaChange,
}))
@Form.create()
class VisaChangeDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
    this.state = {
      value: undefined,
      arrList: [],
    };
  }
  
  componentDidMount() {
    this.props.dispatch({
      type: 'visaChange/fetchChangeReason',
    });
    this.props.dispatch({
      type: 'visaChange/fetchChangeProject',
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
  // 甲方单位模糊匹配
  handleChangePro = e => {
    console.log(e);
    this.setState({ project_id: e });
    this.dispatch({
      type: 'visaChange/saveProjectID',
      payload: e,
    });
  };

  onOKClick = () => {
    const {
      form,
      visaChange: { proData },
      onSubmit,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proData.record_id;
        formData.parent_id = '';
        if (formData && formData.building_area) {
          formData.building_area = Math.round(Number(formData.building_area) * 100);
        }
        if (formData && formData.rent_area) {
          formData.rent_area = Math.round(Number(formData.rent_area) * 100);
        }

        onSubmit(formData);
      }
    });
  };

  // 合约规划是否引用完选择发生变化
  finishquotingSelect = value => {
    if (value === '1') {
      this.props.dispatch({
        type: 'visaChange/changeFormVisibleFinishquoting',
        payload: true,
      });
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 乙方单位选择的书库

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      visaChange: {
        formVisibleVisaChange,
        formTitleVisaChange,
        formDataVisaChange,
        submitting,
        formTypeVisaChange,
        proData,
        treeData,
        visaChangeList,
        porjectList,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { TabPane } = Tabs;
    const { Option } = Select;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const formItemLayout3 = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <Modal
        title={formTitleVisaChange}
        width={1200}
        visible={formVisibleVisaChange}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card title="基本信息" style={{ marginBottom: 20 }}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证编号">
                  {getFieldDecorator('name', {
                    initialValue: formDataVisaChange.name,
                    rules: [
                      {
                        required: false,
                        message: '请输入签证编号',
                      },
                    ],
                  })(<Input placeholder="请输入签证编号" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="申请变更主题名称">
                  {getFieldDecorator('sn')(<Input placeholder="请输入申请变更主题名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="合同名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataVisaChange.name,
                    rules: [
                      {
                        required: false,
                        message: '请输入合同名称',
                      },
                    ],
                  })(<Input placeholder="请输入合同名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="合同编号">
                  {getFieldDecorator('sn')(<Input placeholder="请输入合同编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="施工单位">
                  {getFieldDecorator('name', {
                    initialValue: formDataVisaChange.name,
                    rules: [
                      {
                        required: false,
                        message: '请输入施工单位',
                      },
                    ],
                  })(<Input placeholder="请输入施工单位" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="监理单位">
                  {getFieldDecorator('sn')(<Input placeholder="请输入监理单位" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证类型">
                  {getFieldDecorator('category', {
                    initialValue: formDataVisaChange.category,
                    rules: [
                      {
                        required: false,
                        message: '请选择签证类型',
                      },
                    ],
                  })(
                    <DicSelect
                      vmode="string"
                      pcode="contract$#contractType"
                      placeholder="请选择"
                      selectProps={{ placeholder: '请选择' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="分部工程名称">
                  {getFieldDecorator('category', {
                    initialValue: formDataVisaChange.category,
                    rules: [
                      {
                        required: false,
                        message: '请输入分部工程名称',
                      },
                    ],
                  })(<Input placeholder="请输入分部工程名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="签证原因">
                  {getFieldDecorator('remark', {
                    initialValue: formDataVisaChange.remark,
                    rules: [
                      {
                        required: false,
                        message: '请输入签证原因',
                      },
                    ],
                  })( <Checkbox.Group style={{ width: '100%' }} options={visaChangeList.sort(this.compare('value'))}>
                  </Checkbox.Group>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设计变更名称">
                  {getFieldDecorator('category', {
                    initialValue: formDataVisaChange.category,
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
                    initialValue: formDataVisaChange.category,
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
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="其他原因">
                  {getFieldDecorator('remark', {
                    initialValue: formDataVisaChange.remark,
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
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="签证内容">
                  {getFieldDecorator('remark', {
                    initialValue: formDataVisaChange.remark,
                    rules: [
                      {
                        required: false,
                        message: '请输入签证内容',
                      },
                    ],
                  })(<Input.TextArea rows={2} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证报价">
                  {getFieldDecorator('amount', {
                    initialValue: formDataVisaChange.amount,
                    rules: [
                      {
                        required: false,
                        message: '请输入签证报价',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入签证报价" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="施工负责人">
                  {getFieldDecorator('amount', {
                    initialValue: formDataVisaChange.amount,
                    rules: [
                      {
                        required: false,
                        message: '请输入施工负责人',
                      },
                    ],
                  })(<Input placeholder="请输入施工负责人" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="项目阶段">
                  {getFieldDecorator('property', {
                    initialValue: formDataVisaChange.property,
                    rules: [
                      {
                        required: false,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Checkbox.Group style={{ width: '100%' }} options={porjectList.sort(this.compare('value'))}>
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="发起部门">
                  {getFieldDecorator('jiafang_sign', {
                    initialValue: formDataVisaChange.jiafang_sign,
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
                    initialValue: formDataVisaChange.jiafang_sign,
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
                    initialValue: formDataVisaChange.jiafang_sign,
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
        </Card>
        <Card title="监理与现场部信息" style={{ marginBottom: 20 }}>
          <Form>
            <Row>
              <Col
                span={3}
                style={{ width: '10.5%', margin: '10px 0 10px 30px', color: 'rgba(0, 0, 0, 0.85)' }}
              >
                <label>监理单位意见：</label>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="初审意见">
                  <Input disabled defaultValue="上报审批" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="是否涉及出图">
                  {getFieldDecorator('virtual', {
                    initialValue: formDataVisaChange.virtual ? formDataVisaChange.virtual : '1',
                    rules: [
                      {
                        required: false,
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
              <Col
                span={3}
                style={{ width: '10.5%', margin: '10px 0 10px 30px', color: 'rgba(0, 0, 0, 0.85)' }}
              >
                <label>现场项目部意见：</label>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="成本增减">
                  {getFieldDecorator('name', {
                    initialValue: formDataVisaChange.name,
                    rules: [
                      {
                        required: false,
                        message: '请输入合同名称',
                      },
                    ],
                  })(<Input placeholder="请输入合同名称" />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="估算金额">
                  {getFieldDecorator('sn')(
                    <InputNumber style={{ width: '100%' }} placeholder="请输入估算金额" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="其他信息">
          <Form>
            <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="备注">
                  {getFieldDecorator('remark', {
                    initialValue: formDataVisaChange.remark,
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
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="附件">
                  {getFieldDecorator('memo', {
                    initialValue: formDataVisaChange.memo,
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
        </Card>
      </Modal>
    );
  }
}

export default VisaChangeDetail;
