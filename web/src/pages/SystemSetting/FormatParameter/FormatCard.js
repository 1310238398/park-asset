import React, { PureComponent } from 'react';
import { Form, Input, Modal, Row, Col, Radio } from 'antd';

import { create, get, update } from '@/services/formatManage';

@Form.create()
class FormatCard extends PureComponent {

    state = { info : null}

    componentWillMount(){
        const { editInfo } = this.props;
        if(editInfo){
            //重新请求数据
            get(editInfo).then(res=>{
                if(res && res.error){
                    console.log(res.error.message);
                }else{
                    this.setState({ info: res });
                }
            })
        }else{
            this.setState({ info: editInfo });
        }
    }

    onOKClick = () => {
        const { form, onSave, editInfo } = this.props;
    
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const tempInfo  = { ...values };
            tempInfo.is_underground = parseInt(tempInfo.is_underground,10);
            tempInfo.is_civil_defense = parseInt(tempInfo.is_civil_defense,10);
            if(editInfo){ //  修改
                tempInfo.record_id = editInfo.record_id;
                update(tempInfo).then(res=>{
                    if(res && res.error){
                        console.log(res.error.message);
                    }
                    onSave(true);
                })
            }else{  // 添加
                create(tempInfo).then(res=>{
                    if(res && res.error){
                        console.log(res.error.message);
                    }
                    onSave(true);
               });
            }
        });
    };
    onCancel = () => {
        const { onSave } = this.props;
        onSave();
    }
    render() {
        const {
            formVisible,
            form: { getFieldDecorator },
        } = this.props;

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
        const { info } = this.state;
        return (
            <Modal
                title={info ? "编辑业态" : "新建业态"}
                width={800}
                visible={formVisible}
                maskClosable={false}
                destroyOnClose
                onOk={this.onOKClick}
                onCancel={this.onCancel}
                style={{ top: 20 }}
                bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="业态名称">
                                {getFieldDecorator('name', {
                                    initialValue: info ? info.name : "",
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入业态名称',
                                        },
                                    ],
                                })(<Input placeholder="请输入业态名称" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="所在区域">
                                {getFieldDecorator('is_underground', {
                                    initialValue: info ? info.is_underground.toString() : '1',
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="1">地下</Radio>
                                        <Radio value="2">地上</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="属于人防">
                                {getFieldDecorator('is_civil_defense', {
                                    initialValue: info ? info.is_civil_defense.toString() : '1',
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
                            <Form.Item {...formItemLayout} label="备注">
                                {getFieldDecorator('memo', {
                                    initialValue: info ? info.memo : "",
                                })(<Input.TextArea rows={5} placeholder="请输入备注" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default FormatCard;