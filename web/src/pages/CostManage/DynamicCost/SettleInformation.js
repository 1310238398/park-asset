import React,{ PureComponent } from 'react';
import { Table, Form, Input, Row, Col, Button } from 'antd';
import { queryTree } from '@/services/dictionary';
import DicSelect from '@/components/DictionaryNew/DicSelect';
import { getDynamicCostProjSetteled } from '@/services/dynamicCostProj';
import ContractDetail from './ContractDetails';

@Form.create()
class SettleInformation extends PureComponent{  //结算信息

    state = {
        dataList : [],
        contract_type : [],
        loading : true,
        formVisiable : false,
        info : null,
    }

    componentWillMount(){
        const { subject_id } = this.props;

        queryTree({ q: 'tree', parent_code: "contract$#contractType", level: 0 }).then(res=>{
            if(res && res.error){
                console.log(res.error.message);
                this.setState({ loading : false });
            }else{
                this.setState({ contract_type : res.list });
                this.getData(subject_id);
            }
        });  
    }

    getData = (subject_id)=> {
        getDynamicCostProjSetteled(subject_id).then(res => {
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ dataList : res.list});
            }
        })
    }

    //合同详情
    contractDetail = record => {
        this.setState({ formVisiable : true, info : record });
    }

    cancelConDetail = ()=> {
        this.setState({ formVisiable : false, info : null });
    }

    //搜索
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
            console.log('搜索条件',formData);
            //TODO 调用接口查询数据。--根据搜索条件查询
        })
    };

    onResetFormClick = ()=>{
        const { form } = this.props;
        form.resetFields();
        //TODO清空时，查询数据----根据搜索条件查询
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
                        <Form.Item {...formItemLayout} label="合同编号">
                        {getFieldDecorator('contract_num', {
                            initialValue: '',
                        })(<Input placeholder='请输入合同编号' />)}
                        </Form.Item>
                    </Col>
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
        
        const {
            dataList,
            contract_type,
            loading,
            formVisiable,
            info,
        } = this.state;

        const {
            projectID,
        } = this.props;

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'contract_name',
                key : 'contract_name',
                width : 200,
                // align : 'center',
                render : (data,record) => {
                    return <a onClick={()=> { this.contractDetail(record)}}>{data}</a>
                }
            },
            {
                title : '合同编号',
                dataIndex : 'contract_num',
                key : 'contract_num',
                width : 200,
                align : 'center',
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
                title : '结算金额',
                dataIndex : 'settled',
                key : 'settled',
                width : 100,
                align : 'center',
            }
        ];

        return(
            <div>
                <div>
                    { this.renderSearchForm() }
                </div>
                <Table
                    columns = {columns}
                    dataSource = { dataList }
                    rowKey = { record => record.contract_id}
                    bordered = { true }
                    pagination={false}
                    scroll = {{ x : 1000, y : 500 }}
                    loading = { loading }
                >

                </Table>
                {
                    formVisiable &&
                    <ContractDetail formVisiable={ formVisiable } cancel={this.cancelConDetail} info={info} projectID={projectID}></ContractDetail>
                }
            </div>
        )
    }
}

export default SettleInformation;