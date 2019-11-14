import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, Select, Radio, Steps, Button, message } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
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
      current: 2,
    };
  }

  componentDidMount() {
    this.dispatch({
      type: 'projectManage/queryCompany',
    });
  }
  // execCallback = () => {
  //   const { chg } = this.state;
  //   const {
  //     projectManage: {  newFormVisible },

  //   } = this.props;
  //  // this.props.callback(chg && 'ok');
  //   this.setState({ newFormVisible: false });
  // };

  // next() {
  //   const current = this.state.current + 1;
  //   this.setState({ current });
  // }

  // prev() {
  //   const current = this.state.current - 1;
  //   this.setState({ current });
  // }

  onOKClick = () => {
    console.log('哈哈哈1');
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

  onCancelClick = () => {
    console.log('onCancelClick');
    const { onCancel } = this.props;
    this.setState({ current: 2 });

    onCancel();
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  showStep = step => {
    console.log('showStep');

    const current = step !== -1 ? step : 0;
    this.setState({ current });

    if (step === -1) {
      this.handleDataNewFormCancel();
    }
    //
  };
  handleDataNewFormCancel = () => {
    this.dispatch({
      type: 'projectManage/changeNewFormVisible',
      payload: false,
    });
  };
  idHandler = id => {
    console.log('idHandler');
    this.setState({ id });
  };

  setStep1Submit = handler => {
    console.log('setStep1Submit');
    this.step1 = handler;
  };

  step1Next = () => {
    console.log('step1Next');
    this.showStep(1);
  };

  step2Next = () => {
    this.showStep(2);
  };

  step3Next = () => {
    console.log('step3Next');
    this.showStep(-1);
    // this.execCallback();
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
        centered={true}
        visible={newFormVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose={true}
        onOk={this.onOKClick}
        onCancel={this.onCancelClick}
        //   style={{ height: 800 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', height: '500px', overflowY: 'auto' }}
      >
        <div>
          {/* <div className="steps-content">{steps[current].content}</div> */}
          <div className="steps-action">
            {current == 0 && (
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
              <Step3
                //id={columnid}
                callback={this.setStep3Submit}
                idHandler={this.idHandler}
                nextHandler={this.step3Next}
                //  org={orgid}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ProjectManageCardNew;
