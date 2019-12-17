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
  Cascader,
} from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
import FinishquotingModel from './FinishquotingModel';
import ContractPlanningSelect from './ContractPlanningSelect';

@connect(({ contractSiging }) => ({
  contractSiging,
}))
@Form.create()
class ContractSigningDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      estimated_amount: null,
      estimated_change: null,
      subject_subitem: undefined,
      subject: undefined,
      value: undefined,
      plan: {},
      jCharge: [],
      options: [],
      fileList: [],
      // secondCity: cityData[provinceData[0]][0],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'contractSiging/loadTree',
    });
  }
  // 选择合约规划弹框
  onSelectClick = () => {
    this.props.dispatch({
      type: 'contractSiging/changeFormVisiblePlanning',
      payload: true,
    });
  };

  // 甲方单位模糊匹配
  handleChangePro = e => {
    this.setState({ project_id: e });
    this.dispatch({
      type: 'contractSiging/saveProjectID',
      payload: e,
    });
  };

  // // 选择余额处理方式
  rendeSelectModelForm() {
    const {
      contractSiging: { formVisibleFinishquoting },
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
    // 关闭窗口，调用后台数据
    this.props.dispatch({
      type: 'contractSiging/saveFinishquotingData',
      payload: {
        visible: false,
        data: addlist,
      },
    });
  };

  // 合约规划是否引用完点击取消
  handleModelFormCancel = () => {
    this.props.dispatch({
      type: 'contractSiging/changeFormVisibleFinishquoting',
      payload: false,
    });
  };

  onOKClick = () => {
    const { form, proID, onSubmit, formTypeSiging } = this.props;
    const {subject,subject_subitem} = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = formData.project_id ? formData.project_id : proID;
        formData.subject = subject;
        formData.subject_subitem = subject_subitem;
        // 合同附件修改上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            if (formTypeSiging === 'E') {
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

  // 合约规划是否引用完选择发生变化
  contract_planning_doneSelect = value => {
    if (value === 1) {
      this.props.dispatch({
        type: 'contractSiging/changeFormVisibleFinishquoting',
        payload: true,
      });
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 合约规划选择
  handleFormChange = (fields, item) => {
    const {
      contractSiging: { formDataSiging },
    } = this.props;
    let cost_name_path = [];
    if (item.cost_name_path) {
      cost_name_path = item.cost_name_path.split('/');
      if (cost_name_path && cost_name_path.length > 0) {
        this.setState({ subject: cost_name_path[0] });
        this.setState({ subject_subitem: cost_name_path[cost_name_path.length - 1] });
      }
    }
    this.setState({ estimated_amount: item.planning_price });
    this.setState({ estimated_change: item.planning_change });
    this.setState({
      plan: {
        cost_id: item.cost_id,
        name: fields,
      },
    });
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

  render() {
    const {
      contractSiging: {
        formVisibleSiging,
        formTitleSiging,
        formDataSiging,
        submitting,
        formTypeSiging,
        proData,
        treeData,
        dataOptions,
      },
      form: { getFieldDecorator, getFieldValue },
      proID,
      onCancel,
    } = this.props;
    const {
      plan,
      jCharge,
      estimated_amount,
      estimated_change,
      subject,
      subject_subitem,
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
        title={formTitleSiging}
        width={850}
        visible={formVisibleSiging}
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
              <Form.Item {...formItemLayout} label="合同名称">
                {getFieldDecorator('name', {
                  initialValue: formDataSiging.name,
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
                  initialValue: formDataSiging.category,
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
                  initialValue: formDataSiging.contract_planning_id,
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
                  // <Cascader
                  //   options={this.toPlanningSelect(dataOptions)}
                  //   loadData={this.loadData}
                  //   onChange={this.handleFormChange}
                  //   placeholder="请选择"
                  //   changeOnSelect
                  // />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目">
                {subject}
                {/* {getFieldDecorator('subject', {
                  initialValue: formDataSiging.subject,
                  rules: [
                    {
                      required: false,
                      message: '请选择所属科目',
                    },
                  ],
                })(<Input disabled />)} */}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属科目分项">
                {subject_subitem}
                {/* {getFieldDecorator('subject_subitem', {
                  initialValue: formDataSiging.subject_subitem,
                  rules: [
                    {
                      required: false,
                      message: '请选择所属科目',
                    },
                  ],
                })(<Input disabled />)} */}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同预估金额">
                {/* <Input defaultValue={estimated_amount}  disabled/> */}
                {estimated_amount}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="预估变更金额">
                {estimated_change}
                {/* <Input defaultValue={estimated_change}  disabled/> */}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="合同金额">
                {getFieldDecorator('amount', {
                  initialValue: formDataSiging.amount,
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
                {getFieldDecorator('contract_planning_done', {
                  initialValue: formDataSiging.contract_planning_done
                    ? formDataSiging.contract_planning_done
                    : 0,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择" onSelect={this.contract_planning_doneSelect}>
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
                  initialValue: formDataSiging.property,
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
                  initialValue: formDataSiging.settlement ? formDataSiging.settlement : 0,
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
                  initialValue: formDataSiging.virtual ? formDataSiging.virtual : '0',
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
                  initialValue: formDataSiging.vali_sign_amount,
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
                  initialValue: formDataSiging.jiafang_sign,
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
                  initialValue: formDataSiging.yifang,
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
                  initialValue: formDataSiging.yifang_sign,
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
                  initialValue: formDataSiging.bingfang,
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
                  initialValue: formDataSiging.bingfang_sign,
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
                  initialValue: formDataSiging.uncost_amount,
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
                  initialValue: formDataSiging.jia_stuffs_amount,
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
                  initialValue: formDataSiging.pay_type,
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
                  initialValue: formDataSiging.pay_precondition,
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
                  initialValue: formDataSiging.content,
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
                  initialValue: formDataSiging.remark,
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
                  initialValue: formDataSiging.attas,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<UploadFile bucket="contract" fileList={this.state.fileList} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* {this.renderDataForm()} */}
        {this.rendeSelectModelForm()}
      </Modal>
    );
  }
}

export default ContractSigningDetail;
