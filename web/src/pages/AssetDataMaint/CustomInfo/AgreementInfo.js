import React, { PureComponent } from 'react';
import { Form, Card, Row, Col, Input, Button } from 'antd';
import { connect } from 'dva';
import PicturesWall from '../../../components/PicturesWall/PicturesWall';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 6 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 6 },
    lg: { span: 12 },
  },
};

@connect(({ menu }) => ({
  menu,
}))
@Form.create()
class AgreementInfo extends PureComponent {
  render() {
    const {
      menu: { formData },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form className="agreementinfo-form">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="合同编号:">
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
            <Col span={8}>
              <Form.Item label="合同编号:">
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
            <Col span={8}>
              <Form.Item>
                <Button>生成租金明细</Button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              {/* <Form.Item
                {...formItemLayout}
                label="合同照片:（只需上传证明该房源已被出租的合同信息即可，可多张）"
              ></Form.Item> */}
              <Form.Item {...formItemLayout}>
                {getFieldDecorator('contractpic', {
                  initialValue: formData.photo ? [formData.photo] : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(<PicturesWall num={9} bucket="park" listType="picture-card" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
export default AgreementInfo;
