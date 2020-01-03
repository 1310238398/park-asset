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
import UploadFile from '@/components/UploadFile/UploadFile';
import { getSigingOne } from '@/services/contractSiging';
import moment from 'moment';
@connect(({ designChange }) => ({
  designChange,
}))
@Form.create()
class DesignChangeDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      reasonArr: [],
      formDatas: [],
      checkReason: false,
    };
  }

  // 点击确认
  onOKClick = () => {
    const {
      form,
      designChange: { proID },
      onSubmit,
      formTypeDesignChange,
    } = this.props;
    const {formDatas} = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proID;
        formData.comcontract_name = formDatas.name;
        if (formData.reason) {
          formData.reason = formData.reason.join(',');
        }
        if (formData.launch_date) {
        }

        // if(formData.cost_change){
        //   formData.cost_change =parseInt(formData.cost_change, 10)
        // }
        // 合同附件修改上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            if (formTypeDesignChange === 'E') {
              if (ele.url) {
              } else {
                urlArr.push({
                  url: ele.URL ? ele.URL : ele,
                });
              }
            } else {
              urlArr.push({
                url: ele,
              });
            }
          });
        }
        formData.attas = urlArr;
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 原合同选择的数据
  toOriginContractSelect = data => {
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
  toOriginSelect = item => {
    getSigingOne({
      record_id: item,
    }).then(data => {
      this.setState({formDatas:data})
       if(data.sn){
        this.props.form.setFieldsValue({
          comcontract_sn: data.sn,
        });
       }else{
        this.props.form.setFieldsValue({
          comcontract_sn:'',
        });
       }
    });
  };

  // 数组排序
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }

  // 变更原因变化
  reasonChange = checkedValue => {
    if (checkedValue.indexOf('13') > -1) {
      this.setState({ checkReason: true });
    } else {
      this.setState({ checkReason: false });
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
        treeOriginConData,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { formDatas } = this.state;
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
                {getFieldDecorator('sn', {
                  initialValue: formDataDesignChange.sn,
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
                {getFieldDecorator('name', {
                  initialValue: formDataDesignChange.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入申请变更主题名称',
                    },
                  ],
                })(<Input placeholder="请输入申请变更主题名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同名称">
                {getFieldDecorator('comcontract_id', {
                  initialValue: formDataDesignChange.comcontract_id,
                  rules: [
                    {
                      required: true,
                      message: '请输入合同名称',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toOriginContractSelect(treeOriginConData)}
                    onChange={this.toOriginSelect}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同编号">
                {getFieldDecorator('comcontract_sn', {
                  initialValue: formDataDesignChange.comcontract_sn,
                  rules: [
                    {
                      required: true,
                      message: '合同编号不能为空',
                    },
                  ],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="发起部门">
                {getFieldDecorator('launch_dept', {
                  initialValue: formDataDesignChange.launch_dept,
                  rules: [
                    {
                      required: true,
                      message: '请选择发起部门',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="string"
                    pcode="contract$#InitiatingDepartment"
                    placeholder="请选择"
                    selectProps={{ placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="发起人">
                {getFieldDecorator('launch_person', {
                  initialValue: formDataDesignChange.launch_person,
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
                {getFieldDecorator('modify_position', {
                  initialValue: formDataDesignChange.modify_position,
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
                {getFieldDecorator('reason', {
                  initialValue: formDataDesignChange.reason,
                  rules: [
                    {
                      required: true,
                      message: '请输入变更部位',
                    },
                  ],
                })(
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    options={changeList.sort(this.compare('value'))}
                    onChange={this.reasonChange}
                  ></Checkbox.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="其他原因">
                {getFieldDecorator('reason_other', {
                  initialValue: formDataDesignChange.reason_other,
                  rules: [
                    {
                      required: this.state.checkReason,
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
                {getFieldDecorator('content', {
                  initialValue: formDataDesignChange.content,
                  rules: [
                    {
                      required: true,
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
                {getFieldDecorator('cost_change', {
                  initialValue: formDataDesignChange.cost_change
                    ? formDataDesignChange.cost_change
                    : 1,
                  rules: [
                    {
                      required: false,
                      message: '请选择成本增减',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="int"
                    pcode="contract$#IncreaseDecrease"
                    placeholder="请选择"
                    selectProps={{ placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="估算金额">
                {getFieldDecorator('estimate', {
                  initialValue: formDataDesignChange.estimate,
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
                {getFieldDecorator('working_state', {
                  initialValue: formDataDesignChange.working_state
                    ? formDataDesignChange.working_state
                    : 1,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value={1}>已施工</Option>
                    <Option value={0}>未施工</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否已采购">
                {getFieldDecorator('purchase_state', {
                  initialValue: formDataDesignChange.purchase_state
                    ? formDataDesignChange.purchase_state
                    : 1,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value={1}>已采购</Option>
                    <Option value={0}>未采购</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="费用变化初判">
                {getFieldDecorator('cost_initial', {
                  initialValue: formDataDesignChange.cost_initial
                    ? formDataDesignChange.cost_initial
                    : 1,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否需报价">
                {getFieldDecorator('need_check', {
                  initialValue: formDataDesignChange.need_check
                    ? formDataDesignChange.need_check
                    : 1,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="发起日期">
                {getFieldDecorator('launch_date', {
                  initialValue: formDataDesignChange.launch_date? moment(formDataDesignChange.launch_date, 'YYYY-MM-DD'):'',
                  rules: [
                    {
                      required: false,
                      message: '请输入发起日期',
                    },
                  ],
                })(<DatePicker  format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="变更类型">
                {getFieldDecorator('alter_type', {
                  initialValue: formDataDesignChange.alter_type
                    ? formDataDesignChange.alter_type
                    : '1',
                  rules: [
                    {
                      required: false,
                      message: '请选择变更类型',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="string"
                    pcode="contract$#changeType"
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
                {getFieldDecorator('attas', {
                  initialValue: formDataDesignChange.attas,
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
