import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, InputNumber, Row, Col, Radio, Tabs } from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(({ assetHotelData }) => ({
  assetHotelData,
}))
@Form.create()
class AssetNumPlateEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
  }

  onOKClick = () => {
    const {
      form,
      assetHotelData: { proData, formDataFloor },
      onSubmit,
      loudong,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proData.record_id;
        formData.parent_id = formDataFloor.record_id;
        formData.building_type = 4;
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
      assetHotelData: {
        formVisiblePlate,
        formTitlePlate,
        formDataPlate,
        submitting,
        proData,
        formTypePlate,
        formDataBuild,
        loudongName,
        UnitName,
        loudongN,
        unitNum
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
      titleName,
      loudong,
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
        title={formTitlePlate}
        width={850}
        visible={formVisiblePlate}
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
            </Row>
            {unitNum!== 0 ? (
              <Col span={8}>
                <Form.Item {...formItemLayout} label="楼栋名称">
                  <span className="ant-form-text">{loudongName}</span>
                </Form.Item>
              </Col>
            ) : (
              <Col span={8}>
                <Form.Item {...formItemLayout} label="楼栋名称">
                  <span className="ant-form-text">{loudongN}</span>
                </Form.Item>
              </Col>
            )}
            <Row>
              {unitNum!== 0 ? (
                <Col span={8}>
                  <Form.Item {...formItemLayout} label="单元名称">
                    <span className="ant-form-text">{UnitName}</span>
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}
              <Col span={8}>
                <Form.Item {...formItemLayout} label="楼层名称">
                  <span className="ant-form-text">{titleName}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="门牌名称">
                  {getFieldDecorator('name', {
                    initialValue: formDataPlate.name,
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
                <Form.Item {...formItemLayoutTwo} label="是否整门牌出租">
                  {getFieldDecorator('is_all_rent', {
                    initialValue: formDataPlate.is_all_rent ? formDataPlate.is_all_rent : 2,
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
                    initialValue: formDataPlate.building_area
                      ? formDataPlate.building_area / 100
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
                    initialValue: formDataPlate.rent_area ? formDataPlate.rent_area / 100 : 0,
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
                    initialValue: formDataPlate.decoration,
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
                    initialValue: formDataPlate.rent_status ? formDataPlate.rent_status : 0,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <RadioGroup disabled={formTypePlate === 'E'}>
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

export default AssetNumPlateEdit;
