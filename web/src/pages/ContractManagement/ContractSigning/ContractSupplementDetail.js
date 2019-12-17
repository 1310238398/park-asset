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
} from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import FinishquotingModel from './FinishquotingModel';
import ContractPlanningSelect from './ContractPlanningSelect';
@connect(({ contractSupplement }) => ({
  contractSupplement,
}))
@Form.create()
class ContractSupplementDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
    this.state = {
      data: props.formData ? props.formData : {},
      plan: {},
      jCharge: [],
      // secondCity: cityData[provinceData[0]][0],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'contractSupplement/loadTree',
    });
    this.props.dispatch({
      type: 'contractSupplement/loadOriginConTree',
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('formData' in nextProps) {
      return { ...state, data: nextProps.formData ? nextProps.formData : {} };
    }
    return state;
  }
  // 点击ok
  handleDataFormSubmit = addlist => {};

  // 选择余额是否弹框
  rendeSelectModelForm() {
    const {
      contractSupplement: { formVisibleFinishquoting },
    } = this.props;
    return (
      <FinishquotingModel
        visible={formVisibleFinishquoting}
        onCancel={this.handleModelFormCancel}
        onSubmit={this.handleModelFormSubmit}
      />
    );
  }

  // 点击ok
  handleModelFormSubmit = addlist => {
    console.log(addlist);
    // 关闭窗口，调用后台数据
    this.props.dispatch({
      type: 'contractSupplement/saveFinishquotingData',
      payload: {
        visible: false,
        data: addlist,
      },
    });
  };
  // 合约规划是否引用完点击取消
  handleModelFormCancel = () => {
    this.props.dispatch({
      type: 'contractSupplement/changeFormVisibleFinishquoting',
      payload: false,
    });
  };

  // 合约规划是否引用完选择发生变化
  finishquotingSelect = value => {
    if (value === '1') {
      this.props.dispatch({
        type: 'contractSupplement/changeFormVisibleFinishquoting',
        payload: true,
      });
    }
  };

  onOKClick = () => {
    const {
      form,
      contractSupplement: { proData },
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

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 单位选择的数据
  toTreeSelect = data => {
    console.log(data);
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      newData.push(item);
      if (item.in_charge_list && item.in_charge_list.length > 0) {
        this.setState({
          jCharge: item.in_charge_list,
        });
      }
    }
    return newData;
  };

  // 单位选择的数据
  toOriginContractSelect = data => {
    console.log(data);
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      newData.push(item);
      if (item.in_charge_list && item.in_charge_list.length > 0) {
        this.setState({
          jCharge: item.in_charge_list,
        });
      }
    }
    return newData;
  };

  render() {
    const RadioGroup = Radio.Group;
    const {
      contractSupplement: {
        formVisibleSupplement,
        formTitleSupplement,
        formDataSupplement,
        submitting,
        formTypeSupplement,
        proData,
        proID,
        treeData,
        treeOriginConData
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { plan, jCharge } = this.state;
    console.log(this.props);
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
        title={formTitleSupplement}
        width={850}
        visible={formVisibleSupplement}
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
              <Form.Item {...formItemLayout} label="合同编号">
                {getFieldDecorator('sn')(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <p style={{ marginTop: '10px', color: 'red' }}>
                （注：本编号应为00000000000000000001-补1。）
              </p>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="原合同名称">
                {getFieldDecorator('parent_comcontract_name', {
                  initialValue: formDataSupplement.parent_comcontract_name,
                  rules: [
                    {
                      required: true,
                      message: '请输入原合同名称',
                    },
                  ],
                })(  
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.toOriginContractSelect(treeOriginConData)}
                  placeholder="请选择"
                />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同名称">
                {getFieldDecorator('name', {
                  initialValue: formDataSupplement.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入合同名称',
                    },
                  ],
                })(<Input placeholder="请输入合同名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同类别">
                {getFieldDecorator('category', {
                  initialValue: formDataSupplement.category,
                  rules: [
                    {
                      required: true,
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
              <Form.Item {...formItemLayout} label="合同规划">
                {getFieldDecorator('contract_planning_id', {
                  initialValue: formDataSupplement.contract_planning_id,
                  rules: [
                    {
                      required: false,
                      message: '请选择合约规划',
                    },
                  ],
                })(
                  <ContractPlanningSelect
                    proID={proID}
                    data={plan}
                    onChange={this.handleFormChange}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目">
                {getFieldDecorator('subject', {
                  initialValue: formDataSupplement.subject,
                  rules: [
                    {
                      required: true,
                      message: '请选择所属科目',
                    },
                  ],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目分项">
                {getFieldDecorator('subject_subitem', {
                  initialValue: formDataSupplement.subject_subitem,
                  rules: [
                    {
                      required: false,
                      message: '请选择所属科目',
                    },
                  ],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同预估金额">
                {getFieldDecorator('photo')(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="预估变更金额">
                {getFieldDecorator('photo')(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同金额">
                {getFieldDecorator('amount', {
                  initialValue: formDataSupplement.amount,
                  rules: [
                    {
                      required: true,
                      message: '请输入合同金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入合同金额" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout3} label="合约规划是否引用完">
                {getFieldDecorator('finishquoting', {
                  initialValue: formDataSupplement.finishquoting
                    ? formDataSupplement.finishquoting
                    : '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择" onSelect={this.finishquotingSelect}>
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同性质">
                {getFieldDecorator('property', {
                  initialValue: formDataSupplement.property,
                  rules: [
                    {
                      required: true,
                      message: '请选择合同性质',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="string"
                    pcode="contract$#contractNature"
                    placeholder="请选择"
                    selectProps={{ placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否结算">
                {getFieldDecorator('settlement', {
                  initialValue: formDataSupplement.settlement ? formDataSupplement.settlement : '0',
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
              <Form.Item {...formItemLayout} label="虚拟合同">
                {getFieldDecorator('virtual', {
                  initialValue: formDataSupplement.virtual ? formDataSupplement.virtual : '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择虚拟合同',
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
              <Form.Item {...formItemLayout} label="有效签约金额">
                {getFieldDecorator('vali_sign_amount', {
                  initialValue: formDataSupplement.vali_sign_amount,
                  rules: [
                    {
                      required: false,
                      message: '请输入有效签约金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入有效签约金额" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="甲方单位">
                {getFieldDecorator('jiafang', {
                  rules: [
                    {
                      required: true,
                      message: '请选择甲方单位',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toTreeSelect(treeData)}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="负责人">
                {getFieldDecorator('jiafang_sign', {
                  initialValue: formDataSupplement.jiafang_sign,
                  rules: [
                    {
                      required: false,
                      message: '请选择负责人',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {jCharge.map(jCharge => (
                      <Option key={jCharge}>{jCharge}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="乙方单位">
                {getFieldDecorator('yifang', {
                  initialValue: formDataSupplement.yifang,
                  rules: [
                    {
                      required: true,
                      message: '请选择乙方单位',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toTreeSelect(treeData)}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="负责人">
                {getFieldDecorator('yifang_sign', {
                  initialValue: formDataSupplement.yifang_sign,
                  rules: [
                    {
                      required: false,
                      message: '请输入负责人',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {jCharge.map(jCharge => (
                      <Option key={jCharge}>{jCharge}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="丙方单位">
                {getFieldDecorator('bingfang', {
                  initialValue: formDataSupplement.bingfang,
                  rules: [
                    {
                      required: false,
                      message: '请输入丙方单位',
                    },
                  ],
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toTreeSelect(treeData)}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="负责人">
                {getFieldDecorator('bingfang_sign', {
                  initialValue: formDataSupplement.bingfang_sign,
                  rules: [
                    {
                      required: false,
                      message: '请输入负责人',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {jCharge.map(jCharge => (
                      <Option key={jCharge}>{jCharge}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="不计成本金额">
                {getFieldDecorator('uncost_amount', {
                  initialValue: formDataSupplement.uncost_amount,
                  rules: [
                    {
                      required: false,
                      message: '请输入不计成本金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入不计成本金额" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="甲供材料金额">
                {getFieldDecorator('jia_stuffs_amount', {
                  initialValue: formDataSupplement.jia_stuffs_amount,
                  rules: [
                    {
                      required: false,
                      message: '请输入甲供材料金额',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入甲供材料金额" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="付款方式">
                {getFieldDecorator('pay_type', {
                  initialValue: formDataSupplement.pay_type,
                  rules: [
                    {
                      required: true,
                      message: '请选择付款方式',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="string"
                    pcode="contract$#PaymentMethod"
                    placeholder="请选择"
                    selectProps={{ placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="付款条件">
                {getFieldDecorator('pay_precondition', {
                  initialValue: formDataSupplement.pay_precondition,
                  rules: [
                    {
                      required: false,
                      message: '请输入付款条件',
                    },
                  ],
                })(<Input.TextArea rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="合同内容">
                {getFieldDecorator('content', {
                  initialValue: formDataSupplement.content,
                  rules: [
                    {
                      required: false,
                      message: '请输入合同内容',
                    },
                  ],
                })(<Input.TextArea rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('remark', {
                  initialValue: formDataSupplement.remark,
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
                  initialValue: formDataSupplement.memo,
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
        {this.rendeSelectModelForm()}
      </Modal>
    );
  }
}

export default ContractSupplementDetail;
