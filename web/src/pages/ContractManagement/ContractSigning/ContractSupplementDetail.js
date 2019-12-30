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
import PicturesWall2 from '@/components/PicturesWall2/PicturesWall2';
import UploadFile from '@/components/UploadFile/UploadFile';
import ContractPlanningSelect from './ContractPlanningSelect';

import { getSigingOne } from '@/services/contractSiging';

@connect(({ contractSiging }) => ({
  contractSiging,
}))
@Form.create()
class ContractSupplementDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      estimated_amount: null,
      estimated_change: null,
      subject_subitem: undefined,
      subject: undefined,
      value: undefined,
      plan: {},
      // 甲方单位
      jCharge: [],
      options: [],
      fileList: [],
      comData: [],
      hygh_id: '',
      jfCheck:false,
      yfCheck:false,
      bfCheck:false
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'contractSiging/fetchTree',
    });
    this.props.dispatch({
      type: 'contractSiging/fetchOriginConTree',
    });
  }

  // 点击确定
  onOKClick = () => {
    const {
      form,
      proID,
      onSubmit,
      formTypeSupplement,
      contractSiging: { planName },
    } = this.props;
    const { subject, subject_subitem, comData } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = formData.project_id ? formData.project_id : proID;
        formData.parent_comcontract_id = comData.record_id;
        formData.contract_planning_id = planName;
        formData.parent_comcontract_name = comData.name;
        formData.subject = comData.subject;
        formData.subject_subitem = comData.subject_subitem;
        // 合同附件修改上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            if (formTypeSupplement === 'E') {
              urlArr.push({
                url: ele.URL,
              });
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

  // 单位选择的数据
  toTreeSelect = data => {
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
      this.setState({ comData: data });
      this.dispatch({
        type: 'contractSiging/fetchDesiginOne',
        payload: data,
      });
    });
  };
  // 合同性质发生变化
  propertyChange = value => {
    // 如果是三方合同，都选
    if (value === '2') {
      this.setState({ jfCheck: true });
      this.setState({ yfCheck: true });
      this.setState({ bfCheck: true });
    } else if (value === '1') {
      this.setState({ jfCheck: true });
      this.setState({ yfCheck: true });
      this.setState({ bfCheck: false });
    } else {
      this.setState({ jfCheck: false });
      this.setState({ yfCheck: false });
      this.setState({ bfCheck: false });
    }
  };

  render() {
    let {
      contractSiging: {
        formVisibleSupplement,
        formTitleSupplement,
        formDataSupplement,
        submitting,
        formTypeSupplement,
        proData,
        treeData,
        treeOriginConData,
        planName,
        selectPlanName,
        hyList,
      },
      proID,
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const {
      plan,
      jCharge,
      estimated_amount,
      estimated_change,
      subject,
      subject_subitem,
      contract_planning_id,
      formDatas,
      comData,
    } = this.state;
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
        width={960}
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
                {getFieldDecorator('sn', {
                  initialValue: formDataSupplement.sn,
                  rules: [
                    {
                      required: false,
                      message: '请输入合同编号',
                    },
                  ],
                })(<Input placeholder="请输入合同编号" />)}
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
                {getFieldDecorator('parent_comcontract_id', {
                  initialValue: formDataSupplement.parent_comcontract_id,
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
                    onChange={this.toOriginSelect}
                    placeholder="请选择"
                  />
                )}
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
              <Form.Item {...formItemLayout} label="合约规划">
                {planName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目">
                {comData.subject ? comData.subject : formDataSupplement.subject}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目分项">
                {comData.subject_subitem
                  ? comData.subject_subitem
                  : formDataSupplement.subject_subitem}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同预估金额">
                {hyList.planning_price}
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item {...formItemLayout} label="预估变更金额">
                {getFieldDecorator('photo')(<Input disabled />)}
              </Form.Item>
            </Col> */}
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
              <Form.Item {...formItemLayout3} label="是否还有并列合同">
                {getFieldDecorator('finishquoting', {
                  initialValue: formDataSupplement.finishquoting
                    ? formDataSupplement.finishquoting
                    : 1,
                  rules: [
                    {
                      required: true,
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
                    onChange={this.propertyChange }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="是否结算">
                {getFieldDecorator('settlement', {
                  initialValue: formDataSupplement.settlement ? formDataSupplement.settlement : 0,
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
                  initialValue: formDataSupplement.jiafang,
                  rules: [
                    {
                      required: this.state.jfCheck,
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
                      required: this.state.jfCheck,
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
                      required: this.state.yfCheck,
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
                      required: this.state.yfCheck,
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
                      required: this.state.bfCheck,
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
                      required: this.state.bfCheck,
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
        {/* {this.rendeSelectModelForm()} */}
      </Modal>
    );
  }
}

export default ContractSupplementDetail;
