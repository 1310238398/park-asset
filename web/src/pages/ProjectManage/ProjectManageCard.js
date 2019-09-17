import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Tooltip, Icon, Radio } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import { checkPhoneNum } from '../../utils/utils';

@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
class ProjectManageCard extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      formData.status = parseInt(formData.status, 10);
      if (formData.logo && formData.logo.length > 0) {
        formData.logo = formData.logo.join('');
      } else {
        formData.logo = '';
      }
      onSubmit(formData);
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      park: { formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

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
    return (
      <Modal
        title={formTitle}
        width={800}
        visible={formVisible}
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
              <Form.Item {...formItemLayout} label="园区名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入园区名称',
                    },
                  ],
                })(<Input placeholder="请输入园区名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* 嵌入高德地图--经纬度 */}
              <Form.Item {...formItemLayout} label="位置">
                {getFieldDecorator('location', {
                  initialValue: formData.location,
                  rules: [
                    {
                      required: false,
                      message: '请输入位置',
                    },
                  ],
                })(
                  <Input
                    placeholder="请输入位置"
                    suffix={
                      <Tooltip title="地图选取位置">
                        <Icon type="environment" style={{ color: 'rgb(47, 84, 235)' }} />
                      </Tooltip>
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="占地面积">
                {getFieldDecorator('floor_area', {
                  initialValue: formData.floor_area,
                  rules: [
                    {
                      required: false,
                      message: '请输入占地面积',
                    },
                  ],
                })(<Input placeholder="请输入占地面积" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="总面积">
                {getFieldDecorator('total_area', {
                  initialValue: formData.total_area,
                  rules: [
                    {
                      required: false,
                      message: '请输入总面积',
                    },
                  ],
                })(<Input placeholder="请输入总面积" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="容积率">
                {getFieldDecorator('volume_rate', {
                  initialValue: formData.volume_rate,
                  rules: [
                    {
                      required: false,
                      message: '请输入容积率',
                    },
                  ],
                })(<Input placeholder="请输入容积率" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="绿化率">
                {getFieldDecorator('greening_rate', {
                  initialValue: formData.greening_rate,
                  rules: [
                    {
                      required: false,
                      message: '请输入绿化率',
                    },
                  ],
                })(<Input placeholder="请输入绿化率" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="产权所有人">
                {getFieldDecorator('property_owner', {
                  initialValue: formData.property_owner,
                  rules: [
                    {
                      required: false,
                      message: '请输入产权所有人',
                    },
                  ],
                })(<Input placeholder="请输入产权所有人" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="联系人">
                {getFieldDecorator('contact', {
                  initialValue: formData.contact,
                  rules: [
                    {
                      required: false,
                      message: '请输入联系人',
                    },
                  ],
                })(<Input placeholder="请输入联系人" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="联系方式">
                {getFieldDecorator('contact_tel', {
                  initialValue: formData.contact_tel,
                  rules: [
                    {
                      required: false,
                      message: '请输入联系方式',
                    },
                    { validator: checkPhoneNum },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="园区LOGO">
                {getFieldDecorator('logo', {
                  initialValue: formData.logo ? [formData.logo] : [],
                  rules: [
                    {
                      required: false,
                      message: '请上传',
                    },
                  ],
                })(<PicturesWall num={1} bucket="park" listType="picture-card" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="园区描述">
                {getFieldDecorator('memo', {
                  initialValue: formData.memo,
                })(<Input.TextArea rows={2} placeholder="请输入园区描述" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="状态">
                {getFieldDecorator('status', {
                  initialValue: formData.status ? formData.status.toString() : '1',
                })(
                  <Radio.Group>
                    <Radio value="1">正常</Radio>
                    <Radio value="2">停用</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ProjectManageCard;
