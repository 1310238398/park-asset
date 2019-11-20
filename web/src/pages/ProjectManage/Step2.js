import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, message, Checkbox } from 'antd';
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
    yetai : [
      {
        record_id: "a",
        name: "住宅"
      },
     
    ]
   
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
    console.log('Step2');
    const { form, onSubmit, nextHandler } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {


        return;
      }
      const formData = { ...values };
      
      let hasDataCount = 0;
      for (let i = 0; i < this.state.yetai.length; i++) {

        let item = this.state.yetai[i];
        if (formData[item.code]) {
          hasDataCount++;

        }
        
        console.log(formData[item.code]);
        console.log(formData[item.code+"mj"]);
       
        if (i == (this.state.yetai.length - 1) && hasDataCount == 0) {
          message.warning('请至少选择一个业态');

          return;
        }

      }

     
    
      // onSubmit(formData);
      console.log(form.getFieldsValue());
      

      console.log(formData);
      message.success('保存成功');
      if (nextHandler) nextHandler();
    });
  };

  render() {
    const {
      projectManage: { businessFormat  },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
 
   

   
 
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

  
    return (
      <Form>

        <Row>
          <Col span={4} style={{textAlign:"right"}}><span style={{lineHeight:"40px"}}>选择相关业态：&nbsp;&nbsp;&nbsp;</span></Col>
          <Col span={20}>
          {
                businessFormat&&businessFormat.map((item, index) => 
                <Row
                style={{
                  height: '59px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Col span={4}>
                <Form.Item {...formItemLayout} label="" >
                {getFieldDecorator(item.record_id, {
                 // initialValue: item.name,
                
                
                })( <Checkbox value={item.record_id} >{item.name}</Checkbox>)}
                  </Form.Item>
                  
                </Col>
                <Col span={12}>
                <Form.Item {...formItemLayout} label="建筑面积">
                {getFieldDecorator(item.record_id+"mj", {
                 // initialValue: formData.address,
                  rules: [
                    {
                      required: getFieldValue(item.record_id),
                      message: '请输入建筑面积',
                    },
                  ],
                })(<Input  disabled={!getFieldValue(item.record_id)} placeholder="请输入建筑面积" />)}
              </Form.Item>
                </Col>
              </Row>)
              
              }

          </Col>
        </Row>
      
      
      </Form>
    );
  }
}
