import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, InputNumber } from 'antd';

import DicSelect from '@/components/DictionaryNew/DicSelect';

import { createContractPlanProj } from '@/services/contractPlanProj';

@Form.create()
class ContractProCard extends PureComponent{

    state = {
        info : null,
        save_num : 0,
    }

    componentWillMount(){
        //若为修改的操作
        //查询接口数据--得到最新的数据--赋值给info

        //若为添加的操作，不做操作

        // const { projectID } = this.props;
        // console.log(projectID);
    }

    onOKClick = () => {
        const { form, editInfo, node, onSave, projectID } = this.props;
        const { save_num } = this.state;
        let num = save_num +1;
        this.setState({ save_num : num });
        if(num === 1){
            form.validateFieldsAndScroll((err,value) => {
                if(err){
                    return;
                }
                const tempInfo = {...value};
                if(editInfo){
                    const submitInfo = {...editInfo };
                    submitInfo.name = tempInfo.name;
                    submitInfo.contract_type = parseInt(tempInfo.contract_type);
                    submitInfo.planning_price = tempInfo.planning_price;
                    submitInfo.planning_change = tempInfo.planning_change;
                    submitInfo.information = tempInfo.information;
                    submitInfo.memo = tempInfo.memo;
                }else{
                    tempInfo.cost_id = node.cost_id;
                    tempInfo.project_id = projectID;
                    createContractPlanProj(tempInfo).then(res => {
                        if(res && res.error){
                            console.log(res.error);
                        }else{
                            onSave(true);
                        }
                    })
                }
            })
        }else{
            onSave();
        }
    }

    onCancel = () => {
        const { onSave } = this.props;
        onSave(false);
    }

    render(){

        const {
            formVisible,
            form : { getFieldDecorator },
            node,
            topInfo,
        } = this.props;

        const { info } = this.state;

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
        const formItemLayout1 = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const formItemLayout2 = {
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 20,
            },
        };

        return (
            <Modal
                title ={ info ? '编辑合约规划' : '添加合约规划'}
                width = {800}
                visible = {formVisible}
                maskClosable = { false }
                destroyOnClose
                onCancel = {this.onCancel}
                onOk = {this.onOKClick}
                style={{ top: 20 }}
                bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
            >
                <Form>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='科目名称'>
                                <Input value={node.name} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='目标金额'>
                                <Input value={topInfo.target_cost} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='规划金额'>
                                <Input value={topInfo.plan_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='规划余量'>
                                <Input value={topInfo.left_amount} readOnly={true}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout} label='合同名称'>
                                {getFieldDecorator('name', {
                                    initialValue : info ? info.name : '', 
                                    rules : [
                                        {
                                            required : true,
                                            message : '请输入合同名称'
                                        }
                                    ],

                                })(<Input placeholder='请输入合同名称' />)}

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label='合同类别'>
                                {getFieldDecorator('contract_type', {
                                    initialValue: info ? info.contract_type : null,
                                    rules: [
                                    {
                                        required: true,
                                        message: '请选择合同类别',
                                    },
                                    ],
                                })(
                                    <DicSelect
                                    vmode="int"
                                    pcode="contract$#contractType"
                                    selectProps={{ placeholder: '请选择' }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={24}>
                            <Form.Item {...formItemLayout1} label='合同预估金额'>
                                {getFieldDecorator('planning_price', {
                                    initialValue : info ? info.planning_price : 0, 
                                    rules : [
                                        {
                                            required : true,
                                            message : '请输入合同预估金额'
                                        }
                                    ],

                                })(<InputNumber placeholder='请输入合同预估金额' min={0}/>)}

                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...formItemLayout1} label='合同预估变更金额'>
                                {getFieldDecorator('planning_change', {
                                    initialValue : info ? info.planning_change : 0, 
                                    rules : [
                                        {
                                            required : true,
                                            message : '请输入合同预估变更金额'
                                        }
                                    ],

                                })(<InputNumber placeholder='请输入合同预估变更金额' min={0} />)}

                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <Form.Item {...formItemLayout2} label='合约内容'>
                                {getFieldDecorator('information', {
                                    initialValue : info && info.information ? info.information : '',
                                })(<Input.TextArea rows={4} placeholder='请输入合约内容'/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18}>
                            <Form.Item {...formItemLayout2} label='备注'>
                                {getFieldDecorator('memo', {
                                    initialValue : info ? info.memo : '',
                                })(<Input.TextArea rows={4} placeholder='请填写备注内容'/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        )
    }
}

export default ContractProCard;