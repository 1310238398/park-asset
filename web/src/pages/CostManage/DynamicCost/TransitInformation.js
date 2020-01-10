import React,{ PureComponent } from 'react';
import { Table, Form, Input, Row, Col, Button } from 'antd';
import { queryTree } from '@/services/dictionary';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import { getDynamicCostProjOnApproval } from '@/services/dynamicCostProj';

// 在途信息
@Form.create()
class TransitInformation extends PureComponent{

    state = {
        data : [],
        contract_type : [],
        loading : true,
    };

    componentWillMount(){
        const { subject_id, projectID } = this.props;

        queryTree({ q: 'tree', parent_code: "contract$#contractType", level: 0 }).then(res=>{
            if(res && res.error){
                this.setState({ loading : false });
                console.log(res.error.message);
            }else{
                this.setState({ contract_type : res.list });
                // const param = { projectID : projectID };
                this.getData(subject_id);
            }
        });  
    };

    getData = (subject_id) => {
        getDynamicCostProjOnApproval(subject_id).then( res=> {
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ data : res.list});
            }
        })
    };

    contractDetail = record => {
        console.log('在途信息',record);
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
            //TODO  ----根据搜索条件进行搜索
        })
    };

    onResetFormClick = ()=>{
        const { form } = this.props;
        form.resetFields();
        //TODO清空时，进行查询。--- 根据搜索条件进行搜索
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
                            {getFieldDecorator('contract_name', {
                                initialValue: '',
                            })(<Input placeholder="请输入合同名称" />)}
                        </Form.Item>
                    </Col>
                    <Col {...col}>
                        <Form.Item {...formItemLayout} label="合同类别">
                        {getFieldDecorator('contract_type', {
                            initialValue: null,
                            rules: [
                            {
                                required: false,
                                message: '请选择合同类别',
                            },
                            ],
                        })(
                            <DicSelect
                            vmode="int"
                            pcode="contract$#contractType"
                            selectProps={{ placeholder: '请选择合同类别' }}
                            />
                        )}
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

        const  {
            data,
            contract_type,
            loading,
        } = this.state;

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'contract_name',
                key : 'contract_name',
                width : 200,
                align : 'center',
                render : (data,record) => {
                    return <a onClick={()=> { this.contractDetail(record)}}>{data}</a>
                }
            },
            {
                title : '合同类别',
                dataIndex : 'contract_type',
                key : 'contract_type',
                width : 200,
                align : 'center',
                render : (data) => {
                    for(let i=0; i<contract_type.length;i++){
                        if( contract_type[i].code == data.toString()){
                            return contract_type[i].name;
                        }
                    }
                }
            },
            {
                title : '合同额（不含甲供）',
                dataIndex : 'amount',
                key : 'amount',
                width : 100,
                align : 'center',
            },
            {
                title : '在途金额',
                dataIndex : 'on_approval',
                key : 'on_approval',
                width : 100,
                align : 'center',
            },
            {
                title : '审核状态',
                dataIndex : 'status',
                key : 'status',
                width : 100,
                align : 'center',
            },
        ];

        return(
            <div>
                <div>
                    {this.renderSearchForm()}
                </div>
                <Table
                    columns = { columns }
                    dataSource = { data }
                    rowKey = { record => record.contract_id}
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

export default TransitInformation;