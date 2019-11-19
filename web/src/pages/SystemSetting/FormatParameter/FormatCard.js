import React, { PureComponent } from 'react';
import { Form, Input, Modal, Row, Col, Radio } from 'antd';

@Form.create()
class FormatCard extends PureComponent {

    state = { info : null}

    componentWillMount(){
        const { editInfo } = this.props;
        //重新请求数据

        this.setState({ info: editInfo });
    }

    onOKClick = () => {
        const { form, onSave } = this.props;
    
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log(values);
          }else{
              // TODO 调取Service
              // 如果有问题，提示信息
          }
        });
        onSave(true);
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
                                            message: '请输入地块名称',
                                        },
                                    ],
                                })(<Input placeholder="请输入地块名称" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="所在区域">
                                {getFieldDecorator('loaction', {
                                    initialValue: info ? info.loaction.toString() : '1',
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="1">地上</Radio>
                                        <Radio value="2">地下</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="属于人防">
                                {getFieldDecorator('is_belong', {
                                    initialValue: info ? info.is_belong.toString() : '1',
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
                            <Form.Item {...formItemLayout} label="业态描述">
                                {getFieldDecorator('desc', {
                                    initialValue: info ? info.desc : "",
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