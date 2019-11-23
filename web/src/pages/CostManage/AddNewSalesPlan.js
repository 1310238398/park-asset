import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Tabs, Radio, InputNumber } from 'antd';
import { Item } from 'rc-menu';
import styles from './CostAccount.less';
const { TabPane } = Tabs;
@connect(state => ({
  salesPlan: state.salesPlan,
}))
@Form.create()
class AddNewSalesPlan extends PureComponent {
  state = {
    currentQuarter: 1,
    yetai: [
      {
        id: 'a',
        name: '住宅',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'b',
        name: '地上车位测试长度测试长度',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'c',
        name: '地下车库',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'd',
        name: '写字楼',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'e',
        name: '公寓',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'd',
        name: '写字楼',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'e',
        name: '公寓',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'd',
        name: '写字楼',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
      {
        id: 'e',
        name: '公寓',
        average_prise: 0,
        sale_area: 0,
        contract_amount: 0,
        payback: 0,
      },
    ],

    quarterList: [1, 2, 3, 4],
  };
  componentDidMount() {
    // this.dispatch({
    //   type: 'projectManage/queryCompany',
    // });
  }
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  onOKClick = () => {
    const { form, onSubmit } = this.props;
    console.log('点击确定按钮 ');

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log('formData ' + JSON.stringify(formData));
      //   onSubmit(formData);
    });
  };

  

  render() {
    const {
      salesPlan: { addSalesPlanVisible },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;

    const { yetai, currentQuarter, quarterList } = this.state;

    const formItemLayout = {
      labelCol: {
        // xs: { span: 24 },
        // sm: { span: 8 },
        span: 8,
      },
      wrapperCol: {
        // xs: { span: 24 },
        // sm: { span: 16 },
        span: 16,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        // xs: { span: 24 },
        // sm: { span: 8 },
        span: 1
      },
      wrapperCol: {
        // xs: { span: 24 },
        // sm: { span: 16 },
        span: 23,
      },
    };

   
    

    return (
      <Modal
        title="新增销售计划"
        width="80%"
        visible={addSalesPlanVisible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          overflowY: 'auto',
          marginLeft: 30,
          marginRight: 20,
        }}
      >
        <Form labelAlign="left">
          <Row style={{display: 'flex', justifyContent: 'flex-start',marginLeft:25}}>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="年份" >
                {getFieldDecorator('year', {
                  // initialValue: item.sale_area,
                  // rules: [
                  //   {
                  //     required: getFieldValue(item.code),
                  //     message: '请输入销售面积',
                  //   },
                  // ],
                })(<Input placeholder="请输入年份" style={{ width: 150 }} />)}
              </Form.Item>
            </Col>
         
          </Row>

          <Tabs defaultActiveKey="3" onChange={this.callback} tabPosition="left"
            
          >
            <TabPane tab="第一季度" key="1">
            {yetai.map((item, index) => (
            <Row
              align="middle"
              style={{
                height: '59px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Col span={4}>
                <Form.Item  label="" wrapperCol={{span:24}}>
                  {getFieldDecorator("1"+item.id, {
                    // initialValue: item.name,
                  })(<label>{item.name}</label>)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售面积">
                  {getFieldDecorator("1" + item.id + 'sale_area', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售面积" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售单价">
                  {getFieldDecorator("1" + item.id + 'average_prise', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售单价" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...formItemLayout} label="合同额">
                  {getFieldDecorator("1" + item.id + 'contract_amount', {
                     initialValue: 0,
                  })(
                    <label>
                      {getFieldValue("1" +item.id + 'sale_area') *
                        getFieldValue("1" +item.id + 'average_prise')}
                    </label>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="销售回款额">
                  {getFieldDecorator('1' + item.id + 'payback', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售回款" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
            </Row>
          ))}
            </TabPane>
            <TabPane tab="第二季度" key="2">
            {yetai.map((item, index) => (
            <Row
              align="middle"
              style={{
                height: '59px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Col span={4}>
                <Form.Item  wrapperCol={{span:24}} label="">
                  {getFieldDecorator("2"+item.id, {
                    // initialValue: item.name,
                  })(<label>{item.name}</label>)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售面积">
                  {getFieldDecorator("2" + item.id + 'sale_area', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售面积" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售单价">
                  {getFieldDecorator("2" + item.id + 'average_prise', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售单价" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...formItemLayout} label="合同额">
                  {getFieldDecorator("2" + item.id + 'contract_amount', {
                     initialValue: 0,
                  })(
                    <label>
                      {getFieldValue("2" +item.id + 'sale_area') *
                        getFieldValue("2" +item.id + 'average_prise')}
                    </label>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="销售回款额">
                  {getFieldDecorator('2' + item.id + 'payback', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售回款" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
            </Row>
          ))}
            </TabPane>
            <TabPane tab="第三季度" key="3" >
            {yetai.map((item, index) => (
            <Row
              align="middle"
              style={{
                height: '59px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Col span={4}>
                <Form.Item  wrapperCol={{span:24}} label="">
                  {getFieldDecorator("3"+item.id, {
                    // initialValue: item.name,
                  })(<label>{item.name}</label>)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售面积">
                  {getFieldDecorator("3" + item.id + 'sale_area', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售面积" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售单价">
                  {getFieldDecorator("3" + item.id + 'average_prise', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售单价" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...formItemLayout} label="合同额">
                  {getFieldDecorator("3" + item.id + 'contract_amount', {
                     initialValue: 0,
                  })(
                    <label>
                      {getFieldValue("3" +item.id + 'sale_area') *
                        getFieldValue("3" +item.id + 'average_prise')}
                    </label>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="销售回款额">
                  {getFieldDecorator('3' + item.id + 'payback', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售回款" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
            </Row>
          ))}
            </TabPane>
            <TabPane tab="第四季度" key="4">
            {yetai.map((item, index) => (
            <Row
              align="middle"
              style={{
                height: '59px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Col span={4}>
                <Form.Item  wrapperCol={{span:24}} label="">
                  {getFieldDecorator("4"+item.id, {
                    // initialValue: item.name,
                  })(<label>{item.name}</label>)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售面积">
                  {getFieldDecorator("4" + item.id + 'sale_area', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售面积" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...formItemLayout} label="销售单价">
                  {getFieldDecorator("4" + item.id + 'average_prise', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售单价" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...formItemLayout} label="合同额">
                  {getFieldDecorator("4" + item.id + 'contract_amount', {
                     initialValue: 0,
                  })(
                    <label>
                      {getFieldValue("4" +item.id + 'sale_area') *
                        getFieldValue("4" +item.id + 'average_prise')}
                    </label>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="销售回款额">
                  {getFieldDecorator('4' + item.id + 'payback', {
                    initialValue: 0,
                    // rules: [
                    //   {
                    //     required: getFieldValue(item.code),
                    //     message: '请输入销售面积',
                    //   },
                    // ],
                  })(<InputNumber placeholder="请输入销售回款" style={{ width: 100 }} />)}
                </Form.Item>
              </Col>
            </Row>
          ))}
            </TabPane>
            
          </Tabs>
          
        </Form>
      </Modal>
    );
  }
}
export default AddNewSalesPlan;
