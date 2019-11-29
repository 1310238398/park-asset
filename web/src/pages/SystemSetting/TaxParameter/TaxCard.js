import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, InputNumber, Radio,message } from 'antd';

import { create, get, update } from '@/services/taxManage';

@Form.create()
class TaxCard extends PureComponent {

    state = { info: null };
    componentWillMount() {

        const { info } = this.props;
        if(info){
            console.log("请求接口");
            // TODO 重新请求数据
            get(info).then(res=>{
                if(res && res.error){
                    console.log(res.error.message);
                }else{
                    this.setState({ info: res });
                }
            })
        }else{
            this.setState({ info: info });
        }

    }

    onOKClick = () => {
        // TODO 调取Service
        // 关闭弹窗
        const { onSave, form, info } = this.props;
        form.validateFields((err, values) => {
            if(err){
                return;
            }
            const submitInfo = { ...values };
            // console.log(submitInfo.tax_rate);
            // return;
            // if(submitInfo.tax_rate < 0){
            //     message.error("税率不能为负数");
            //     return;
            // }
            // if(submitInfo.submitInfo > 100){
            //     message.error("税率不能大于100");
            //     return;
            // }
            submitInfo.type = parseInt(submitInfo.type,10);
            submitInfo.tax_rate = submitInfo.tax_rate / 100;
            if(info){
                submitInfo.record_id = info.record_id;
                update(submitInfo).then(res=>{
                    if(res && res.error){
                        console.log(res.error.message);
                    }
                    onSave(true);
                });
            }else{
                create(submitInfo).then(res => {
                    if(res && res.error){
                        console.log(res.error.message);
                    }
                    onSave(true);
                });
            }
        });
    }

    onCancelClick = () => {
        const { onSave } = this.props;
        onSave();
    }

    render() {
        const { 
            formVisible,  
            form: { getFieldDecorator, getFieldValue }} = this.props;
        const { info } = this.state;

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
                title={info ? "编辑税目" : "新建税目"}
                width={800}
                visible={formVisible}
                maskClosable={false}
                maskClosable={false}
                destroyOnClose
                onOk={this.onOKClick}
                onCancel={this.onCancelClick}
                style={{ top: 20 }}
                bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="税目名称">                               
                                {getFieldDecorator('name', {
                                    initialValue: info ?  info.name : '',
                                    rules: [
                                        { 
                                            required: true, 
                                            message: '请输入税目名称' 
                                        }
                                    ],
                                })(<Input placeholder="请输入税目名称" />)}
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="税目税率">
                                {getFieldDecorator('tax_rate', {
                                    initialValue: info ?  info.tax_rate*100 : 0,
                                    rules: [
                                        { 
                                            required: true, 
                                            message: '请输入税目税率' 
                                        }
                                    ],
                                })(<InputNumber min={0} max={100} formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')} placeholder="请输入税目税率" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="含税计算">
                                {getFieldDecorator('type', {
                                    initialValue: info ? info.type.toString() : '1',
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="1">是</Radio>
                                        <Radio value="2">否</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="税目描述">
                                {getFieldDecorator('memo', {
                                    initialValue:  info ?  info.memo : '',
                                    rules: [
                                        {
                                            message: '请输入税目描述' 
                                        }
                                    ],
                                })(<Input.TextArea rows={5} placeholder="请输入税目描述" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default TaxCard;