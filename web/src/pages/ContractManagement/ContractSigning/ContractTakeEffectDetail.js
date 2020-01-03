import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Select, DatePicker, Row, Col, Card, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
const { Description } = DescriptionList;
import DicShow from '@/components/DictionaryNew/DicShow';
import UploadFile from '@/components/UploadFile/UploadFile';
import PicturesWall2 from '@/components/PicturesWall2/PicturesWall2';
import moment from 'moment';
@Form.create()
@connect(({ contractSiging }) => ({
  contractSiging,
}))
class ContractTakeEffectDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  // 点击确定
  onOKClick = () => {
    const { form, onSubmit, data } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.record_id = data.record_id;
        formData.sn = data.sn;
        formData.sign_date = formData.sign_date
          ? moment(formData.sign_date).format('YYYY-MM-DD')
          : '';
        // 合同附件上传格式
        const urlArr = [];
        if (formData.attas) {
          formData.attas.forEach(ele => {
            urlArr.push({
              url: ele,
            });
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

  render() {
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
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
    const {
      contractSiging: { formDataTakeEffect, submitting, loadTakeEffectData },
      visible,
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    formDataTakeEffect.attas = loadTakeEffectData.attas ? loadTakeEffectData.attas : [];
    return (
      <Modal
        title="合同生效"
        width={800}
        visible={visible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <DescriptionList title="" size="large" col={2} style={{ marginLeft: 45, marginBottom: 10 }}>
          <Description term="合同名称">{loadTakeEffectData.name}</Description>
          <Description term="合同编号">{loadTakeEffectData.sn}</Description>
          <Description term="合同类别">
            {' '}
            {
              <DicShow
                pcode="contract$#contractType"
                code={[loadTakeEffectData.category]}
                show={name}
              />
            }
          </Description>
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
          <Description term="负责人">{loadTakeEffectData.jiafang_sign}</Description>
          <Description term="乙方单位">{loadTakeEffectData.yifang_name}</Description>
          <Description term="负责人">{loadTakeEffectData.yifang_sign}</Description>
        </DescriptionList>
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="生效日期">
                {getFieldDecorator('sign_date', {
                  initialValue: formDataTakeEffect.sign_date
                    ? moment(formDataTakeEffect.sign_date, 'YYYY-MM-DD')
                    : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择生效日期',
                    },
                  ],
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                    placeholder="请选择生效日期"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('effect_remark', {
                  initialValue: formDataTakeEffect.effect_remark,
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
                  initialValue: formDataTakeEffect.attas,
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

export default ContractTakeEffectDetail;
