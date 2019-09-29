import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
// import GetLocation from './GetLocation';

@connect(state => ({
  massif: state.massif,
}))
@Form.create()
class MassifCard extends PureComponent {
  // state = {
  //   showMap: false,
  // };

  componentDidMount() {
    this.dispatch({
      type: 'massif/queryCompany',
    });
  }

  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      if (formData.photo && formData.photo.length > 0) {
        formData.photo = formData.photo.join('');
      } else {
        formData.photo = '';
      }

      if (formData.asset_type && formData.asset_type.length > 0) {
        formData.asset_type = formData.asset_type.join(',');
      } else {
        formData.asset_type = '';
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
      massif: { formTitle, formVisible, formData, submitting },
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
              <Form.Item {...formItemLayout} label="地块名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入地块名称',
                    },
                  ],
                })(<Input placeholder="请输入地块名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="地块经纬度">
                {getFieldDecorator('location', {
                  initialValue: formData.location,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<Input placeholder="地块经纬度" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="地块地址">
                {getFieldDecorator('address', {
                  initialValue: formData.address,
                  rules: [
                    {
                      required: false,
                      message: '请输入地块地址',
                    },
                  ],
                })(<Input placeholder="请输入地块地址" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="地块照片">
                {getFieldDecorator('photo', {
                  initialValue: formData.photo ? [formData.photo] : '',
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<PicturesWall num={1} listType="picture-card" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('memo', {
                  initialValue: formData.memo,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default MassifCard;
