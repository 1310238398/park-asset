import React,{ PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, Tabs, Card, Button } from 'antd';
import SettleInformation from './SettleInformation';
import ToSettledInformation from './ToSettledInformation';
import TransitInformation from './TransitInformation';
import PlaneInformation from './PlaneInformation';
import TransferInformation from './TransferInformation';

import DescriptionList from '@/components/DescriptionList';
import { getDynamicCostProjDetail } from '@/services/dynamicCostProj';

import styles from './DynamicCostShow.less';

const { TabPane } = Tabs;

const { Description } = DescriptionList;


class DynamicCostProjDetail extends PureComponent{

    state = {
        info : null,
        temp_info : null,
    }

    async componentWillMount(){

        const { info } = this.props;
        this.setState({ temp_info : info });
        getDynamicCostProjDetail(info).then(res => {
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ info : res });
            }
        });
    }

    renderFirstView = () => {
        const {
            info
        } = this.state;
        
        return(
          <div className={styles.main}>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="科目名称">{info.cost_name.toString() }</Description>
                <Description term="目标金额">{info.target_cost.toString()}</Description>
                <Description term="结算金额">{info.settled.toString()}</Description>
              </DescriptionList>
            </div>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="待结算金额">{ info.unsettled.toString() }</Description>
                <Description term="在途金额">{ info.on_approval.toString() }</Description>
                <Description term="剩余规划余额">{  info.left_plan_amount.toString() }</Description>
              </DescriptionList>
            </div>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="最终成本">{ info.all.toString() }</Description>
                <Description term="调动金额">{ info.transfer.toString() }</Description>
                <Description term="余额">{ info.balance.toString() }</Description>
              </DescriptionList>
            </div>
          </div>
        ) ;
      };

    render(){

        const { formVisiable, cancel, projectID } = this.props;

        const { info, temp_info } = this.state;
        
        return (
            <Modal
                title = '科目详情'
                width = {1000}
                visible = { formVisiable }
                maskClosable = { false }
                destroyOnClose
                onCancel = {cancel}
                confirmLoading={false}
                footer={[
                    <Button key="back" onClick={cancel}>
                      关闭
                    </Button>,
                ]}
                style={{ top: 20 }}
                bodyStyle={{ height: 700, overflowY: 'scroll' }}
            >
                {info &&  this.renderFirstView()}
                <Card bordered={true}>
                    {info && <Tabs defaultActiveKey="1">
                        <TabPane tab="结算信息" key="1">
                            <SettleInformation subject_id={info.proj_cost_id} projectID={projectID}></SettleInformation>
                        </TabPane>
                        <TabPane tab="待结算信息" key="2">
                            <ToSettledInformation subject_id={info.proj_cost_id} projectID={projectID}></ToSettledInformation>
                        </TabPane>
                        <TabPane tab="在途信息" key="3">
                            <TransitInformation subject_id={info.proj_cost_id} projectID={projectID}></TransitInformation>
                        </TabPane>
                        <TabPane tab="规划信息" key="4">
                            <PlaneInformation subject_id={info.proj_cost_id}></PlaneInformation>
                        </TabPane>
                        {
                          !temp_info.children && 
                          <TabPane tab="调动信息" key="5">
                            <TransferInformation subject_id={info.proj_cost_id}></TransferInformation>
                        </TabPane>
                        }
                    </Tabs> }
                </Card>
            </Modal>
        )
    }
}

export default DynamicCostProjDetail;