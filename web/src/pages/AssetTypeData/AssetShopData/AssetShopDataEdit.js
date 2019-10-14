import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio, Tabs } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(({ assetShopData }) => ({
  assetShopData,
}))
@Form.create()
class AssetShopDataEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
  }

  onOKClick = () => {
    const {
      form,
      assetShopData: { proData },
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

  render() {
    const {
      assetShopData: {
        formVisibleShop,
        formTitleShop,
        formDataShop,
        submitting,
        formTypeShop,
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
        title={formTitleShop}
        width={850}
        visible={formVisibleShop}
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
                <Form.Item {...formItemLayoutmome} label="商铺号">
                  {getFieldDecorator('name', {
                    initialValue: formDataShop.name,
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
                <Form.Item {...formItemLayoutTwo} label="业态">
                  {getFieldDecorator('business', {
                    initialValue: formDataShop.business ? formDataShop.business : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <DicSelect
                    vmode="string"
                    pcode="pa$#industry"
                    selectProps={{ placeholder: '请选择' }}
                  />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="建筑面积（㎡）"
                >
                  {getFieldDecorator('building_area', {
                    initialValue: formDataShop.building_area
                      ? formDataShop.building_area / 100
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
                  
                >
                  {getFieldDecorator('rent_area', {
                    initialValue: formDataShop.rent_area ? formDataShop.rent_area / 100 : 0,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" step={0.1} min={0} max={1000000} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="出租状态"
                >
                  {getFieldDecorator('rent_status', {
                    initialValue: formDataShop.rent_status ? formDataShop.rent_status : 0,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <RadioGroup disabled={formTypeShop === 'E'}>
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

export default AssetShopDataEdit;
