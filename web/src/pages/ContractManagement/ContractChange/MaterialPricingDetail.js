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
import * as styles from './ContractChange.less';
import MaterialPricingAddTable from './MaterialPricingAddTable';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import UploadFile from '@/components/UploadFile/UploadFile';
import { getSigingOne } from '@/services/contractSiging';
import { getDesignChangeOne } from '@/services/contractDesignChange';
import { getVisaChangeOne, getCompanyOne } from '@/services/contractVisaChange';
import moment from 'moment';
@connect(({ materialPricing }) => ({
  materialPricing,
}))
@Form.create()
class MaterialPricingDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
    this.state = {
      value: undefined,
      formDatas: [],
      com_name: '',
      designData: [],
      signData: [],
      sgData: [],
      designCheck: false,
      visaCheck: false,
      reasonCheck: false,
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
      type: 'materialPricing/fetchTree',
    });
  }
  // 点击确定
  onOKClick = () => {
    const {
      form,
      materialPricing: { proID },
      formTypeMaterialPricing,
      onSubmit,
    } = this.props;
    const { formDatas, designData, signData, sgData } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proID;
        if (formData.reason) {
          formData.reason = formData.reason.join(',');
        }
        formData.comcontract_name = formDatas.name;
        // formData.comcontract_sn = formDatas.sn;
        formData.alter_design_name = designData.name;
        // formData.alter_design_sn = designData.sn;
        formData.alter_sign_name = signData.name;
        // formData.alter_sign_sn = signData.sn;
        formData.working_name = sgData.name;
        // 合同附件修改上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            if (formTypeMaterialPricing === 'E') {
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

  // 是否还有并列合同选择发生变化
  finishquotingSelect = value => {
    if (value === '1') {
      this.props.dispatch({
        type: 'materialPricing/changeFormVisibleFinishquoting',
        payload: true,
      });
    }
  };

  // 变更原因变化
  reasonChange = checkedValue => {
    if (checkedValue.indexOf('1') > -1) {
      this.setState({ designCheck: true });
    } else {
      this.setState({ designCheck: false });
    }
    if (checkedValue.indexOf('2') > -1) {
      this.setState({ visaCheck: true });
    } else {
      this.setState({ visaCheck: false });
    }

    if (checkedValue.indexOf('5') > -1) {
      this.setState({ reasonCheck: true });
    } else {
      this.setState({ reasonCheck: false });
    }
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
      } else {
        this.props.form.setFieldsValue({
          alter_design_sn: '',
        });
      }
    });
  };
  //材料批价变更选择的数据
  toSignContractSelect = data => {
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
  toSignSelect = item => {
    getVisaChangeOne({
      record_id: item,
    }).then(data => {
      this.setState({ signData: data });
      if (data.sn) {
        this.props.form.setFieldsValue({
          alter_sign_sn: data.sn,
        });
      } else {
        this.props.form.setFieldsValue({
          alter_sign_sn: '',
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
  // 选中之后的变化
  toSTreeSelect = item => {
    getCompanyOne({
      record_id: item,
    }).then(data => {
      this.setState({ sgData: data });
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      materialPricing: {
        formVisibleMaterialPricing,
        formTitleMaterialPricing,
        formDataMaterialPricing,
        submitting,
        formTypeMaterialPricing,
        proData,
        treeData,
        materialPricingList,
        treeOriginConData,
        designTreeData,
        signTreeData,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { formDatas, designData, signData } = this.state;
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
        title={formTitleMaterialPricing}
        width={1200}
        visible={formVisibleMaterialPricing}
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
                <Form.Item {...formItemLayout} label="申请材料批价名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataMaterialPricing.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入申请材料批价名称',
                      },
                    ],
                  })(<Input placeholder="请输入申请材料批价名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="批价编号">
                  {getFieldDecorator('sn', {
                    initialValue: formDataMaterialPricing.sn,
                    rules: [
                      {
                        required: false,
                        message: '请输入批价编号',
                      },
                    ],
                  })(<Input placeholder="请输入批价编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="合同名称">
                  {getFieldDecorator('comcontract_id', {
                    initialValue: formDataMaterialPricing.comcontract_id,
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
                    initialValue: formDataMaterialPricing.comcontract_sn,
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
                    initialValue: formDataMaterialPricing.working_company,
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
                <Form.Item {...formItemLayout} label="工程名称">
                  {getFieldDecorator('project_name', {
                    initialValue: formDataMaterialPricing.project_name,
                    rules: [
                      {
                        required: true,
                        message: '请输入工程名称',
                      },
                    ],
                  })(<Input placeholder="请输入工程名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.textAreaStyle}>
                <Form.Item {...formItemLayout2} label="批价原因">
                  {getFieldDecorator('reason', {
                    initialValue: formDataMaterialPricing.reason,
                    rules: [
                      {
                        required: true,
                        message: '请输入批价原因',
                      },
                    ],
                  })(
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      options={materialPricingList.sort(this.compare('value'))}
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
                    initialValue: formDataMaterialPricing.alter_design_id,
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
                    initialValue: formDataMaterialPricing.alter_design_sn,
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证变更名称">
                  {getFieldDecorator('alter_sign_id', {
                    initialValue: formDataMaterialPricing.alter_sign_id,
                    rules: [
                      {
                        required: this.state.visaCheck,
                        message: '请选择签证变更名称',
                      },
                    ],
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toSignContractSelect(signTreeData)}
                      onChange={this.toSignSelect}
                      placeholder="请选择"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="签证变更编号">
                  {getFieldDecorator('alter_sign_sn', {
                    initialValue: formDataMaterialPricing.alter_sign_sn,
                    rules: [
                      {
                        required: this.state.visaCheck,
                        message: '签证变更编号不能为空',
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
                    initialValue: formDataMaterialPricing.reason_other,
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="发起部门">
                  {getFieldDecorator('launch_dept', {
                    initialValue: formDataMaterialPricing.launch_dept,
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
                    initialValue: formDataMaterialPricing.launch_person,
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
                    initialValue: formDataMaterialPricing.launch_date? moment(formDataMaterialPricing.launch_date, 'YYYY-MM-DD'):'',
                    rules: [
                      {
                        required: false,
                        message: '请输入发起日期',
                      },
                    ],
                  })(<DatePicker  format="YYYY-MM-DD"  style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout2} label="规格说明">
                  {getFieldDecorator('quotes', {
                    initialValue: formDataMaterialPricing.quotes,
                    rules: [
                      {
                        required: false,
                        message: '请填写规格说明',
                      },
                    ],
                  })(<MaterialPricingAddTable />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="其他信息">
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('remark', {
                  initialValue: formDataMaterialPricing.remark,
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
                  initialValue: formDataMaterialPricing.attas,
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
        </Card>
      </Modal>
    );
  }
}

export default MaterialPricingDetail;
