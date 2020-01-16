import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Steps, Card, Popover, Icon } from 'antd';
import point_img from '../../../assets/point@2x.png';
import styles from '../../ProjectManage/ProjectManage.less';

const { Step } = Steps;
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,

  loading: state.loading.models.entrustedConstruction,
}))
class ApprovalProgress extends PureComponent {
  state = {};
  componentDidMount = async () => {
    const {
      entrustedConstruction: { formID, formType },
    } = this.props;
  };
  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  testDiv = description => {
    return (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width:200 }}>
  <div>{description.role}:&nbsp;{description.name}</div>
  {
    description.reason !== "" &&
    <div>拒绝原因:&nbsp;{description.reason}</div>
  }
  <div>时间:&nbsp;{description.time}</div>
  {
    description.urge && <a>催一下</a>
  }
   </div>
    );
  };
  render() {
    const {
      entrustedConstruction: { formType },
    } = this.props;
    const list = [ 
      {
        // icon: point,
        description: {
          name: '徐丽丽',
          role: '大客户经理',
          time: '2020-01-12 11:20',
          reason: '',
          urge: false,
        },
        status: 'finish',
        title: '提交审核',
      },
      {
        // icon: point,
        description: {
          name: '张三',
          role: '营销负责人',
          time: '2020-01-12 11:20',
          reason: '',
          urge: false,
        },
        status: 'finish',
        title: '已审核',
      },
      {
        // icon: point,
        description: {
          name: '李四',
          role: '项目负责人',
          time: '2020-01-12 11:20',
          reason: '',
          urge: true,
        },
        status: 'process',
        title: '审核中',
      },
      {
        
        // icon: point,
        description: {
          name: '李四',
          role: '项目分管领导',
          time: '2020-01-12 11:20',
          reason: '',
          urge: false,
        },
        status: 'wait',
        title: '未审核',
      },
     
      
      
    ];

   

    const customDot = (dot, { status, index }) => (
      <Popover
        content={
          <span>
            step {index} status: {status}
          </span>
        }
      >
        {dot}
      </Popover>
 
    );

    return (
      <Card bordered={false}>
      
        <Steps
       
        >
          {list.map(item => (
            <Step
              title={item.title}
              description={this.testDiv(item.description)}
              status={item.status}
             // style={{ width:200, display: "flex", justifyContent: "center"}}  
            ></Step>
          ))}
         
        </Steps>
      
      </Card>
    );
  }
}
export default ApprovalProgress;
