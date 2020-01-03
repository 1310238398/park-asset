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
import UploadFile from '@/components/UploadFile/UploadFile';
import * as styles from './ContractChange.less';
import { getSigingOne } from '@/services/contractSiging';
import { getCompanyOne } from '@/services/contractVisaChange';
import { getDesignChangeOne } from '@/services/contractDesignChange';
import moment from 'moment';

@connect(({ visaChange }) => ({
  visaChange,
}))
@Form.create()
class VisaChangeDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      arrList: [],
      formDatas: [],
      designData: [],
      sgData: [],
      jlData: [],
      designCheck: false,
      reasonCheck: false,
      stateCheck: false,
    };
  }

  // 数组排序
  compare(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'visaChange/fetchTree',
    });
  }

  // 变更原因变化
  reasonChange = checkedValue => {
    if (checkedValue.indexOf('1') > -1) {
      this.setState({ designCheck: true });
    } else {
      this.setState({ designCheck: false });
    }

    if (checkedValue.indexOf('5') > -1) {
      this.setState({ reasonCheck: true });
    } else {
      this.setState({ reasonCheck: false });
    }
  };

  // 点击确认
  onOKClick = () => {
    const {
      form,
      visaChange: { proID },
      onSubmit,

      formTypeVisaChange,
    } = this.props;
    const { formDatas, designData, sgData, jlData } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proID;
        if (formData.reason) {
          formData.reason = formData.reason.join(',');
        }
        if (formData.project_stage) {
          formData.project_stage = formData.project_stage.join(',');
        }
        if (formData.xianchangchengben) {
          formData.xianchangchengben = parseInt(formData.xianchangchengben, 10);
        }

        formData.comcontract_name = formDatas.name;
        // formData.comcontract_sn = formDatas.sn;
        formData.alter_design_name = designData.name;
        // formData.alter_design_sn = designData.sn;
        formData.working_name = sgData.name;
        formData.supervision_name = jlData.name;
        // 合同附件修改上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            if (formTypeVisaChange === 'E') {
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
      this.setState({ formDatas: data });
      if (data.sn) {
        this.props.form.setFieldsValue({
          comcontract_sn: data.sn,
        });
      } else {
        this.props.form.setFieldsValue({
          comcontract_sn: '',
        });
      }
    });
  };
  //设计变更选择的数据
  toDesignContractSelect = data => {
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
  toDesignSelect = item => {
    getDesignChangeOne({
      record_id: item,
    }).then(data => {
      this.setState({ designData: data });
      if (data.sn) {
        this.props.form.setFieldsValue({
          alter_design_sn: data.sn,
        });
        this.props.form.setFieldsValue({
          alter_design_name: data.name,
        });
      } else {
        this.props.form.setFieldsValue({
          alter_design_sn: '',
        });
        this.props.form.setFieldsValue({
          alter_design_name: '',
        });
      }
    });
  };
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
  // 施工单位选中之后的变化
  toSTreeSelect = item => {
    getCompanyOne({
      record_id: item,
    }).then(data => {
      this.setState({ sgData: data });
    });
  };
  // 监理单位选中之后的变化
  toJTreeSelect = item => {
    getCompanyOne({
      record_id: item,
    }).then(data => {
      this.setState({ jlData: data });
    });
  };
  // 选择项目阶段变化
  projectStageChange = value => {
    if (value.indexOf('8') > -1) {
      this.setState({ stateCheck: true });
    } else {
      this.setState({ stateCheck: false });
    }
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
        treeOriginConData,
        designTreeData,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { formDatas, designData } = this.state;
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
        width={1400}
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
                  {getFieldDecorator('sn', {
                    initialValue: formDataVisaChange.sn,
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
                  {getFieldDecorator('name', {
                    initialValue: formDataVisaChange.name,
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
                    initialValue: formDataVisaChange.comcontract_id,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
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
                    initialValue: formDataVisaChange.comcontract_sn,
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
                <Form.Item {...formItemLayout} label="施工单位">
                  {getFieldDecorator('working_company', {
                    initialValue: formDataVisaChange.working_company,
                    rules: [
                      {
                        required: false,
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="监理单位">
                  {getFieldDecorator('supervision_company', {
                    initialValue: formDataVisaChange.supervision_company,
                    rules: [
                      {
                        required: false,
                        message: '请选择监理单位',
                      },
                    ],
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toTreeSelect(treeData)}
                      onChange={this.toJTreeSelect}
                      placeholder="请选择"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证类型">
                  {getFieldDecorator('alter_sign_type', {
                    initialValue: formDataVisaChange.alter_sign_type,
                    rules: [
                      {
                        required: false,
                        message: '请选择签证类型',
                      },
                    ],
                  })(
                    <DicSelect
                      vmode="string"
                      pcode="contract$#SignType"
                      placeholder="请选择"
                      selectProps={{ placeholder: '请选择' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="分部工程名称">
                  {getFieldDecorator('subsection_name', {
                    initialValue: formDataVisaChange.subsection_name,
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
                  {getFieldDecorator('reason', {
                    initialValue: formDataVisaChange.reason,
                    rules: [
                      {
                        required: true,
                        message: '请输入签证原因',
                      },
                    ],
                  })(
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      options={visaChangeList.sort(this.compare('value'))}
                      onChange={this.reasonChange}
                    ></Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设计变更名称">
                  {getFieldDecorator('alter_design_id', {
                    initialValue: formDataVisaChange.alter_design_id,
                    rules: [
                      {
                        required: this.state.designCheck,
                        message: '请选择设计变更名称',
                      },
                    ],
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toDesignContractSelect(designTreeData)}
                      onChange={this.toDesignSelect}
                      placeholder="请选择"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="设计变更编号">
                  {getFieldDecorator('alter_design_sn', {
                    initialValue: formDataVisaChange.alter_design_sn,
                    rules: [
                      {
                        required: this.state.designCheck,
                        message: '设计变更编号不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="其他原因">
                  {getFieldDecorator('reason_other', {
                    initialValue: formDataVisaChange.reason_other,
                    rules: [
                      {
                        required: this.state.reasonCheck,
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
                  {getFieldDecorator('content', {
                    initialValue: formDataVisaChange.content,
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
                  {getFieldDecorator('estimate', {
                    initialValue: formDataVisaChange.estimate,
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
                  {getFieldDecorator('working_company_charge', {
                    initialValue: formDataVisaChange.working_company_charge,
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
                  {getFieldDecorator('project_stage', {
                    initialValue: formDataVisaChange.project_stage,
                    rules: [
                      {
                        required: false,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      options={porjectList.sort(this.compare('value'))}
                      onChange={this.projectStageChange}
                    ></Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="项目阶段其他原因">
                  {getFieldDecorator('project_stage_other', {
                    initialValue: formDataVisaChange.project_stage_other,
                    rules: [
                      {
                        required: this.state.stateCheck,
                        message: '请选择',
                      },
                    ],
                  })(
                   <Input />
                  )}
                </Form.Item>
              </Col>
            </Row> */}
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="发起部门">
                  {getFieldDecorator('launch_dept', {
                    initialValue: formDataVisaChange.launch_dept,
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
                    initialValue: formDataVisaChange.launch_person,
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
                  {getFieldDecorator('launch_date', {
                    initialValue: formDataVisaChange.launch_date
                      ? moment(formDataVisaChange.launch_date, 'YYYY-MM-DD')
                      : '',
                    rules: [
                      {
                        required: false,
                        message: '请输入发起日期',
                      },
                    ],
                  })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
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
                  {getFieldDecorator('shejitu', {
                    initialValue: formDataVisaChange.shejitu ? formDataVisaChange.shejitu : 1,
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
              <Col
                span={3}
                style={{ width: '10.5%', margin: '10px 0 10px 30px', color: 'rgba(0, 0, 0, 0.85)' }}
              >
                <label>现场项目部意见：</label>
              </Col>
              <Col span={10}>
                <Form.Item {...formItemLayout} label="成本增减">
                  {getFieldDecorator('xianchangchengben', {
                    initialValue: formDataVisaChange.xianchangchengben
                      ? formDataVisaChange.xianchangchengben
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
              <Col span={10}>
                <Form.Item {...formItemLayout} label="估算金额">
                  {getFieldDecorator('xianchanggusuan', {
                    initialValue: formDataVisaChange.xianchanggusuan,
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
                  {getFieldDecorator('attas', {
                    initialValue: formDataVisaChange.attas,
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
