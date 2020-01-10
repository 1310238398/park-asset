import React,{ PureComponent } from 'react';
import { Table, Form, Input, Row, Col, Button } from 'antd';
import { getDynamicCostProjPlane } from '@/services/dynamicCostProj';

@Form.create()
class PlaneInformation extends PureComponent{ // 规划信息

    state = {
        data : [], 
        loading : true,
    };

    componentWillMount(){
        const { subject_id, projectID } = this.props;

        // const param = { projectID : projectID };
        this.getData(subject_id);
    }

    getData = (subject_id) => {
        getDynamicCostProjPlane(subject_id).then( res=> {
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ data : res.list});
            }
        })
    };

    contractDetail = record => {
        console.log('规划信息',record);
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
            form: { getFieldDecorator },
        } = this.props;

        const formItemLayout = {
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const col = {
            sm: 24,
            md: 6,
        };
        return (
            <Form onSubmit={this.handleSearchFormSubmit}  style={{ marginBottom: '10px' }}>
                <Row gutter={16}>
                    <Col {...col}>
                        <Form.Item {...formItemLayout} label="合同名称">
                            {getFieldDecorator('name', {
                                initialValue: '',
                            })(<Input placeholder="请输入合同名称" />)}
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
        } = this.state;

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'contract_name',
                key : 'contract_name',
                width : 200,
                render : (data,record) => {
                    return <a onClick={()=> { this.contractDetail(record)}}>{data}</a>
                }
            },
            {
                title : '合同规划金额',
                dataIndex : 'contract_plan_amount',
                key : 'contract_plan_amount',
                width:100,
                align : 'center',
            },
            {
                title : '合同预估金额',
                dataIndex : 'contract_estimate_amount',
                key : 'contract_estimate_amount',
                width : 100,
                align : 'center',
            },
            {
                title : '合同签订金额',
                dataIndex : 'contract_signed_amount',
                key : 'contract_signed_amount',
                width : 100,
                align : 'center',
            },
            {
                title : '余额',
                dataIndex : 'balance',
                key : 'balance',
                width : 100,
                align :'center',
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
                    rowKey = { record => record.contract_id }
                    bordered = { true }
                    pagination = { false }
                    scroll = {{ x : 1000, y : 500}}
                >

                </Table>
            </div>
        )
    }
}

export default PlaneInformation;