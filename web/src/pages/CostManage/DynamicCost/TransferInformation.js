import React,{ PureComponent } from 'react';
import { Table, Form, Row, Col, Select, Button } from 'antd';
import { getDynamicCostProjTransfer } from '@/services/dynamicCostProj'


//调动信息
@Form.create()
class TransferInformation extends PureComponent{

    state = {
        data : [],
        loading : true,
    };

    componentWillMount(){
        const { subject_id } = this.props;
        this.getData(subject_id);
    }

    getData(subject_id){
        getDynamicCostProjTransfer(subject_id).then(res =>{
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ data : res.list});
            }
        })
    }

    handleSearchFormSubmit = e => {
        if (e) {
          e.preventDefault();
        }

        const { form } = this.props;

        form.validateFields((err,values) => {
            if(err){
                return;
            }
            let formData = { ...values };
            console.log('提交数据',formData);
        })
    };

    onResetFormClick = ()=>{
        const { form } = this.props;
        form.resetFields();
        //TODO清空时，进行查询。---
    }

    renderSearchForm(){
        const {
            form :{
                getFieldDecorator,
            }
        } = this.props;

        const col = {
            sm: 24,
            md: 6,
        };

        const formItemLayout = {
            labelCol:{
                span :8,
            },
            wrapperCol :{
                span :16,
            }
        };

        return(
            <Form onSubmit={this.handleSearchFormSubmit}  style={{ marginBottom: '10px' }}>
                <Row gutter={16}>
                    <Col {...col}>
                        <Form.Item {...formItemLayout} label='调动类型'>
                            {getFieldDecorator('transfer_type',{
                                initialValue : '',
                            })(<Select placeholder="请选择" style={{ width: '100%' }} allowClear={true} >
                                <Select.Option value="1">调出</Select.Option>
                                <Select.Option value="2">调入</Select.Option>
                                <Select.Option value="3">内部调整</Select.Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col {...col}>
                        <div style={{ overflow: 'hidden' }}>
                            <span style={{ marginBottom: 24 }}>
                                <Button type="primary" htmlType="submit">
                                查询
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                                重置
                                </Button>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }

    render(){

        const {
            data,
            loading,
        } = this.state;
        
        const columns = [
            {
                title : '调出',
                dataIndex : 'transfer_out',
                key : 'transfer_out',
                align : 'center',
                children : [
                    {
                        title : '调出科目',
                        dataIndex : 'from_cost_name',
                        key : 'from_cost_name',
                        align: 'center',
                        width : 100,
                    },
                    {
                        title : '调出项',
                        dataIndex : 'from_planning_name',
                        key : 'from_planning_name',
                        align : 'center',
                        width : 150,
                    }
                ],
            },
            {
                title : '调入',
                dataIndex : 'transfer_in',
                key : 'transfer_in',
                align : 'center',
                children : [
                    {
                        title : '调入科目',
                        dataIndex : 'to_cost_name',
                        key : 'to_cost_name',
                        align : 'center',
                        width : 100,
                    },
                    {
                        title : '调入项',
                        dataIndex : 'to_planning_name',
                        key : 'to_planning_name',
                        align : 'center',
                        width : 150,
                    },
                ],
            },
            {
                title : '调动金额',
                dataIndex : 'amount',
                key : 'amount',
                align : 'center',
                width : 100,
            },
            {
                //1.调出，2.调入，3.内部调整
                title : '调动类型',
                dataIndex : 'transfer_type',
                key : "transfer_type",
                align : 'center',
                width : 100,
                render : (text,record)=>{
                    if( text === 1 ){
                        return '调出';
                    }else if( text === 2 ){
                        return '调入';
                    }else if( text === 3){
                        return '内部调整';
                    }else{
                        return ''; //数据错误。
                    }
                }
            },
            {
                title : '审批通过时间',
                dataIndex : 'pass_time',
                key : 'pass_time',
                align : 'center',
                width : 100,
            },
        ];

        return(
            <div>
                <div>
                    { this.renderSearchForm() }
                </div>
                <Table
                    columns = { columns }
                    dataSource = { data }
                    rowKey = { record => record.record_id }
                    bordered = { true }
                    pagination = { false }
                    scroll = {{ x : 1000, y : 500 }}
                    loading = { loading }
                >

                </Table>
            </div>
        )
    }
}

export default TransferInformation;