import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, Steps, Button, message } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import Step1 from './Step1';
import Step2 from './Step2';
//import Step3 from './Step3';
// import GetLocation from './GetLocation';

const { Step } = Steps;
const steps = [
  {
    title: '基本信息',
    content: 'First-content',
  },
  {
    title: '项目业态',
    content: 'Second-content',
  },
  {
    title: '交付标准',
    content: 'Last-content',
  },
];

@connect(state => ({
  projectManage: state.projectManage,
}))
@Form.create()
class ProjectManageCardNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'projectManage/queryCompany',
    });
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  onOKClick = () => {

    console.log("哈哈哈1")
    const { form, onSubmit } = this.props;

      setTimeout(() => {
        const { current } = this.state;
        if (current === 0) {
          this.step1();
        }
        if (current === 1) {
          this.step2();
        }
        if (current === 2) {
          this.step3();
        }
      }, 1);
  

   
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  showStep = step => {
    console.log("showStep");
    const cobj = { step, formVisible: step !== -1 };
   // const columnid = this.getColumnId();
    // if (!columnid) {
    //   cobj.step = 0;
    // }
    const current = step;
    this.setState({ current });

    this.setState({ ...cobj });
  };
  idHandler = id => {
    console.log("idHandler");
    this.setState({ id });
  };



  setStep1Submit = handler => {
    console.log("setStep1Submit");
    this.step1 = handler;
  };

  step1Next = () => {
    console.log("step1Next");
    this.showStep(1);
    this.setState({ chg: true });
  };

  step2Next = () => {
    this.showStep(2);
  };

  step3Next = () => {
    this.showStep(-1);
    this.execCallback();
  };

  setStep2Submit = handler => {
    this.step2 = handler;
  };

  setStep3Submit = handler => {
    this.step3 = handler;
  };
  render() {
    const { current } = this.state;
    const {
      projectManage: { formTitle, newFormVisible, formData, submitting, companyList, poltList },
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
      <Modal
        title={
          <Row>
            <Col span={3}>{formTitle}</Col>
            <Col span={18}>
              <Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Col>
          </Row>
        }
        width="60%"
     
        visible={newFormVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <div>
          {/* <div className="steps-content">{steps[current].content}</div> */}
          <div className="steps-action">
            {current  ==0 && (
             <Step1
             //id={columnid}
             callback={this.setStep1Submit}
             idHandler={this.idHandler}
             nextHandler={this.step1Next}
           //  org={orgid}
           />
            )}
            {current === 1 && (
             <Step2
             //id={columnid}
             callback={this.setStep2Submit}
             idHandler={this.idHandler}
             nextHandler={this.step2Next}
           //  org={orgid}
           />
            )}
            {current === 2 && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                Previous
              </Button>
            )}
          </div>
        </div>
       
      </Modal>
    );
  }
}

export default ProjectManageCardNew;
