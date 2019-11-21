import React, { PureComponent } from 'react';
import { Card, Row, Col, Form, Input, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import TaxCard from './TaxCard';

import styles from './TaxManage.less';

import { query } from '@/services/taxManage';

@Form.create()
class TaxManage extends PureComponent {

    state = {
        selectedRowKeys: [],
        selectedRows: [],
        formVisible: false,
        editInfo: null,
        data: {
            list: [
                // {
                //     record_id: "1",
                //     name: "增值税销项税",
                //     tax_rate: 9,
                //     type : 1, 
                //     memo: "备注1"
                // },
            ],
            pagination:
            {

            }
        }

    }

    componentWillMount(){
        this.getList();
    }

    getList = () => {
        query().then(res=>{
            if(res && res.error){
                console.log(res.error.message);
            }else{
                console.log(res);
                this.setState( { data : res } );
            }
        })
    }

    //新建操作，改变form visible 
    handleAddClick = () => {
        this.setState({ formVisible: true });
        this.clearSelectRows();
    }

    onEdit = () => {
        const { selectedRows } = this.state;
        this.setState({ formVisible: true, editInfo: selectedRows[0] });
    }

    onSave = (saved = false) => {
        if (saved) {
            // TODO 重新拉取列表           
        }
        this.setState({ formVisible: false, editInfo: null });
    }

    // //搜索框
    // handleSearchFormSubmit = e => {
    //     if (e) {
    //         e.preventDefault();
    //     }
    //     const { form } = this.props;

    //     form.validateFields((err,values) => {
    //         if(!err) {
    //             console.log(values)
    //         }
    //     })
    // };

    // handleResetFormClick = () => {
    //     const { form } = this.props;

    //     form.resetFields();
    // }

    // renderSearchForm() {
    //     const formItemLayout = {
    //         labelCol: {
    //             xs: { span: 24 },
    //             sm: { span: 12 },
    //             md: { span: 6 },
    //             lg: { span: 8 },
    //         },
    //         wrapperCol: {
    //             xs: { span: 24 },
    //             sm: { span: 12 },
    //             md: { span: 6 },
    //             lg: { span: 12 },
    //         },
    //     };
    //     const col = {
    //         sm: 24,
    //         md: 6,
    //     };
    //     const {
    //         form : { getFieldDecorator },
    //     } = this.props
    //     return (
    //         <Form layout="inline" onSubmit={this.handleSearchFormSubmit}>
    //             <Row gutter={16}>
    //                 <Col {...col}>
    //                     <Form.Item {...formItemLayout} label="税目名称">
    //                         {
    //                             getFieldDecorator("name")(<Input placeholder="请输入"></Input>)
    //                         }
    //                     </Form.Item>
    //                 </Col>
    //                 <Col {...col}>
    //                     <Form.Item {...formItemLayout} label="税率">
    //                         {/* <Input placeholder="请输入"></Input> */}
    //                         {
    //                             getFieldDecorator("tax_rate")(<Input placeholder="请输入"></Input>)
    //                         }
    //                     </Form.Item>
    //                 </Col>
    //                 <Col {...col} offset={1}>
    //                     <Form.Item>
    //                         <div style={{ overflow: 'hidden' }}>
    //                             <span style={{ marginBottom: 24 }}>
    //                                 <Button type="primary" htmlType="submit">
    //                                     查询
    //                                 </Button>
    //                                 <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
    //                                     重置
    //                                 </Button>
    //                             </span>
    //                         </div>
    //                     </Form.Item>
    //                 </Col>
    //             </Row>
    //         </Form>
    //     )
    // }

    clearSelectRows = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            return;
        }
        this.setState({ selectedRowKeys: [], selectedRows: [] });
    };

    //选择list 中某一条数据
    handleTableSelectRow = (keys, rows) => {
        const { selectedRowKeys, selectedRows } = this.state;
        if(rows.length == 0){
            this.setState({ selectedRowKeys: [], selectedRows: [] });
        }else{
            this.setState({
                selectedRowKeys: [keys[keys.length - 1]],
                selectedRows: [rows[rows.length - 1]]
            });
        }
    };

    render() {

        const breadcrumbList = [
            { title : "基础设定"},
            { title: "系统设定" },
            { title: "税目管理" }
        ]

        const columns = [
            {
                title: "税目",
                dataIndex: "name",
                width: 100
            },
            {
                title: "税率",
                dataIndex: "tax_rate",
                width: 100,
                render: data => `${data}%`
            },
            {
                title: "含税计算",
                dataIndex : "type",
                width : 80,
                render : data => {
                    return data == 1 ? "是" : ( data == 2 ? "否" : "错误数据");
                }
            },
            {
                title: "备注",
                dataIndex: "memo",
                width: 100,
            }
        ]

        const { selectedRowKeys, selectedRows, data: {list ,pagination }, formVisible, editInfo } = this.state;

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => <span>共{total}条</span>,
            ...pagination
        };

        return (
            <PageHeaderLayout title="税目管理" breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderSearchForm()}</div> */}
                        <div className={styles.tableListOperator}>
                            <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                                新建
                            </PButton>
                            {
                                selectedRows.length === 1 && [
                                    <PButton key='edit' code="edit" icon="edit" type="edit" onClick={() => { this.onEdit() }}>
                                        编辑
                                    </PButton>,
                                    <PButton key="del" code="del" icon="delete" type="danger">
                                        删除
                                    </PButton>
                                ]
                            }
                        </div>
                        <div>
                            <Table
                                rowKey={record => record.record_id}
                                rowSelection={{ selectedRowKeys, onChange: this.handleTableSelectRow }}
                                columns={columns}
                                dataSource={list}
                                pagination={paginationProps}
                            />
                        </div>
                    </div>
                </Card>
                {formVisible && <TaxCard onSave={this.onSave} info={editInfo} formVisible={formVisible} />}
            </PageHeaderLayout>
        )
    }
}

export default TaxManage;