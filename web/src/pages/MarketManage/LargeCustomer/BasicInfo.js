import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, message, Button, InputNumber, Row, Col } from 'antd';
import styles from '../MarketManage2.less';
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,

  loading: state.loading.models.entrustedConstruction,
}))
@Form.create()
class BasicInfo extends PureComponent {
  state = {};
  componentDidMount = async () => {
    const {
      entrustedConstruction: { formID, formType },
    } = this.props;

    this.dispatch({
      type: 'entrustedConstruction/fetchBasic',
      payload: {
        projectID: formID,
      },
    });
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  render() {
    const {
        form: { getFieldDecorator },
      
      } = this.props;
      const formItemLayout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 16,
        },
      };
    return (
      <div>
        <Form>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="*合同名称" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_name')(<Input placeholder="请输入合同名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="*合同编号" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_num')(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="*甲方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_jia')(<Input placeholder="请输入甲方名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="*乙方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_yi')(<Input placeholder="请输入乙方名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="审核进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_audit')(<div>自动展示</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="执行进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute')(<div>自动展示</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="*项目" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_project')(
                     <Select placeholder="请选择项目" style={{ width: '100%' }}>
                   
                        <Select.Option key="01" value="项目1">
                          项目1
                        </Select.Option>
                        <Select.Option key="02" value="项目2">
                          项目2
                        </Select.Option>
                      
                  </Select>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="*楼栋" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute')(   
                <Select placeholder="请选择楼栋" style={{ width: '100%' }}>
                   <Select.Option key="01" value="楼栋1">
                     楼栋1
                   </Select.Option>
                   <Select.Option key="02" value="楼栋2">
                     楼栋2
                   </Select.Option>
             </Select>
             )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default BasicInfo;
