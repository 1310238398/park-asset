import React, { PureComponent } from 'react';
import { Card, Table, Modal, Tag } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import FormatCard from './FormatCard';

import styles from './FormatManage.less';

import { queryList, del,} from '@/services/formatManage';

class FormatManage extends PureComponent {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        formVisible : false,
        editInfo : null,
        data: {
            list: [
            ],
            pagination: {
            }
        },
        loading : true,
    };

    componentWillMount(){

        const params = { q : "page", current : 1 };
        queryList(params).then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
                return;
            }else{
                this.setState( { data : res } );
            }
        });
    };

    getList = params => {
        queryList(params).then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState( { data : res } );
            }
        });
    }

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

    handleAddClick = () => {  //新建操作
        this.clearSelectRows();
        this.setState({ formVisible : true });
    };

    onSave = (saved = false) => {
        const { 
            data : {
                pagination : { current, pageSize }
            }
        } = this.state;

        const params = { q : "page", current : current, pageSize : pageSize };
        if(saved){
            this.setState({ loading : true });
            this.getList(params);
        }
        this.setState({ formVisible : false, editInfo : null});
        this.clearSelectRows();
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
            title: `确定删除该业态？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: this.handleDelOKClick.bind(this, selectedRows[0]),
        });
    };

    handleDelOKClick(params) {
        this.setState({ loading : true });
        const { 
            data : {
                pagination : { current, pageSize }
            }
        } = this.state;

        const param = { q : "page", current : current, pageSize : pageSize };

        del(params).then( res => {
            this.setState({ loading : false });
            if( res && res.status == "OK" ){
                this.getList(param);
            }else{
                if(res && res.error){
                    console.log(res.error.message);
                }
            }
        });
        this.clearSelectRows();
    }

    onTableChange = pagination =>{
        const params = { q : "page", current : pagination.current, pageSize : pagination.pageSize };
        this.getList(params);
    }

   
    //页面的render
    render() {
        const { selectedRowKeys, selectedRows , data:{ list, pagination }, formVisible , editInfo, loading } = this.state;
        const columns = [
            {
                title: '业态名称',
                dataIndex: 'name',
                width: 200,
            },
            {
                title: '所在区域',
                dataIndex: 'is_underground',
                width: 150,
                align : 'center',
                render : data =>{
                    return data == 1 ? <Tag color='blue'>地下</Tag> : <Tag color='blue'>地上</Tag>;
                }
            },
            {
                title: '属于人防',
                dataIndex: 'is_civil_defense',
                width: 150,
                align : 'center',
                render: data =>{
                    return data == 1 ? "是" : ( data == 2 ? "否" : "错误数据");
                }
            },
            {
                title: '描述',
                dataIndex: 'memo',
                width: 200,
            },
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => <span>共{total}条</span>,
            ...pagination
        };
        const breadcrumbList = [
            { title : "基础设定"},
            { title: '系统设定' },
            { title: '业态管理' }
        ];

        return (
            <PageHeaderLayout title="业态管理" breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
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
                                onChange = {this.onTableChange}
                                loading = {loading}
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