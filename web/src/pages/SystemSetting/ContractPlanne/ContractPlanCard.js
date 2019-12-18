import React, { PureComponent } from 'react';

import { Modal, Form, Input, Row, Col } from 'antd';

import DicSelect from '@/components/DictionaryNew/DicSelect';

import { updateContractPlan, queryContractPlanById, createContactPlan } from '@/services/contractPlanManage';

@Form.create()
class ContractPlanCard extends PureComponent{

    state = {
        info : null,
        node : null,
    }

    componentWillMount(){ 
        const {  editinfo, node, editFlag } = this.props;
        if(editFlag){
            //查询接口，得到最新数据
            queryContractPlanById(editinfo).then(res =>{
                if(res && res.error){
                    console.log(res.error.message);
                }else{
                    this.setState({ info: res });
                }
            })
        }else{
            this.setState({ info : editinfo });
        }
        this.setState({ node : node });
    }

    onOKClick = () =>{
        const { form, editinfo, node, editFlag, onSave } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if(err){
                return;
            }
            const tempInfo = {...values};
            tempInfo.contract_type = parseInt(tempInfo.contract_type,10);
            tempInfo.cost_id = node.record_id;
            if(editFlag){ //修改
                tempInfo.record_id = editinfo.record_id;
                //调用修改接口
                updateContractPlan(tempInfo).then(res => {
                    if(res && res.error){
                        console.log(res.error.message);
                    }
                    onSave(true);
                })
            }else{
                //添加的接口
                createContactPlan(tempInfo).then(res => {
                    if(res && res.error){
                        console.log(res.error.message);
                    }else{
                        onSave(true);
                    }
                })

            }
        })
    };

    onCancel = () => {
        const { onSave } = this.props;
        onSave();
    }

    render(){

        const {
            formVisible,
            form : { getFieldDecorator },
            editFlag,
        } = this.props;

        const { info, node } = this.state;

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
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
        return(
            <Modal
                title={info ? '编辑合约规划模板' : '添加合约规划模板'}
                width = {800}
                visible = {formVisible}
                maskClosable = { false }
                destroyOnClose
                onOk={this.onOKClick}
                onCancel={this.onCancel}
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
                    </Row>
                    <Row>
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
                        <Col span={18}>
                            <Form.Item {...formItemLayout2} label='核算内容'>
                                {getFieldDecorator('information', {
                                    initialValue : info ? info.information : '',
                                })(<Input.TextArea rows={4} placeholder='请输入核算内容'/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        )
    }
}

export default ContractPlanCard;