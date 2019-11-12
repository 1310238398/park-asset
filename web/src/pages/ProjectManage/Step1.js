import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, DatePicker, message } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';

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
    this.dispatch({
      type: 'projectManage/queryCompany',
    });
  }
 
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  

  formSubmit = () => {
   
    console.log("Step1");
      const { form, onSubmit ,nextHandler} = this.props;
  
      form.validateFieldsAndScroll(async (err, values) => {
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
      //  onSubmit(formData);

           // 新增  这块不明白
          //  const response = await columns.submitColumnAdd(formData);
          //  if (response && response.column_id) {
          //    message.success('保存成功');
          //    idHandler(response.column_id);
          //    if (nextHandler) nextHandler();
          //  }

          message.success('保存成功');
          if (nextHandler) nextHandler();
      });
   
  };

  render() {
    const {
      projectManage: {  formData, companyList, poltList },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

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
              //initialValue: formData.name,
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
              //initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入项目类型',
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
             // initialValue: formData.address,
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
             // initialValue: formData.plot_id,
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
              //initialValue: formData.org_id,
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
          <Form.Item {...formItemLayout} label="资产类型">
            {getFieldDecorator('asset_type', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请选择资产类型',
                },
              ],
            })(
              <DicSelect
                vmode="sting"
                pcode="pa$#atype"
                placeholder= '请选择资产类型'
                selectProps={{ mode: 'multiple', placeholder: '请选择' }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="项目开始时间">
            {getFieldDecorator('start_time', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(
              <DatePicker 
              showTime
              
              style={{width:"100%"}}
              placeholder="请选择开始时间"
              format="YYYY-M-D HH:mm"
             // locale={locale}
              />
            
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="项目结束时间">
            {getFieldDecorator('end_time', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请选择结束时间',
                },
              ],
            })(
              <DatePicker 
               showTime
               style={{width:"100%"}}
              placeholder="请选择结束时间"
              format="YYYY-M-D HH:mm"
              //locale={locale}
               />
            
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="总用地面积(km²)">
            {getFieldDecorator('total_land_area', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入总用地面积',
                },
              ],
            })(
              <Input placeholder="请输入总用地面积" />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="总建筑面积(km²)">
            {getFieldDecorator('total_build_area', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入总建筑面积',
                },
              ],
            })(
              <Input placeholder="请输入总建筑面积" />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="地上容积率">
            {getFieldDecorator('up_plot_ratio', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入地上容积率',
                },
              ],
            })(
              <Input placeholder="请输入地上容积率" />
            )}
          </Form.Item>
        </Col> 
        <Col span={12}>
          <Form.Item {...formItemLayout} label="地下容积率">
            {getFieldDecorator('down_plot_ratio', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入地下容积率',
                },
              ],
            })(
              <Input placeholder="请输入地下容积率" />
            )}
          </Form.Item>
        </Col> 
      </Row>

      <Row>
      <Col span={12}>
          <Form.Item {...formItemLayout} label="地上可确权面积(km²)">
            {getFieldDecorator('up_identifiable_area', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入地上可确权面积',
                },
              ],
            })(
              <Input placeholder="请输入地上可确权面积" />
            )}
          </Form.Item>
        </Col> 
        <Col span={12}>
          <Form.Item {...formItemLayout} label="地下可确权面积(km²)">
            {getFieldDecorator('down_identifiable_area', {
             // initialValue: formData.asset_type,
              rules: [
                {
                  required: true,
                  message: '请输入地下可确权面积',
                },
              ],
            })(
              <Input placeholder="请输入地下可确权面积" />
            )}
          </Form.Item>
        </Col> 
      </Row>
      <Row>
      

        <Col span={12}>
          <Form.Item {...formItemLayout} label="项目相关证书">
          <span style={{ color: 'red' }}>（图片上传格式jpg,jpeg,png）</span>
            {getFieldDecorator('photo', {
             // initialValue: formData.photo ? [formData.photo] : '',
              rules: [
                {
                  required: false,
                  message: '请选择',
                },
              ],
            })(<PicturesWall num={1} bucket="oper" listType="picture-card" />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    );
  }
}
