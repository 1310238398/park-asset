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
  DatePicker,
  Checkbox,
} from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
// import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
// import FinishquotingModel from './FinishquotingModel';

@connect(({ designChange }) => ({
  designChange,
}))
@Form.create()
class DesignChangeDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
    this.state = {
      value: undefined,
      reasonArr:[]
    };
  }
  
  componentDidMount() {
    this.props.dispatch({
      type: 'designChange/fetchChangeReason',
    });
  }

  // 甲方单位模糊匹配
  handleChangePro = e => {
    console.log(e);
    this.setState({ project_id: e });
    this.dispatch({
      type: 'designChange/saveProjectID',
      payload: e,
    });
  };

  onOKClick = () => {
    const {
      form,
      designChange: { proData },
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
        type: 'designChange/changeFormVisibleFinishquoting',
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
// 数组排序
compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
};
  render() {
    const {
      designChange: {
        formVisibleDesignChange,
        formTitleDesignChange,
        formDataDesignChange,
        submitting,
        formTypeDesignChange,
        proData,
        treeData,
        changeList,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    // this.setState({reasonArr})
    const { TabPane } = Tabs;
    const { Option } = Select;
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
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <Modal
        title={formTitleDesignChange}
        width={1200}
        visible={formVisibleDesignChange}
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
              <Form.Item {...formItemLayout} label="变更编号">
                {getFieldDecorator('name', {
                  initialValue: formDataDesignChange.name,
                  rules: [
                    {
                      required: false,
                      message: '请输入变更编号',
                    },
                  ],
                })(<Input placeholder="请输入变更编号" />)}
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
                  initialValue: formDataDesignChange.name,
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
              <Form.Item {...formItemLayout} label="发起部门">
                {getFieldDecorator('category', {
                  initialValue: formDataDesignChange.category,
                  rules: [
                    {
                      required: false,
                      message: '请选择合同类别',
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
              <Form.Item {...formItemLayout} label="发起人">
                {getFieldDecorator('jiafang_sign', {
                  initialValue: formDataDesignChange.jiafang_sign,
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
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="变更部位">
                {getFieldDecorator('remark', {
                  initialValue: formDataDesignChange.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入变更部位',
                    },
                  ],
                })(<Input.TextArea rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="变更原因">
                {getFieldDecorator('remark', {
                  initialValue: formDataDesignChange.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入变更部位',
                    },
                  ],
                })(
                  <Checkbox.Group style={{ width: '100%' }} options={changeList.sort(this.compare('value'))}>
                  </Checkbox.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="其他原因">
                {getFieldDecorator('remark', {
                  initialValue: formDataDesignChange.remark,
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
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="变更内容">
                {getFieldDecorator('remark', {
                  initialValue: formDataDesignChange.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入变更内容',
                    },
                  ],
                })(<Input.TextArea rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="成本增减">
                {getFieldDecorator('amount', {
                  initialValue: formDataDesignChange.amount,
                  rules: [
                    {
                      required: false,
                      message: '请输入估算金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入估算金额" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="估算金额">
                {getFieldDecorator('amount', {
                  initialValue: formDataDesignChange.amount,
                  rules: [
                    {
                      required: false,
                      message: '请输入估算金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入估算金额" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否施工">
                {getFieldDecorator('property', {
                  initialValue: formDataDesignChange.property,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value="1">已施工</Option>
                    <Option value="0">未施工</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否已采购">
                {getFieldDecorator('settlement', {
                  initialValue: formDataDesignChange.settlement
                    ? formDataDesignChange.settlement
                    : '0',
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value="1">已采购</Option>
                    <Option value="0">未采购</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="费用变化初判">
                {getFieldDecorator('virtual', {
                  initialValue: formDataDesignChange.virtual ? formDataDesignChange.virtual : '0',
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
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否需报价">
                {getFieldDecorator('virtual', {
                  initialValue: formDataDesignChange.virtual ? formDataDesignChange.virtual : '0',
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
            <Col span={12}>
              <Form.Item {...formItemLayout} label="发起日期">
                {getFieldDecorator('jiafang_sign', {
                  initialValue: formDataDesignChange.jiafang_sign,
                  rules: [
                    {
                      required: false,
                      message: '请输入发起人',
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="变更类型">
                {getFieldDecorator('category', {
                  initialValue: formDataDesignChange.category,
                  rules: [
                    {
                      required: false,
                      message: '请选择变更类型',
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
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('remark', {
                  initialValue: formDataDesignChange.remark,
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
                  initialValue: formDataDesignChange.memo,
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

export default DesignChangeDetail;
