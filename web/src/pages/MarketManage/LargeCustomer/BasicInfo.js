import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, message, Button, InputNumber, Row, Col ,Icon, Upload, DatePicker, Card} from 'antd';
import PicturesWall2 from '../../../components/PicturesWall2/PicturesWall2';
import styles from '../../ProjectManage/ProjectManage.less';
import moment from 'moment';
const { Option } = Select;
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,

  loading: state.loading.models.entrustedConstruction,
}))
@Form.create()
class BasicInfo extends PureComponent {
  state = {
  
  };
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
        entrustedConstruction: { formType}
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
      {
        formType === 'E' &&
        <Card bordered={false} bodyStyle={{ paddingTop: 0}}>
        <Form>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="合同名称" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_name', {
                    rules: [
                      {
                        required: true,
                        message: '请填写合同名称',
                      },
                    ]
                })(<Input placeholder="请输入合同名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同编号" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_num', {
                   rules: [
                    {
                      required: true,
                      message: '请填写合同编号',
                    },
                  ],
                })(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="甲方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_jia', {
                   rules: [
                    {
                      required: true,
                      message: '请填写甲方名称',
                    },
                  ],
                })(<Input placeholder="请输入甲方名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="乙方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_yi', {
                    rules: [
                      {
                        required: true,
                        message: '请填写乙方名称',
                      },
                    ],
                })(<Input placeholder="请输入乙方名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="审核进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_audit')(<div>审核中</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="执行进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute')(<div>验收</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="项目" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_project', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目',
                      },
                    ],
                })(
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
              <Form.Item label="楼栋" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute', {
                    rules: [
                      {
                        required: true,
                        message: '请选择楼栋',
                      },
                    ],
                })(   
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
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="负责人" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_response', {
                    rules: [
                      {
                        required: true,
                        message: '请填写负责人名字',
                      },
                    ],
                })(<Input placeholder="请输入负责人名称" />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="联系电话" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_phone', {
                    rules: [
                      {
                        required: true,
                        message: '请填写联系电话',
                      },
                    ],
                })(<Input placeholder="请输入联系电话" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="建筑面积" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_area', {
                    rules: [
                      {
                        required: true,
                        message: '请填写建筑面积',
                      },
                    ],
                })(<InputNumber placeholder="请输入建筑面积"  style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="建设费标准" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_standard', {
                    rules: [
                      {
                        required: true,
                        message: '请填写建设费标准',
                      },
                    ],
                })(<InputNumber placeholder="请输入建设费标准"  style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="单价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_unit', {
                    rules: [
                      {
                        required: true,
                        message: '请填写单价',
                      },
                    ],
                })(<InputNumber placeholder="请输入单价"  style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同总价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_total', {
                    rules: [
                      {
                        required: true,
                        message: '请填写总价',
                      },
                    ],
                })(<InputNumber placeholder="请输入合同总价"  style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="车位(个)" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_car')(<InputNumber placeholder="请输入车位个数"  style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同类型" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_type', {
                    rules: [
                      {
                        required: true,
                        message: '请选择合同类型',
                      },
                    ],
                })(
                      <Select placeholder="请选择合同类型" style={{ width: '100%' }}>
                      <Select.Option key="01" value="常规合同">
                        常规合同
                      </Select.Option>
                      <Select.Option key="02" value="委托建设合同">
                      委托建设合同
                      </Select.Option>
                </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="签订时间" labelAlign="left">
                {getFieldDecorator('sign_time', {
                 // initialValue: moment(formData.end_time),
                  rules: [
                    {
                      required: true,
                      message: '请选择时间',
                    },
                  ],
                })(
                  <DatePicker
                    // showTime
                    style={{ width: '100%' }}
                    placeholder="请选择结束时间"
                    format="YYYY-MM-DD"
                    //locale={locale}
                  />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="备注" labelAlign="left">
                {getFieldDecorator('contract_remark', {
                 // initialValue: formDataSupplement.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入备注',
                    },
                  ],
                })(<Input.TextArea rows={4} placeholder="请输入备注" />)}
              </Form.Item>
            </Col>
    
          </Row>
          <Row gutter={16}>
          <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="上传合同" labelAlign="left">
                {getFieldDecorator('upload', {
                 // initialValue: moment(formData.end_time),
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请选择时间',
                  //   },
                  // ],
                })(
                  <PicturesWall2 num={5}  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      }

{
        formType === 'V' &&
        <Card bordered={false} bodyStyle={{ paddingTop: 0}}>
        <Form>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="合同名称" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_name_v', {
                   
                })(<div>合同名称</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同编号" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_num_v', {
                  
                
                })(<div>合同编号</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="甲方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_jia_v', {
                 
                 
                })(<div>甲方</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="乙方" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_yi', {
                   
                })(<div>乙方</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="审核进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_audit_v')(<div>审核中</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="执行进度" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute_v')(<div>验收</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="项目" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_project_v', {
                  
                })(
                  <div>项目</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="楼栋" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_execute_v', {
                   
                })(   
                  <div>楼栋</div>
             )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="负责人" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_response_v', {
                  
                })(<div>负责人</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="联系电话" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_phone_v', {
                  
                })(<div>联系电话</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="建筑面积" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_area_v', {
                    
                })(<div>建筑面积</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="建设费标准" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_standard_v', {
                   
                })(<div>建设费标准</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="单价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_unit_v', {
                   
                })(<div>单价</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同总价" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_total_v', {
                   
                })(<div>合同总价</div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="车位(个)" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_car_v')(<div>车位</div>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="合同类型" {...formItemLayout} labelAlign="left">
                {getFieldDecorator('contract_type_v', {
                   
                })(
                  <div>常规合同</div>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="签订时间" labelAlign="left">
                {getFieldDecorator('sign_time_v', {
                 // initialValue: moment(formData.end_time),
                 
                })(
                  // <DatePicker
                  //   // showTime
                  //   style={{ width: '100%' }}
                  //   placeholder="请选择结束时间"
                  //   format="YYYY-MM-DD"
                  //   //locale={locale}
                  // />
                  <div>{moment(new Date()).format("YYYY-MM-DD")}</div>
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="备注" labelAlign="left">
                {getFieldDecorator('contract_remark_v', {
                 
                 
                })(
                //<Input.TextArea rows={2} placeholder="请输入备注"/>
                <div style={{ lineHeight: "25px", textAlign: "left"}}>备注就冲你客户端就是说不定就收不到激活就是比较合适不大方便时间很长就会变成豆瓣v实践活动不得好死</div>
                )}
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={16}>
          <Col md={12} sm={24}>
            <Form.Item {...formItemLayout} label="上传合同" labelAlign="left">
                {getFieldDecorator('upload_v', {
                
                })(
                  <PicturesWall2 num={5}  canUpload={false}/>
                )}
              </Form.Item>
              
            
            </Col>
          </Row>
        </Form>
      </Card>
      }
      </div>
     
    );
  }
}
export default BasicInfo;
