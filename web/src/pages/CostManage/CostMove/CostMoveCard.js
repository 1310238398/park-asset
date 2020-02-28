import React,{ PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, TreeSelect }  from 'antd';

@Form.create()
class CostMoveCard extends PureComponent{

    state = {
        treeData : [],
        tranf_balance : null,
    }

    componentWillMount(){
        const { contractInfo } = this.props;
        this.setState({ tranf_balance : contractInfo.balance });
        //查询列表数据得到数据进行测试
    }

    onCancel = () =>{
        const { onCostMove } =  this.props;

        onCostMove();
    }

    onOKClick = () => {
        const { onCostMove } = this.props;

        onCostMove(true);
    }



    render(){

        const {
            formVisible,
            staticInfo,
            contractInfo
        } =  this.props;

        const { tranf_balance } = this.state;

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };

        return(
            <Modal
                title = '成本调动'
                visible = { formVisible }
                maskClosable = { false }
                destroyOnClose
                onCancel = {this.onCancel}
                onOk = {this.onOKClick}
                style={{ top: 20 }}
                bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
                width = { 800 }
            >
                <Form>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='科目名称'>
                                <Input value={staticInfo.cost_name} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='目标金额'>
                                <Input value={staticInfo.target_cost} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='规划金额'>
                                <Input value={staticInfo.plan_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='规划余量'>
                                <Input value={staticInfo.left_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='合同名称'>
                                <Input value={contractInfo.contract_name} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='余额'>
                                <Input value={contractInfo.balance} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='调整后余额'>
                                <Input value={tranf_balance} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col md={12} sm={24}>
                            <TreeSelect
                                treeData = { treeData }
                                style = {{ width : 200 }}
                                onChange={this.handleProChange}
                            >

                            </TreeSelect>
                        </Col>
                    </Row> */}
                </Form> 

            </Modal>
        )
    }
}

export default CostMoveCard;