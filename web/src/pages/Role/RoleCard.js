import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Card, Row, Col, InputNumber, TreeSelect } from 'antd';

import RoleMenu from './RoleMenu';

@connect(state => ({
  role: state.role,
  organStructure: state.organStructure,
}))
@Form.create()
class RoleCard extends PureComponent {
  componentDidMount() {
    this.dispatch({
      type: 'organStructure/loadTree',
    });
  }

  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      formData.sequence = parseInt(formData.sequence, 10);
      if (!formData.menus || formData.menus.length === 0) {
        message.warning('请选择菜单权限！');
        return;
      }
      onSubmit(formData);
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
      role: { formTitle, formVisible, formData, submitting },
      organStructure: { treeData },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 18,
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
            <Col>
              <Form.Item {...formItemLayout} label="角色名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名称',
                    },
                  ],
                })(<Input placeholder="请输入角色名称" />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item {...formItemLayout} label="排序值">
                {getFieldDecorator('sequence', {
                  initialValue: formData.sequence ? formData.sequence.toString() : '1000000',
                  rules: [
                    {
                      required: true,
                      message: '请输入排序值',
                    },
                  ],
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item {...formItemLayout} label="组织机构">
                {getFieldDecorator('org_id', {
                  initialValue: formData.org_id,
                })(
                  <TreeSelect
                    showSearch
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.toTreeSelect(treeData)}
                    placeholder="请选择"
                  />
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('memo', {
                  initialValue: formData.memo,
                })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card title="选择菜单权限" bordered={false}>
                {getFieldDecorator('menus', {
                  initialValue: formData.menus,
                })(<RoleMenu />)}
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default RoleCard;
