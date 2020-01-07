import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { createPro, updateProInfo } from '@/services/projectManage';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Radio,
  DatePicker,
  message,
  InputNumber,
  Icon
} from 'antd';
import PicturesWall2 from '../../components/PicturesWall2/PicturesWall2';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import OrganizationSelect from './OrganizationSelect';
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
    prop_key: "",
  };

  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleSelectUserClick = item => {

    this.dispatch({
      type: 'projectManage/changeSelectUserFromOrganizationVisible',
      payload: true,
    });
  };

  formSubmit = () => {
    console.log('Step1');
    const {
      form,
      onSubmit,
      nextHandler,

      projectManage: { formID, formType },
    } = this.props;

    console.log('formType ' + formType);
    console.log('formID ' + formID);

    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log('保存的数据  ');
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
      } else if (formType === 'A') {
        response = await createPro(params);

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
  handleDataNewFormCancel = () => {
  
   
    this.dispatch({
      type: 'projectManage/changeSelectUserFromOrganizationVisible',
      payload: false,
    });
   
  };

  
  handleDataFormSubmit = data => {
    console.log("选择好了");

    // this.dispatch({
    //   type: 'projectManage/submit',
    //   payload: data,
    // });
    // this.clearSelectRows();
  };

  renderDataNewForm() {
    return (
      <OrganizationSelect
      onCancel={this.handleDataNewFormCancel}
      onSubmit={this.handleDataFormSubmit}
     
      />
    );
  }

  render() {
    const {
      projectManage: { formData, companyList, poltList,  },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    console.log('render Step1');

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
      <div>
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
                  initialValue: formData.type === undefined ? undefined : formData.type + '',
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
              <Form.Item {...formItemLayout} label="项目分管领导">
                {getFieldDecorator('leader', {
                  initialValue: formData.leader,
                  rules: [
                    {
                      required: true,
                      message: '请选择项目分管领导',
                    },
                  ],
                })(
                  <Input placeholder="请选择项目分管领导"   onClick={() => {this.handleSelectUserClick();}}/>

                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="项目负责人">
                {getFieldDecorator('person', {
                  initialValue: formData.person,
                  rules: [
                    {
                      required: true,
                      message: '请选择项目负责人',
                    },
                  ],
                })(
                  <Input placeholder="请选择项目负责人"   onClick={() => {this.handleSelectUserClick();}}/>
                  
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
                  initialValue:
                    formData.total_using_area === undefined
                      ? undefined
                      : (formData.total_using_area / 1000000.0).toFixed(2),
                  rules: [
                    {
                      required: true,
                      message: '请输入总用地面积',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请输入总用地面积"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
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

                    style={{ width: '100%' }}
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
                    style={{ width: '100%' }}
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
                  initialValue:
                    formData.ground_floor_area === undefined
                      ? undefined
                      : (formData.ground_floor_area / 1000000.0).toFixed(2),
                  rules: [
                    {
                      required: true,
                      message: '请输入地上建筑面积',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请输入地上建筑面积"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="地下建筑面积(km²)">
                {getFieldDecorator('underground_floor_area', {
                  initialValue:
                    formData.underground_floor_area === undefined
                      ? undefined
                      : (formData.underground_floor_area / 1000000.0).toFixed(2),
                  rules: [
                    {
                      required: true,
                      message: '请输入地下建筑面积',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请输入地下建筑面积"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
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
                  <InputNumber
                    placeholder="请输入地上容积率"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
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
                  <InputNumber
                    placeholder="请输入地下容积率"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="可确权面积(km²)">
                {getFieldDecorator('identi_area', {
                  initialValue:
                    formData.identi_area === undefined
                      ? undefined
                      : (formData.identi_area / 1000000.0).toFixed(2),
                  rules: [
                    {
                      required: true,
                      message: '请输入可确权面积',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请输入可确权面积"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="可售面积(km²)">
                {getFieldDecorator('sale_area', {
                  initialValue:
                    formData.sale_area === undefined
                      ? undefined
                      : (formData.sale_area / 1000000.0).toFixed(2),
                  rules: [
                    {
                      required: true,
                      message: '请输入可售面积',
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请输入可售面积"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Form.Item
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 20,
                }}
                label="项目相关证书"
              >
                <span style={{ color: 'red' }}>（图片上传格式jpg,jpeg,png）</span>
                {getFieldDecorator('files', {
                  initialValue: formData.files ? formData.files : '',
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<PicturesWall2 num={5} listType="picture-card" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {this.renderDataNewForm()}
      </div>
    );
  }
}
