import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Tabs, Radio, InputNumber } from 'antd';
import { Item } from 'rc-menu';
import styles from './CostAccount.less';
const { TabPane } = Tabs;
@connect(state => ({
  salesPlan: state.salesPlan,
  costAccount: state.costAccount,
}))
@Form.create()
class AddNewSalesPlan extends PureComponent {
  state = {
    quarterList: [
      {
        key: "1",
        name: "第一季度",

      },
      {
        key: "2",
        name: "第二季度",

      },
      {
        key: "3",
        name: "第三季度",
      },
      {
        key: "4",
        name: "第四季度",
      },

    ],
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
    const { form, onSubmit, costAccount: { formID }, salesPlan: { formatData } } = this.props;
    const { quarterList } = this.state;
    console.log('点击确定按钮 ');

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log('formData ' + JSON.stringify(formData));
      //   onSubmit(formData);
      const year = formData.year;
      let submitData = [];

      for (let m = 0; m < quarterList.length; m++) {
        console.log("季度循环 " + m);
        //let quarterData = [];

        for (let i = 0; i < formatData.length; i++) {
          console.log("业态循环 " + i);
          let item = {};
          item.year = parseInt(year);
          item.proj_business_id = formatData[i].proj_business_id;
          item.sale_area = formData[quarterList[m].key + formatData[i].proj_business_id + "sale_area"];

          item.average_price = formData[quarterList[m].key + formatData[i].proj_business_id + "average_price"];
          item.contract_amount = formData[quarterList[m].key + formatData[i].proj_business_id + "contract_amount"];
          item.payback = formData[quarterList[m].key + formatData[i].proj_business_id + "payback"];
          item.project_id = formID;
          item.quarter = parseInt(quarterList[m].key);

          submitData.push(item);
        }

        //submitData.push(quarterData);
      }

      console.log("创建计划需要提交的数据 ");
      console.log(submitData);


      this.dispatch({
        type: 'salesPlan/createPlan',
        payload: submitData,
      });

    });
  };



  render() {
    const {
      salesPlan: { addSalesPlanVisible, formatData },
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
        span: 2
      },
      wrapperCol: {
        // xs: { span: 24 },
        // sm: { span: 16 },
        span: 22,
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
          <Row style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 25 }}>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="年份" >
                {getFieldDecorator('year', {
                  //initialValue: item.sale_area,
                  rules: [
                    {
                      required: true,
                      message: '请输入年份',
                    },
                  ],
                })(<Input placeholder="请输入年份" style={{ width: 150 }} />)}
              </Form.Item>
            </Col>

          </Row>

          <Tabs defaultActiveKey="1" onChange={this.callback} tabPosition="left"

          >
            {
              quarterList.map((quarter_item, index) =>
                <TabPane tab={quarter_item.name} key={quarter_item.key}>
                  {formatData.map((item, index) => (
                    <Row
                      align="middle"
                      style={{
                        height: '59px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                      key={item.proj_business_id}
                      >
                      <Col span={4}>
                        <Form.Item label="" wrapperCol={{ span: 24 }}>
                          {getFieldDecorator(quarter_item.key + item.proj_business_id, {
                            // initialValue: item.name,
                          })(<label>{item.proj_business_name}</label>)}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item wrapperCol={{ span: 15 }} labelCol={{ span: 9}} label="销售面积(m²)">
                          {getFieldDecorator(quarter_item.key + item.proj_business_id + 'sale_area', {
                            initialValue: 0,
                            // rules: [
                            //   {
                            //     required: getFieldValue(item.code),
                            //     message: '请输入销售面积',
                            //   },
                            // ],
                          })(<InputNumber placeholder="请输入销售面积" style={{ width: 150 }} 
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\\s?|(,*)/g, '')}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item {...formItemLayout} label="销售单价">
                          {getFieldDecorator(quarter_item.key + item.proj_business_id + 'average_price', {
                            initialValue: 0,
                            // rules: [
                            //   {
                            //     required: getFieldValue(item.code),
                            //     message: '请输入销售面积',
                            //   },
                            // ],
                          })(<InputNumber placeholder="请输入销售单价" style={{ width: 100 }} 
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\\s?|(,*)/g, '')}
                          />)}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item wrapperCol={{ span: 14 }} labelCol={{ span: 10}} label="合同额">
                          {getFieldDecorator(quarter_item.key + item.proj_business_id + 'contract_amount', {
                            initialValue: 0,
                          })(
                            <label>
                              {getFieldValue(quarter_item.key + item.proj_business_id + 'sale_area') *
                                getFieldValue(quarter_item.key + item.proj_business_id + 'average_price')}
                            </label>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item {...formItemLayout} label="销售回款额">
                          {getFieldDecorator(quarter_item.key + item.proj_business_id + 'payback', {
                            initialValue: 0,
                          
                          })(<InputNumber placeholder="请输入销售回款" style={{ width: 150 }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\\s?|(,*)/g, '')}
                          />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </TabPane>

              )
            }
          </Tabs>

        </Form>
      </Modal>
    );
  }
}
export default AddNewSalesPlan;
