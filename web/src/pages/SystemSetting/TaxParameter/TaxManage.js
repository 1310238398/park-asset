import React, { PureComponent } from 'react';
import { Card, Table, Modal } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import TaxCard from './TaxCard';

import styles from './TaxManage.less';

import { query, del } from '@/services/taxManage';

class TaxManage extends PureComponent {

    state = {
        selectedRowKeys: [],
        selectedRows: [],
        formVisible: false,
        editInfo: null,
        data: {
            list: [],
            pagination:{}
        },
        loading : true,
    }

    componentWillMount(){
        const params = { q : "page", current : 1};
        this.getList(params);
    }

    getList = (params) => {
        query(params).then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
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
        const {
            data : {
                pagination : { current, pageSize }
            }
        } = this.state;

        const params = { q : "page", current : current, pageSize : pageSize}
        if (saved) {
            this.setState({ loading : true });  
            this.getList(params);      
        }
        this.setState({ formVisible: false, editInfo: null });
        this.clearSelectRows();
    }
    //删除按钮
    handleDelClick = () => {
        const { selectedRows } = this.state;
        Modal.confirm({
            title: `确定删除该税目？`,
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
    onTableChange = pagination =>{
        const params = { q : "page", current : pagination.current, pageSize : pagination.pageSize };
        this.getList(params);
    }

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
                width: 150,
            },
            {
                title: "税率",
                dataIndex: "tax_rate",
                width: 80,
                align :'center',
                render: data => `${data*100}%`
            },
            {
                title: "含税计算",
                dataIndex : "type",
                width : 80,
                align: 'center',
                render : data => {
                    return data == 1 ? "是" : ( data == 2 ? "否" : "错误数据");
                }
            },
            {
                title: "备注",
                dataIndex: "memo",
                width: 150,
            }
        ]

        const { selectedRowKeys, selectedRows, data: {list ,pagination }, formVisible, editInfo, loading } = this.state;

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
                        <div className={styles.tableListOperator}>
                            <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
                                新建
                            </PButton>
                            {
                                selectedRows.length === 1 && [
                                    <PButton key='edit' code="edit" icon="edit" type="edit" onClick={() => { this.onEdit() }}>
                                        编辑
                                    </PButton>,
                                    <PButton key="del" code="del" icon="delete" type="danger" onClick = {() => { this.handleDelClick() }}>
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
                                onChange = {this.onTableChange}
                                loading = { loading }
                                scroll = {{ y : 700}}
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