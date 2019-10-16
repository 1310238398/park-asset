import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio, Tabs } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(({ assetApartmentData }) => ({
  assetApartmentData,
}))
@Form.create()
class AssetApartmentDataEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
  }

  onOKClick = () => {
    const {
      form,
      assetApartmentData: { proData },
      onSubmit,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proData.record_id;
        formData.building_type = 1;
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

  render() {
    const {
      assetApartmentData: {
        formVisibleBuild,
        formTitleBuild,
        formDataBuild,
        submitting,
        formTypeBuild,
        proData,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const RadioGroup = Radio.Group;
    const { TabPane } = Tabs;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const formItemLayoutmome = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const formItemLayoutTwo = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
    };
    return (
      <Modal
        title={formTitleBuild}
        width={850}
        visible={formVisibleBuild}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="项目名称">
                  <span className="ant-form-text">{proData.name}</span>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayoutmome} label="公寓名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataBuild.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item {...formItemLayoutTwo} label="是否整栋出租">
                  {getFieldDecorator('is_all_rent', {
                    initialValue: formDataBuild.is_all_rent ? formDataBuild.is_all_rent : 2,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="单元数"
                  style={{
                    display: getFieldValue('is_all_rent') === 2 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('unit_num', {
                    initialValue: formDataBuild.unit_num ? formDataBuild.unit_num : 0,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      max={9999}
                      placeholder="请输入"
                      disabled={formTypeBuild === 'E'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayoutmome}
                  label="单元命名规则"
                  style={{
                    display: getFieldValue('is_all_rent') === 2 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('unit_naming', {
                    initialValue: formDataBuild.unit_naming ? formDataBuild.unit_naming : '单元',
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled={formTypeBuild === 'E'} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="楼层数"
                  style={{
                    display: getFieldValue('is_all_rent') === 2 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('layer_num', {
                    initialValue: formDataBuild.layer_num ? formDataBuild.layer_num : 0,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      max={9999}
                      placeholder="请输入"
                      disabled={formTypeBuild === 'E'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayoutmome}
                  label="楼层命名规则"
                  style={{
                    display: getFieldValue('is_all_rent') === 2 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('layer_naming', {
                    initialValue: formDataBuild.layer_naming ? formDataBuild.layer_naming : 'F',
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled={formTypeBuild === 'E'} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="建筑面积（㎡）"
                  style={{
                    display: getFieldValue('is_all_rent') === 1 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('building_area', {
                    initialValue: formDataBuild.building_area
                      ? formDataBuild.building_area / 100
                      : 0,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" step={0.1} min={0} max={1000000} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="计租面积（㎡）"
                  style={{
                    display: getFieldValue('is_all_rent') === 1 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('rent_area', {
                    initialValue: formDataBuild.rent_area ? formDataBuild.rent_area / 100 : 0,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" step={0.1} min={0} max={1000000} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayout}
                  label="装修情况"
                  style={{
                    display: getFieldValue('is_all_rent') === 1 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('decoration', {
                    initialValue: formDataBuild.decoration,
                    rules: [
                      {
                        required: false,
                        message: '请输入',
                      },
                    ],
                  })(
                    <DicSelect
                      vmode="int"
                      pcode="pa$#build$#decora"
                      selectProps={{ placeholder: '请选择' }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="出租状态"
                  style={{
                    display: getFieldValue('is_all_rent') === 1 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('rent_status', {
                    initialValue: formDataBuild.rent_status ? formDataBuild.rent_status : 0,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <RadioGroup disabled={formTypeBuild === 'E'}>
                      <Radio.Button value={1}>未租</Radio.Button>
                      <Radio.Button value={2}>锁定</Radio.Button>
                      <Radio.Button value={3}>已租</Radio.Button>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default AssetApartmentDataEdit;
