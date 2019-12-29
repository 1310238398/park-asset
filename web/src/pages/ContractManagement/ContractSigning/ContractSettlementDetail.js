import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Modal, Input, InputNumber, Select, DatePicker, Row, Col } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import DicShow from '@/components/DictionaryNew/DicShow';
import ContractSupplementAdd from './ContractSupplementAdd';
import UploadFile from '@/components/UploadFile/UploadFile';
const { Description } = DescriptionList;
import PicturesWall2 from '@/components/PicturesWall2/PicturesWall2';
import moment from 'moment';
@connect(({ contractSiging }) => ({
  contractSiging,
}))
@Form.create()
class ContractSettlementDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.state = {
      datas: {},
    };
  }


  // 点击确定
  onOKClick = () => {
    const { form, onSubmit } = this.props;
    const { datas } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        if (datas.record_id) {  
          formData.record_id = datas.record_id;
        }
        formData.report_date = formData.report_date
          ? moment(formData.report_date).format('YYYY-MM-DD')
          : '';
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 返回值
  callback = data => {
    let {
      dataSupplement,
      contractSiging: { formDataSettlement },
      form,
    } = this.props;
    const { datas } = this.state;
    if (!data) {
      this.props.form.resetFields();
      const arr = [];
      const any = [];
      let len;
      if (dataSupplement.list && dataSupplement.list.length) {
        dataSupplement.list.forEach(el => {
          arr.push(el.report_no);
        });
        any.push({
          report_no: (Array(8).join(0) + (Math.max.apply(null, arr) + 1)).slice(-8),
        });
      }
      this.setState({ datas: any[0] });
    } else {
      this.setState({ datas: data });
    }
  };

  render() {
    let {
      contractSiging: { formVisibleSettlement, formDataSettlement, submitting, loadTakeEffectData },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
      dataSupplement,
    } = this.props;
    const { datas } = this.state;
    formDataSettlement = datas;

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
        title="合同结算"
        width={1000}
        visible={formVisibleSettlement}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card title="合同基本信息">
          <DescriptionList title="" size="large" col={3}>
            <Description term="合同名称">{loadTakeEffectData.name}</Description>
            <Description term="合同编号">{loadTakeEffectData.sn}</Description>
            <Description term="合同类别">
              {
                <DicShow
                  pcode="contract$#contractNature"
                  code={[loadTakeEffectData.property]}
                  show={name}
                />
              }
            </Description>
            <Description term="所属科目">{loadTakeEffectData.subject}</Description>
            <Description term="合同性质">
              {
                <DicShow
                  pcode="contract$#contractNature"
                  code={[loadTakeEffectData.property]}
                  show={name}
                />
              }
            </Description>
            <Description term="甲方单位">{loadTakeEffectData.jiafang_name}</Description>
            <Description term="乙方单位">{loadTakeEffectData.yifang_name}</Description>
            <Description term="丙方单位">{loadTakeEffectData.bingfang_name}</Description>
            <Description term="当前状态">
              {
                <DicShow
                  pcode="contract$#ContractStatus"
                  code={[loadTakeEffectData.status]}
                  show={name}
                />
              }
            </Description>
            <Description term="生效时间">{loadTakeEffectData.sign_date}</Description>
            <Description term="合同金额（含甲供材）">{loadTakeEffectData.amount}</Description>
            <Description term="甲供材金额">{loadTakeEffectData.jia_stuffs_amount}</Description>
          </DescriptionList>
        </Card>
        <Card title="结算信息" style={{ marginTop: 20 }}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="报告编号">
                  {getFieldDecorator('report_no', {
                    initialValue: formDataSettlement.report_no,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="报告名称">
                  {getFieldDecorator('report_name', {
                    initialValue: formDataSettlement.report_name,
                    rules: [
                      {
                        required: true,
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
                  {getFieldDecorator('songshen', {
                    initialValue: formDataSettlement.songshen,
                    rules: [
                      {
                        required: true,
                        message: '请输入送审值',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="甲供金额">
                  {getFieldDecorator('songshen_jiagongg', {
                    initialValue: formDataSettlement.songshen_jiagongg,
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
                <Form.Item {...formItemLayout} label="审定值">
                  {getFieldDecorator('shending', {
                    initialValue: formDataSettlement.shending,
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
                  {getFieldDecorator('shending_jiagong', {
                    initialValue: formDataSettlement.shending_jiagong,
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
                  {getFieldDecorator('shenjian_jiagong', {
                    initialValue: formDataSettlement.shenjian_jiagong,
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
                  {getFieldDecorator('shenjianlv', {
                    initialValue: formDataSettlement.shenjianlv,
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
                  {getFieldDecorator('yishen', {
                    initialValue: formDataSettlement.yishen,
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
                  {getFieldDecorator('yishen_jiagong', {
                    initialValue: formDataSettlement.yishen_jiagong,
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
                <Form.Item {...formItemLayout} label="最终审定值">
                  {getFieldDecorator('zuizhong', {
                    initialValue: formDataSettlement.zuizhong,
                    rules: [
                      {
                        required: true,
                        message: '请输入最终审定值',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入最终审定值" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="甲供金额">
                  {getFieldDecorator('zuizhong_jiagong', {
                    initialValue: formDataSettlement.zuizhong_jiagong,
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
                <Form.Item {...formItemLayout3} label="造价咨询单位">
                  {getFieldDecorator('zaojiazixun', {
                    initialValue: formDataSettlement.zaojiazixun,
                    rules: [
                      {
                        required: true,
                        message: '请输入造价咨询单位',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="经办人">
                  {getFieldDecorator('zaojiazixun_jingban', {
                    initialValue: formDataSettlement.zaojiazixun_jingban,
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
                  {getFieldDecorator('report_date', {
                    initialValue: formDataSettlement.report_date,
                    rules: [
                      {
                        required: false,
                        message: '请选择报告日期',
                      },
                    ],
                  })
                  // (<DatePicker style={{ width: '100%' }} placeholder="请选择报告日期" />)
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="份数">
                  {getFieldDecorator('copies', {
                    initialValue: formDataSettlement.copies,
                    rules: [
                      {
                        required: false,
                        message: '请输入份数',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入份数" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="存档号">
                  {getFieldDecorator('archive_sn', {
                    initialValue: formDataSettlement.archive_sn,
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
                  {getFieldDecorator('is_done', {
                    initialValue: formDataSettlement.is_done ? formDataSettlement.is_done : '0',
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
            {/* <Row>
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
                  })(<UploadFile bucket="contract" />)}
                </Form.Item>
              </Col>
            </Row> */}
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <ContractSupplementAdd
            ref={this.custom}
            formID={loadTakeEffectData.record_id}
            callback={this.callback}
          />
        </Card>
      </Modal>
    );
  }
}

export default ContractSettlementDetail;
