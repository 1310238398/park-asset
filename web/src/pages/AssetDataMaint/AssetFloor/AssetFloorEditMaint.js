import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio, Tabs } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import CustomInfo from '../CustomInfo/CustomInfo';
import AgreementInfo from '../CustomInfo/AgreementInfo';

@connect(({ assetDatamaint }) => ({
  assetDatamaint,
}))
@Form.create()
class AssetFloorEditMaint extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
  }

  onOKClick = () => {
    const {
      form,
      assetDatamaint: { proData, formDataFloor },
      onSubmit,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proData.record_id;
        formData.parent_id = formDataFloor.record_id;
        formData.building_type = 3;
        if (formData && formData.building_area) {
          formData.building_area = Math.round(Number(formData.building_area) * 100);
        }
        if (formData && formData.rent_area) {
          formData.rent_area = Math.round(Number(formData.rent_area) * 100);
        }

        if (formData.is_all_rent === 1 && formData.rent_status !== 1) {
          this.custom.current.validateFields((errCut, valuesCut) => {
            if (!errCut) {
              formData = { formData, ...valuesCut };
            }
          });
          this.agreement.current.validateFields((errAgre, valuesAgre) => {
            if (!errAgre) {
              formData = { formData, ...valuesAgre };
            }
          });
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
      assetDatamaint: { formVisibleFloor, formTitleFloor, formDataFloor, submitting, proData },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
      titleName,
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
        title={formTitleFloor}
        width={850}
        visible={formVisibleFloor}
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="楼栋名称">
                  <span className="ant-form-text">{titleName}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="楼层名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataFloor.name,
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
                <Form.Item {...formItemLayoutTwo} label="是否整层出租">
                  {getFieldDecorator('is_all_rent', {
                    initialValue: formDataFloor.is_all_rent ? formDataFloor.is_all_rent : 2,
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
              <Col span={8}>
                <Form.Item
                  {...formItemLayoutTwo}
                  label="建筑面积（㎡）"
                  style={{
                    display: getFieldValue('is_all_rent') === 1 ? 'block' : 'none',
                  }}
                >
                  {getFieldDecorator('building_area', {
                    initialValue: formDataFloor.building_area
                      ? formDataFloor.building_area / 100
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
                    initialValue: formDataFloor.rent_area ? formDataFloor.rent_area / 100 : 0,
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
                    initialValue: formDataFloor.decoration,
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
                    initialValue: formDataFloor.rent_status ? formDataFloor.rent_status : 0,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <RadioGroup>
                      <Radio.Button value={1}>未租</Radio.Button>
                      <Radio.Button value={2}>锁定</Radio.Button>
                      <Radio.Button value={3}>已租</Radio.Button>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                display: getFieldValue('rent_status') === 2 ? 'block' : 'none',
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
                display: getFieldValue('lease_status') === 3 ? 'block' : 'none',
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

export default AssetFloorEditMaint;
