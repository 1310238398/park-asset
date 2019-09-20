import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import CustomInfo from './CustomInfo/CustomInfo';
import AgreementInfo from './CustomInfo/AgreementInfo';
@connect(({ assetDatamaint }) => ({
  assetDatamaint,
}))
@Form.create()
class AssetUnitEditMaint extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.sequence = parseInt(formData.sequence, 10);
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      assetDatamaint: { formVisibleUnit, formTitleUnit, formDataUnit, submitting },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const RadioGroup = Radio.Group;
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
        span: 3,
      },
      wrapperCol: {
        span: 21,
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
        title={formTitleUnit}
        width={850}
        visible={formVisibleUnit}
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="园区名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataUnit.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="楼栋名称">
                  {getFieldDecorator('parent_id', {
                    initialValue: formDataUnit.parent_id,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="单元名称">
                  {getFieldDecorator('code', {
                    initialValue: formDataUnit.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayoutTwo} label="是否整单元出租">
                  {getFieldDecorator('sequence', {
                    initialValue: formDataUnit.sequence,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value={20}>是</Radio>
                      <Radio value={10}>否</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="建筑面积（㎡）"
                  style={{
                    display: getFieldValue('sequence') === 20 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataUnit.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="计租面积（㎡）"
                  style={{
                    display: getFieldValue('sequence') === 20 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataUnit.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...formItemLayout}
                  label="装修情况"
                  style={{
                    display: getFieldValue('sequence') === 20 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataUnit.code,
                    rules: [
                      {
                        required: false,
                        message: '请输入',
                      },
                    ],
                  })(
                    <DicSelect
                      vmode="sting"
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
                    display: getFieldValue('sequence') === 20 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('lease_status', {
                    initialValue: formDataUnit.lease_status,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <RadioGroup>
                      <Radio.Button value={20}>未租</Radio.Button>
                      <Radio.Button value={10}>锁定</Radio.Button>
                      <Radio.Button value={30}>已租</Radio.Button>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                display: getFieldValue('lease_status') === 10 ? 'block' : 'none',
              }}
            >
              <CustomInfo />
            </Row>
            <Row
              style={{
                display: getFieldValue('lease_status') === 30 ? 'block' : 'none',
              }}
            >
              <AgreementInfo />
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default AssetUnitEditMaint;
