import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';
// import GetLocation from './GetLocation';

@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
class ProjectManageCard extends PureComponent {
  // state = {
  //   showMap: false,
  // };

  componentDidMount() {
    this.dispatch({
      type: 'projectManage/queryCompany',
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

  // // 地图选取经纬度
  // changeMap() {
  //   this.setState({ showMap: true });
  // }

  // // 关闭地图
  // cancelMap() {
  //   this.setState({ showMap: false });
  // }

  // // 地图经纬度
  // onDataMap(data) {
  //   // console.log('经纬度', data);
  //   const { form } = this.props;
  //   // let buildings = form.getFieldValue('location');
  //   form.setFieldsValue({ location: data });
  // }

  // renderMap() {
  //   if (this.state.showMap) {
  //     return (
  //       <div>
  //         <GetLocation onCancel={this.cancelMap} onSubmit={this.onDataMap} />
  //       </div>
  //     );
  //   }
  // }

  render() {
    const {
      projectManage: { formTitle, formVisible, formData, submitting, companyList },
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
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="项目地址">
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
          </Row>
          {/* <Row>
          <Col span={24}>
             
              <Form.Item {...formItemLayout2} label="所在位置">
                {getFieldDecorator('location', {
                  initialValue: formData.location,
                  rules: [
                    {
                      required: false,
                      message: '请输入位置',
                    },
                  ],
                })( 
                 <GetLocation onCancel={this.cancelMap} onSubmit={this.onDataMap} address={this.props.form.getFieldValue('floor_area')} />
                  // <Input
                  //   placeholder="请输入位置"
                  //   suffix={
                  //     <Tooltip title="地图选取位置">
                  //       <Icon
                  //         type="environment"
                  //         style={{ color: 'rgb(47, 84, 235)' }}
                  //         onClick={() => this.changeMap()}
                  //       />
                  //     </Tooltip>
                  //   }
                  // />
                )}
              </Form.Item>
            </Col>
                </Row> */}
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="资产性质">
                {getFieldDecorator('nature', {
                  initialValue: formData.nature,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <DicSelect
                    vmode="int"
                    pcode="pa$#anature"
                    selectProps={{ placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item {...formItemLayout} label="资产类型">
                {getFieldDecorator('asset_type', {
                  initialValue: formData.asset_type,
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
                    selectProps={{ mode: 'multiple', placeholder: '请选择' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="项目照片">
                {getFieldDecorator('photo', {
                  initialValue: formData.photo ? [formData.photo] : '',
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<PicturesWall num={1} bucket="park" listType="picture-card" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ProjectManageCard;
