import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio, Tabs } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import CustomInfo from './CustomInfo/CustomInfo';
import AgreementInfo from './CustomInfo/AgreementInfo';

@connect(({ assetDatamaint }) => ({
  assetDatamaint,
}))
@Form.create()
class AssetBuildEditMaint extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
  }

  onOKClick = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.sequence = parseInt(formData.sequence, 10);
        this.custom.current.validateFields((errCut, valuesCut) => {
          if (!errCut) {
            formData = { formData, ...valuesCut };
            // console.log(formData)
          }
        });
        this.agreement.current.validateFields((errAgre, valuesAgre) => {
          if (!errAgre) {
            formData = { formData, ...valuesAgre };
            // console.log(formData)
          }
        });

        // onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      assetDatamaint: {
        formVisibleBuild,
        formTitleBuild,
        formDataBuild,
        submitting,
        formTypeBuild,
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
    // const formItemLayoutmome = {
    //   labelCol: {
    //     span: 3,
    //   },
    //   wrapperCol: {
    //     span: 21,
    //   },
    // };
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="项目名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataBuild.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="楼栋名称">
                  {getFieldDecorator('parent_id', {
                    initialValue: formDataBuild.parent_id,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayoutTwo} label="是否整单元出租">
                  {getFieldDecorator('sequence', {
                    initialValue: formDataBuild.sequence ? formDataBuild.sequence : 10,
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
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="单元数"
                  style={{
                    display: getFieldValue('sequence') === 10 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataBuild.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" disabled={formTypeBuild === 'E'} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="单元命名规则"
                  style={{
                    display: getFieldValue('sequence') === 10 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataBuild.code ? formDataBuild.code : '单元',
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
                    display: getFieldValue('sequence') === 10 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataBuild.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                      },
                    ],
                  })(<InputNumber placeholder="请输入" disabled={formTypeBuild === 'E'} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formItemLayout}
                  label="楼层命名规则"
                  style={{
                    display: getFieldValue('sequence') === 10 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataBuild.code ? formDataBuild.code : 'F',
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
                    display: getFieldValue('sequence') === 20 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('code', {
                    initialValue: formDataBuild.code,
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
                    initialValue: formDataBuild.code,
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
                    initialValue: formDataBuild.code,
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
                    initialValue: formDataBuild.lease_status,
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
              <Tabs defaultActiveKey="1">
                <TabPane tab="客户信息" key="1">
                  <CustomInfo ref={this.custom} />
                </TabPane>
              </Tabs>
            </Row>
            <Row
              style={{
                display: getFieldValue('lease_status') === 30 ? 'block' : 'none',
              }}
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab="客户信息" key="1">
                  <CustomInfo ref={this.custom} />
                </TabPane>
                <TabPane tab="合同信息" key="2">
                  <AgreementInfo ref={this.agreement} />
                </TabPane>
              </Tabs>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default AssetBuildEditMaint;
