import React, { PureComponent } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Icon,
  InputNumber,
  DatePicker,
  Divider,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import PicturesWall from '../../../components/PicturesWall/PicturesWall';

@connect(({ menu }) => ({
  menu,
}))
@Form.create()
class AgreementInfo extends PureComponent {
  render() {
    const horizontalItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const RadioGroup = Radio.Group;
    const {
      menu: { formData },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row>
            <Col span={8}>
              <Form.Item {...horizontalItemLayout} label="合同编号:">
                {getFieldDecorator('contractnumber', {
                  initialValue: formData.name ? formData.name : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入合同编号',
                    },
                  ],
                })(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{ borderRight: '1px solid #eeeeee' }}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={
                      <span>
                        合同照片(只需上传证明该房源
                        <br />
                        的合同信息即可，最多9张)
                      </span>
                    }
                  >
                    {getFieldDecorator('contractpic', {
                      initialValue: formData.photo ? [formData.photo] : '',
                      rules: [
                        {
                          required: true,
                          message: '请上传',
                        },
                      ],
                    })(<PicturesWall num={9} bucket="park" listType="picture-card" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label={<span>租金计算方式</span>}>
                    {getFieldDecorator('rentType', {
                      initialValue: formData.photo ? [formData.photo] : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        },
                      ],
                    })(
                      <RadioGroup>
                        <Radio value={20}>日租金</Radio>
                        <Radio value={10}>月租金</Radio>
                      </RadioGroup>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4} style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Tooltip
                    title={
                      <span>
                        1、 月租金计算方式：季度基本租金=日租金标准×365天×该商铺租赁面积÷12个月
                        <br />
                        2、季度基本租金计算方式:季度基本租金=日租金标准×365天×该商铺租赁面积÷12个月×3个月
                        <br />
                        3、年基本租金计算方式:年基本租金=日租金标准×365天×该商铺租赁面积
                        <br />
                        4、租赁保证金计算方式:租赁保证金=日租金标准×365天×该商铺租赁面积÷12个月×2个月{' '}
                        <br />
                        5、所有数据按逢数进位原则计算
                      </span>
                    }
                  >
                    <Icon type="question-circle" />
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="日租金(元/m2/天)"
                    {...horizontalItemLayout}
                    style={{
                      display: getFieldValue('rentType') === 20 ? 'block' : 'none',
                    }}
                  >
                    {getFieldDecorator('rentDayValue', {
                      initialValue: formData.dayRent ? [formData.dayRent] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<InputNumber placeholder="1-9999.99的数字" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="月租金(元/月)"
                    {...horizontalItemLayout}
                    style={{
                      display: getFieldValue('rentType') === 10 ? 'block' : 'none',
                    }}
                  >
                    {getFieldDecorator('rentMonthValue', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<InputNumber placeholder="1-9999.99的数字" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="缴费周期(月)" {...horizontalItemLayout}>
                    {getFieldDecorator('payCycle', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入周期',
                        },
                      ],
                    })(<InputNumber placeholder="1-99整数" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="提前付款天数(天)" {...horizontalItemLayout}>
                    {getFieldDecorator('payPreDays', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入天数',
                        },
                      ],
                    })(<InputNumber placeholder="1-99整数" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item label="租赁开始日期" {...horizontalItemLayout}>
                    {getFieldDecorator('startTime', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入开始时间',
                        },
                      ],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="租赁结束日期" {...horizontalItemLayout}>
                    {getFieldDecorator('endTime', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入结束时间',
                        },
                      ],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="是否有免租期" {...horizontalItemLayout}>
                    {getFieldDecorator('isFreeRent', {
                      initialValue: formData.photo ? [formData.photo] : '',
                      rules: [
                        {
                          required: true,
                          message: '请选择',
                        },
                      ],
                    })(
                      <RadioGroup>
                        <Radio value={30}>是</Radio>
                        <Radio value={40}>否</Radio>
                      </RadioGroup>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="免租截止日期"
                    {...horizontalItemLayout}
                    style={{
                      display: getFieldValue('isFreeRent') === 30 ? 'block' : 'none',
                    }}
                  >
                    {getFieldDecorator('freeEndTime', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '免租截止日期',
                        },
                      ],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="合同签署日期" {...horizontalItemLayout}>
                    {getFieldDecorator('signTime', {
                      initialValue: formData.monthValue ? [formData.monthValue] : '',
                      rules: [
                        {
                          required: true,
                          message: '请输入合同签署日期',
                        },
                      ],
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <h1>押金信息</h1>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="应缴金额(元)" {...horizontalItemLayout}>
                {getFieldDecorator('amountPay', {
                  initialValue: formData.monthValue ? [formData.monthValue] : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<InputNumber />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="实缴金额(元)" {...horizontalItemLayout}>
                {getFieldDecorator('paidMoney', {
                  initialValue: formData.monthValue ? [formData.monthValue] : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<InputNumber />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="收据照片" {...horizontalItemLayout}>
                {getFieldDecorator('receiptpic', {
                  initialValue: formData.photo ? [formData.photo] : '',
                  rules: [
                    {
                      required: true,
                      message: '请上传',
                    },
                  ],
                })(
                  <PicturesWall
                    num={1}
                    {...horizontalItemLayout}
                    bucket="park"
                    listType="picture-card"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
export default AgreementInfo;
