import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Radio, Card } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';



@connect(({ menu }) => ({
  menu,
}))
@Form.create()
class CustomInfo extends PureComponent {
  state = {
    value: '1',
  };

  handleFormLayoutChange = value => {
    this.setState({ value: value.target.value });
  };

  render() {
    const {
      menu: { formData },
      form: { getFieldDecorator },
    } = this.props;

    const { value } = this.state;

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

    return (
      <Card>
        <Form className="custominfo-form">
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="租户类型">
                {getFieldDecorator('type', {
                  initialValue: formData.name ? formData.name : '1',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Radio.Group onChange={this.handleFormLayoutChange}>
                    <Radio.Button value="1">企业</Radio.Button>
                    <Radio.Button value="2">个人</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <h1>基本信息</h1>
          {value === '1' ? (
            <div>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="客户名称">
                    {getFieldDecorator('name', {
                      initialValue: formData.name,
                      rules: [
                        {
                          required: true,
                          message: '请输入企业名称',
                        },
                      ],
                    })(<Input placeholder="请输入企业名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="行业分类">
                    {getFieldDecorator('parent_id', {
                      initialValue: formData.parent_id,
                      rules: [
                        {
                          required: true,
                          message: '请输入行业分类',
                        },
                      ],
                    })(
                      <DicSelect
                        vmode="int"
                        pcode="pa$#industry"
                        placeholder="请选择"
                        selectProps={{ placeholder: '请选择' }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="联系人姓名">
                    {getFieldDecorator('contacts', {
                      initialValue: formData.contacts,
                      rules: [
                        {
                          required: true,
                          message: '请输入联系人姓名',
                        },
                      ],
                    })(<Input placeholder="请输入联系人姓名" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="联系人电话">
                    {getFieldDecorator('tel', {
                      initialValue: formData.tel,
                      rules: [
                        {
                          required: true,
                          message: '请输入联系人电话',
                        },
                      ],
                    })(<Input placeholder="请输入联系人电话" />)}
                  </Form.Item>
                </Col>
        
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item {...formItemLayout} label="邮箱号">
                    {getFieldDecorator('email', {
                      initialValue: formData.email,
                      rules: [
                        {
                          message: '请输入邮箱号',
                        },
                      ],
                    })(<Input placeholder="请输入邮箱号" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="联系人地址">
                    {getFieldDecorator('address', {
                      initialValue: formData.address,
                      rules: [
                        {
                          required: true,
                          message: '请输入联系人地址',
                        },
                      ],
                    })(<Input placeholder="请输入联系人地址" />)}
                  </Form.Item>
                </Col>
              </Row>
              <h1 style={{ marginTop: 10 }}>开票信息</h1>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="发票抬头">
                    {getFieldDecorator('invoice', {
                      initialValue: formData.invoice,

                      rules: [
                        {
                          required: true,
                          message: '请输入发票抬头',
                        },
                      ],
                    })(<Input placeholder="请输入发票抬头" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="税号">
                    {getFieldDecorator('duty', {
                      initialValue: formData.duty,
                      rules: [
                        {
                          required: true,
                          message: '请输入税号',
                        },
                      ],
                    })(<Input placeholder="请输入税号" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="开户行及账号">
                    {getFieldDecorator('account', {
                      initialValue: formData.account,
                      rules: [
                        {
                          required: true,
                          message: '请输入开户行及账号',
                        },
                      ],
                    })(<Input placeholder="请输入开户行及账号" />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="租户姓名">
                    {getFieldDecorator('minename', {
                      initialValue: formData.minename,
                      rules: [
                        {
                          required: true,
                          message: '请输入租户姓名',
                        },
                      ],
                    })(<Input placeholder="请输入租户姓名" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="租户电话">
                    {getFieldDecorator('minetel', {
                      initialValue: formData.minetel,
                      rules: [
                        {
                          required: true,
                          message: '请输入租户电话',
                        },
                      ],
                    })(<Input placeholder="请输入租户电话" />)}
                  </Form.Item>
                </Col>
               
              </Row>
              <Row>
              <Col span={12}>
                  <Form.Item {...formItemLayout} label="邮箱号">
                    {getFieldDecorator('mineemail', {
                      initialValue: formData.mineemail,
                      rules: [
                        {
                          message: '请输入邮箱号',
                        },
                      ],
                    })(<Input placeholder="请输入邮箱号" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formItemLayout} label="业主地址">
                    {getFieldDecorator('mineaddress', {
                      initialValue: formData.mineaddress,
                      rules: [
                        {
                          required: true,
                          message: '请输入业主地址',
                        },
                      ],
                    })(<Input placeholder="请输入业主地址" />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Card>
    );
  }
}
export default CustomInfo;
