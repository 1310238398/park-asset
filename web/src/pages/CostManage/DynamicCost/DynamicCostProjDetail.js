import React,{ PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, Tabs, Card, Button } from 'antd';
import SettleInformation from './SettleInformation';

import DescriptionList from '@/components/DescriptionList';

import styles from './DynamicCostShow.less';

const { TabPane } = Tabs;

const { Description } = DescriptionList;


class DynamicCostProjDetail extends PureComponent{

    state = {
        info : null,
    }

    componentWillMount(){

        const { info } = this.props;
        //TODO查询接口,最新的数据。
        this.setState({ info : info });
    }

    renderFirstView = () => {
        const {
            info
        } = this.state;
    
        return (
          <div className={styles.main}>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="科目名称">{info.name.toString()}</Description>
                <Description term="目标金额">{info.target_cost.toString()}</Description>
                <Description term="结算金额">{info.settlement_amount.toString()}</Description>
              </DescriptionList>
            </div>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="待结算金额">{info.to_settled_amount.toString()}</Description>
                <Description term="在途金额">{info.transit_amount.toString()}</Description>
                <Description term="剩余规划余额">{info.remain_plann_amount.toString()}</Description>
              </DescriptionList>
            </div>
            <div className={styles.form} style={{ marginTop: 25 }}>
              <DescriptionList title="" size="large" col={6} style={{ marginBottom: 32 }}>
                <Description term="最终成本">{info.result_amount.toString()}</Description>
                <Description term="调动金额">{info.transfer_amount.toString()}</Description>
                <Description term="余额">{info.balance.toString()}</Description>
                {/* <Description term="调动金额">{info.transfer_amount}</Description>
                <Description term="余额">{info.balance}</Description> */}
              </DescriptionList>
            </div>
          </div>
        );
      };

    render(){

        const { formVisiable, cancel } = this.props;

        const { info } = this.state;

        // const formItemLayout = {
        //     labelCol: {
        //         span: 6,
        //     },
        //     wrapperCol: {
        //         span: 18,
        //     },
        // };

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
                // bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
                bodyStyle={{ height: 700, overflowY: 'scroll' }}
            >
                {/* <Form>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='科目名称'>
                                <Input value={info.name} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='目标金额'>
                                <Input value={info.target_cost} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='结算金额'>
                                <Input value={info.settlement_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='待结算金额'>
                                <Input value={info.to_settled_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='在途金额'>
                                <Input value={info.transit_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='剩余规划余额'>
                                <Input value={info.remain_plann_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='最终成本'>
                                <Input value={info.result_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='调动金额'>
                                <Input value={info.transfer_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='余额'>
                                <Input value={info.balance} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form> */}
                { this.renderFirstView()}
                <Card bordered={false}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="结算信息" key="1">
                            {/* 结算信息 */}
                            <SettleInformation subject_id={info.record_id}></SettleInformation>
                        </TabPane>
                        <TabPane tab="待结算信息" key="2">
                            结算信息
                        </TabPane>
                        <TabPane tab="在途信息" key="3">
                            在途信息
                        </TabPane>
                        <TabPane tab="规划信息" key="4">
                            规划信息
                        </TabPane>
                        <TabPane tab="调动信息" key="5">
                            调动信息
                        </TabPane>
                    </Tabs>
                </Card>
            </Modal>
        )
    }
}

export default DynamicCostProjDetail;