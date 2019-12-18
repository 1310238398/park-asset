import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Card,
  Modal,
  InputNumber,
  Row,
  Col,
  Radio,
  Tabs,
  Button,
  Select,
  TreeSelect,
  DatePicker
} from 'antd';
import DicSelect from '@/components/DictionaryNew/DicSelect';
// import ContractPlanning from './ContractPlanning';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import UploadFile from '@/components/UploadFile/UploadFile';
import ProSelect from '@/components/ProSelectID/ProSelect';
import MaterialPricingForm from './MaterialPricingForm';

@connect(({ materialPricing }) => ({
  materialPricing,
}))
@Form.create()
class MaterialPricingDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.custom = React.createRef();
    this.agreement = React.createRef();
    this.state = {
      value: undefined,
    };
  }

 
  // 甲方单位模糊匹配
  handleChangePro = e => {
    console.log(e);
    this.setState({ project_id: e });
    this.dispatch({
      type: 'materialPricing/saveProjectID',
      payload: e,
    });
  };

  onOKClick = () => {
    const {
      form,
      materialPricing: { proData },
      onSubmit,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let formData = { ...values };
        formData.project_id = proData.record_id;
        formData.parent_id = '';
        if (formData && formData.building_area) {
          formData.building_area = Math.round(Number(formData.building_area) * 100);
        }
        if (formData && formData.rent_area) {
          formData.rent_area = Math.round(Number(formData.rent_area) * 100);
        }

        onSubmit(formData);
      }
    });
  };

  // 合约规划是否引用完选择发生变化
  finishquotingSelect = value => {
    if (value === '1') {
      this.props.dispatch({
        type: 'materialPricing/changeFormVisibleFinishquoting',
        payload: true,
      });
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 乙方单位选择的书库

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
      materialPricing: {
        formVisibleMaterialPricing,
        formTitleMaterialPricing,
        formDataMaterialPricing,
        submitting,
        formTypeMaterialPricing,
        proData,
        treeData,
      },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { TabPane } = Tabs;
    const { Option } = Select;
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
    const formItemLayout3 = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <Modal
        title={formTitleMaterialPricing}
        width={1200}
        visible={formVisibleMaterialPricing}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card title="基本信息" style={{marginBottom:20}}>
          <MaterialPricingForm></MaterialPricingForm>
        </Card>
        <Card title="其他信息">
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="备注">
                {getFieldDecorator('remark', {
                  initialValue: formDataMaterialPricing.remark,
                  rules: [
                    {
                      required: false,
                      message: '请输入备注',
                    },
                  ],
                })(<Input.TextArea rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label="附件">
                {getFieldDecorator('memo', {
                  initialValue: formDataMaterialPricing.memo,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<UploadFile bucket="contract" />)}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default MaterialPricingDetail;
