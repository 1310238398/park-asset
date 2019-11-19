import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Button, Table, Modal } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import FormatCard from './FormatCard';

import styles from './FormatManage.less';

@Form.create()
class FormatManage extends PureComponent {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        formVisible : false,
        editInfo : null,
        data: {
            list: [
                {
                    record_id: "1",
                    name: "住宅地上（10层）",
                    desc: "描述1",
                    loaction: "1",
                    is_belong: "2"
                },
                {
                    record_id: "2",
                    name: "住宅地上（10层）",
                    desc: "描述2",
                    loaction: "1",
                    is_belong: "2"
                },
                {
                    record_id: "3",
                    name: "住宅地上（10层）",
                    desc: "描述3",
                    loaction: "1",
                    is_belong: "2"
                },
                {
                    record_id: "4",
                    name: "住宅地上（10层）",
                    desc: "描述4",
                    loaction: "1",
                    is_belong: "2"
                },
                {
                    record_id: "5",
                    name: "住宅地上（10层）",
                    desc: "描述5",
                    loaction: "1",
                    is_belong: "2"
                },

            ],
            pagination: {
                total: 5,
                current: 1,
                // pageSize: 10
            }
        }
    };

    clearSelectRows = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            return;
        }
        this.setState({ selectedRowKeys: [], selectedRows: [] });
    };

     //选择list 中某一条数据
     handleTableSelectRow = (keys, rows) => {
        if(rows.length == 0){
            this.setState({ selectedRowKeys: [], selectedRows: [] });
        }else{
            this.setState({
                selectedRowKeys: [keys[keys.length - 1]],
                selectedRows: [rows[rows.length - 1]],
            });
        }
    };

    //搜索
    handleSearchFormSubmit = e => {
        if (e) {
            e.preventDefault();
        }
        const { form } = this.props;

        form.validateFields((err,values) => {
            if(!err) {
                console.log(values)
            }
        })
    }

    //重置搜索内容
    handleResetFormClick = () => {
        const { form } = this.props;
        form.resetFields();
    };

    //搜索render
    renderSearchForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form layout="inline" onSubmit={this.handleSearchFormSubmit}>
                <Row gutter={16}>
                    <Col md={6} sm={24}>
                        <Form.Item label="业态名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                        <div style={{ overflow: 'hidden' }}>
                            <span style={{ marginBottom: 24 }}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                                    重置
                                </Button>
                            </span>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }

    handleAddClick = () => {  //新建操作
        this.setState({ formVisible : true });
    };

    onSave = (saved = false) => {
        if(saved){
            //为true，进行保存了，重新拉取列表，进行数据的更新
        }
        this.setState({ formVisible : false,editInfo : null})
    }

    //编辑按钮
    handleEditClick = () => {
        const { selectedRows } = this.state;
        this.setState({ formVisible : true, editInfo : selectedRows[0]});
    };
    //删除按钮
    handleDelClick = () => {
        const { selectedRows } = this.state;
        Modal.confirm({
            title: `确定删除【项目数据：${selectedRows[0].name}】？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: this.handleDelOKClick.bind(this, selectedRows[0].record_id),
        });
    };
    handleDelOKClick(id) {
        console.log("删除", id);
        this.clearSelectRows();
    }

   
    //页面的render
    render() {
        const { selectedRowKeys, selectedRows , data:{ list, pagination }, formVisible ,editInfo } = this.state;
        const columns = [
            {
                title: '业态名称',
                dataIndex: 'name',
                width: 100,
            },
            {
                title: '描述',
                dataIndex: 'desc',
                width: 200,
            },
            {
                title: '所在区域',
                dataIndex: 'loaction',
                width: 150,
            },
            {
                title: '属于人防',
                dataIndex: 'is_belong',
                width: 150,
            },
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => <span>共{total}条</span>,
            ...pagination
        };
        const breadcrumbList = [
            { title: '业态管理' },
            { title: '业态管理管理', href: '/systemset/systemset' },
        ];

        return (
            <PageHeaderLayout title="地块管理" breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                        <div className={styles.tableListOperator}>
                            <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                                新建
                        </PButton>
                            {
                                selectedRows.length === 1 && [
                                    <PButton
                                        key="edit"
                                        code="edit"
                                        icon="edit"
                                        onClick={() => this.handleEditClick()}
                                    >
                                        编辑
                                  </PButton>,
                                    <PButton
                                        key="del"
                                        code="del"
                                        icon="delete"
                                        type="danger"
                                        onClick={() => this.handleDelClick()}
                                    >
                                        删除
                                  </PButton>,
                                ]
                            }
                        </div>
                        <div>
                            <Table
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: this.handleTableSelectRow,
                                }}
                                columns={columns}
                                dataSource={list}
                                rowKey={record => record.record_id}
                                pagination={paginationProps}
                            // size="small"
                            />
                        </div>
                    </div>
                </Card>
                {
                    formVisible && <FormatCard onSave={this.onSave} formVisible ={formVisible} editInfo ={editInfo}/>
                }
            </PageHeaderLayout>
        )
    }

}

export default FormatManage;