import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  updateProFormat } from '@/services/projectManage';
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
       name:"业态1",
       record_id: "a",
       checked: true,
       floor_area:55
     },
     {
      name:"业态1",
      record_id: "b",
      checked: false,
      floor_area:66
    }
     
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
    const { form, onSubmit, nextHandler,
    projectManage:{allBusinessFormat}
    } = this.props;

    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {


        return;
      }
      const formData = { ...values };

      console.log("fromData "+ JSON.stringify(formData));
      
      let hasDataCount = 0;
      for (let i = 0; i < allBusinessFormat.length; i++) {

        let item = allBusinessFormat[i];
        if (formData[item.record_id]) {
          hasDataCount++;

        }
        
        console.log(formData[item.record_id]);
        console.log(formData[item.record_id+"mj"]);
       
        if (i == (allBusinessFormat.length - 1) && hasDataCount == 0) {
          message.warning('请至少选择一个业态');

          return;
        }

      }

      // 处理界面数据达到接口要求
     

     
    
      // onSubmit(formData);
      let res = await updateProFormat(this.formatData(formData));
      if (res && res.status === "OK") {
         message.success('保存成功');
      if (nextHandler) nextHandler();
      }

     
    });
  };

  // 将formData原始数据整理成接口需要的数据

formatData(forData) {
  const { 
    projectManage:{allBusinessFormat, formID}
    } = this.props;
  let temp =[];
  for (let i = 0; i < allBusinessFormat.length; i++) {

  
   
    if (forData[allBusinessFormat[i].record_id]!== undefined && forData[allBusinessFormat[i].record_id] === true) {

      allBusinessFormat[i].floor_area = forData[allBusinessFormat[i].record_id+"mj"];
      allBusinessFormat[i].checked = undefined;
      allBusinessFormat[i].project_id = formID;
      allBusinessFormat[i].business_format_id = allBusinessFormat[i].record_id;

      temp.push( allBusinessFormat[i]);
    }
  }

  console.log("temp "+ JSON.stringify(temp));

  return temp;


}
  getCheckChange(event) {
    console.log("event "+ JSON.stringify(event));

  }

  render() {
    const {
      projectManage: { businessFormat, allBusinessFormat  },
      form: { getFieldDecorator, getFieldValue },
      onCancel,
    } = this.props;
    const { yetai } = this.state;
 
 
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
               allBusinessFormat && allBusinessFormat.map((item, index) => 
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
                 valuePropName: 'checked',
                 initialValue: item.checked,
                
                })( <Checkbox    onChange={() => {}}>{item.name}</Checkbox>)}
                  </Form.Item>
                  
                </Col>
                <Col span={12}>
                <Form.Item {...formItemLayout} label="建筑面积">
                {getFieldDecorator(item.record_id+"mj", {
                  initialValue: item.floor_area,
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