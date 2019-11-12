import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio ,message} from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
export default class Step2 extends PureComponent {
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
    
      const { form, onSubmit,nextHandler } = this.props;
  
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
       // onSubmit(formData);
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
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Form>
    
    
     
      <Row>
        <Col span={12}>
          <Form.Item {...formItemLayout} label="资产性质">
            {getFieldDecorator('nature', {
            //  initialValue: formData.nature,
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
                selectProps={{ mode: 'multiple', placeholder: '请选择' }}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
     
    </Form>
    );
  }
}
