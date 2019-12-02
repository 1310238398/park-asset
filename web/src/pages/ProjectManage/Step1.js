import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { createPro, updateProInfo } from '@/services/projectManage';
import { Form, Input, Modal, Row, Col, Select, Radio, DatePicker, message , InputNumber} from 'antd';
import PicturesWall2 from '../../components/PicturesWall2/PicturesWall2';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
export default class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    const { callback } = this.props;
    callback(this.formSubmit);
   
  }



  state = {
    formData: {},
    treeData: [],
  };

  componentDidMount() {
   
  }
 
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  

  formSubmit = () => {
   
    console.log("Step1");
      const { form, onSubmit ,nextHandler,
      
        projectManage: { formID, formType },
      } = this.props;
     

      console.log("formType "+ formType);
      console.log("formID "+ formID);
  
      form.validateFieldsAndScroll(async (err, values) => {
        if (err) {
          return;
        }
        const formData = { ...values };
        console.log("保存的数据  ");
        console.log(formData);
        if (formData.files && formData.files.length > 0) {
          //formData.files = formData.files.join('');
        
          for (let i = 0; i < formData.files.length; i++) {
           
            formData.files[i].project_id = formID;
          }
        } else {
          formData.files = [];
        }

        formData.type = parseInt(formData.type);
  
        this.dispatch({
          type: 'projectManage/changeNewFormVisible',
          payload: true,
        });
        let response;
        const params = { ...formData };
        if (formType === 'E') {
         
          params.record_id = formID;
          response = await updateProInfo(params);
          if (response && response.record_id) { 
            message.success('保存成功');
           // idHandler(response.column_id);
            if (nextHandler) nextHandler();
          }
        
        }
        else if (formType === 'A') {
         
          response =   await createPro(params);

          if (response && response.record_id) {
            message.success('保存成功');

            this.dispatch({
              type: 'projectManage/saveFormID',
              payload: response.record_id,
            });
           // idHandler(response.column_id);
            if (nextHandler) nextHandler();
          }
        }


        
      });
   
  };

  render() {
    const {
      projectManage: {  formData, companyList, poltList },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    console.log("render Step1");

    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 12,
      },
    };
    return (
      <Form>
      <Row>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="项目名称">
            {getFieldDecorator('name', {
              initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入项目名称',
                },
              ],
            })(<Input placeholder="请输入项目名称" />)}
          </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item {...formItemLayout} label="项目类型">
              {getFieldDecorator('type', {
              initialValue: formData.type +"",
              rules: [
                {
                  required: true,
                  message: '请选择项目类型',
                },
              ],
              })(
                <DicSelect
                  vmode="sting"
                  pcode="pro"
                  placeholder="请选择项目类型"
                  selectProps={{ placeholder: '请选择' }}
                />
              )}
            </Form.Item>
          </Col>
    
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="项目地址">
            {getFieldDecorator('address', {
              initialValue: formData.address,
              rules: [
                {
                  required: true,
                  message: '请输入项目地址',
                },
              ],
            })(<Input placeholder="请输入项目地址" />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="所属地块">
            {getFieldDecorator('plot_id', {
              initialValue: formData.plot_id,
              rules: [
                {
                  required: true,
                  message: '请选择地块',
                },
              ],
            })(
              <Select placeholder="请选择地块" style={{ width: '100%' }}>
                {poltList &&
                  poltList.map(item => (
                    <Select.Option key={item.record_id} value={item.record_id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
     
      <Row>
      <Col span={12}>
          {/* 嵌入高德地图--经纬度 */}
          <Form.Item {...formItemLayout} label="所属公司">
            {getFieldDecorator('org_id', {
              initialValue: formData.org_id,
              rules: [
                {
                  required: true,
                  message: '请选择公司',
                },
              ],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {companyList &&
                  companyList.map(item => (
                    <Select.Option key={item.record_id} value={item.record_id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item {...formItemLayout} label="总用地面积(km²)">
            {getFieldDecorator('total_using_area', {
              initialValue: formData.total_using_area,
              rules: [
                {
                  required: true,
                  message: '请输入总用地面积',
                },
              ],
            })(
              <InputNumber placeholder="请输入总用地面积" />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="项目开始时间">
            {getFieldDecorator('start_time', {
              initialValue: moment(formData.start_time),
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(
              <DatePicker 
              //showTime
              
              style={{width:"100%"}}
              placeholder="请选择开始时间"
              format="YYYY-MM-DD"
             // locale={locale}
              />
            
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="项目结束时间">
            {getFieldDecorator('end_time', {
              initialValue: moment(formData.end_time),
              rules: [
                {
                  required: true,
                  message: '请选择结束时间',
                },
              ],
            })(
              <DatePicker 
              // showTime
               style={{width:"100%"}}
              placeholder="请选择结束时间"
              format="YYYY-MM-DD"
              //locale={locale}
               />
            
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
      <Form.Item {...formItemLayout} label="地上建筑面积(km²)">
            {getFieldDecorator('ground_floor_area', {
              initialValue: formData.ground_floor_area,
              rules: [
                {
                  required: true,
                  message: '请输入地上建筑面积',
                },
              ],
            })(
              <InputNumber placeholder="请输入地上建筑面积" />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="地下建筑面积(km²)">
            {getFieldDecorator('underground_floor_area', {
              initialValue: formData.underground_floor_area,
              rules: [
                {
                  required: true,
                  message: '请输入地下建筑面积',
                },
              ],
            })(
              <InputNumber placeholder="请输入地下建筑面积" />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="地上容积率">
            {getFieldDecorator('ground_volume_rate', {
              initialValue: formData.ground_volume_rate,
              rules: [
                {
                  required: true,
                  message: '请输入地上容积率',
                },
              ],
            })(
              <InputNumber placeholder="请输入地上容积率" />
            )}
          </Form.Item>
        </Col> 
        <Col span={12}>
          <Form.Item {...formItemLayout} label="地下容积率">
            {getFieldDecorator('underground_volume_rate', {
              initialValue: formData.underground_volume_rate,
              rules: [
                {
                  required: true,
                  message: '请输入地下容积率',
                },
              ],
            })(
              <InputNumber placeholder="请输入地下容积率" />
            )}
          </Form.Item>
        </Col> 
      </Row>

      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="可确权面积(km²)">
            {getFieldDecorator('identi_area', {
              initialValue: formData.identi_area,
              rules: [
                {
                  required: true,
                  message: '请输入可确权面积',
                },
              ],
            })(
              <InputNumber placeholder="请输入可确权面积" />
            )}
          </Form.Item>
        </Col> 
        <Col span={12}>
          <Form.Item {...formItemLayout} label="可售面积(km²)">
            {getFieldDecorator('sale_area', {
              initialValue: formData.sale_area,
              rules: [
                {
                  required: true,
                  message: '请输入可售面积',
                },
              ],
            })(
              <InputNumber placeholder="请输入可售面积" />
            )}
          </Form.Item>
        </Col> 
      </Row>
      <Row>
      

        <Col span={24} style={{ textAlign: "left"}}>
          <Form.Item   
          labelCol= {{
              span: 4,
          }
      
      }
      wrapperCol= {
        {
           span: 20,
        }
       
      } label="项目相关证书">
          <span style={{ color: 'red' }}>（图片上传格式jpg,jpeg,png）</span>
            {getFieldDecorator('files', {
              initialValue: [],//formData.files ? [formData.files] : '',
              rules: [
                {
                  required: false,
                  message: '请选择',
                },
              ],
            })(<PicturesWall2  num={5} listType="picture-card" />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    );
  }
}
