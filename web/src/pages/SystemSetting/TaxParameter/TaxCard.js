import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Input, InputNumber } from 'antd';


@Form.create()
class TaxCard extends PureComponent {

    state = { info: null };
    componentWillMount() {

        const { info } = this.props;
        // TODO 重新请求数据
        this.setState({ info: info });

    }

    onOKClick = () => {
        // TODO 调取Service
        // 关闭弹窗
        const { onSave, form } = this.props;
        form.validateFields((err, values) => {
            if(!err) {
                console.log(values);
            }
        })
        onSave(true);
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
                                    rules: [{ required: true, message: '请输入税目名称' }],
                                })(<Input placeholder="请输入税目名称" />)}
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="税目税率">
                                {getFieldDecorator('tax_rate', {
                                    initialValue: info ?  info.tax_rate : 0,
                                    rules: [{ required: true, message: '请输入税目税率' }],
                                })(<InputNumber placeholder="请输入税目税率" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="税目描述">
                                {getFieldDecorator('memo', {
                                    initialValue:  info ?  info.memo : '',
                                    rules: [{message: '请输入税目描述' }],
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