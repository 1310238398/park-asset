import React, { PureComponent } from "react";
import { Card, Tree, Row, Col, Table, Form, Input, Button, Modal } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ContractPlanCard from './ContractPlanCard';
import PButton from '@/components/PermButton';

import styles from './ContractPlanManage.less';

import { queryContactTree } from '@/services/projectCostManage';
import { queryContractPlan, delContractPlan } from '@/services/contractPlanManage';
import { queryTree } from '@/services/dictionary';

const { TreeNode } = Tree;

@Form.create()
class ContractPlanManage extends PureComponent{

    state = {
        treeData : [],
        node : null,
        formVisiable : false,
        editing : null,
        editFlag : false,
        data : {
            list: [
            ],
            pagination: {
            }
        },
        contract_type : [],
        cost_id : '',  //成本id
        loading : true,
    }

    componentWillMount(){
        let is_get_tree = false;
        let is_get_type = false;
        let cost_id = '';
        queryContactTree().then(res=>{  //成本项--树结构数据
            if(res && res.error){
                console.log(res.error.message);
                this.setState({ loading : false });
                return;
            }else{
                this.setState({ treeData : res });
                cost_id = res[0].record_id;
                this.setState({ cost_id : cost_id });
                this.setState({ node : res[0] });
                is_get_tree = true;
            }
        });  

        queryTree({ q: 'tree', parent_code: "contract$#contractType", level: 0 }).then(res=>{
            if(res && res.error){
                console.log(res.error.message);
            }else{
                is_get_type = true;
                this.setState({ contract_type : res.list });
            }
        })

        this.interval = setInterval( () => {
            if(is_get_tree && is_get_type){
                clearInterval(this.interval);
                const param = { q : 'page', current : 1, pageSize : 10, cost_id : cost_id };
                //查找数据的方法，进行赋值
                this.getData(param);
            }
        },1000);
        
    }

    getData = (param) => {
        queryContractPlan(param).then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ data : res });
            }
        })
    }

    getTreeNode = data => {
        return data.map(item => {
            if(item.children && item.children.length){
                return (
                    <TreeNode key={item.record_id} title={item.name}>
                        {this.getTreeNode(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.record_id} title={item.name}></TreeNode>;
        })
    };

    // expandTreeCode = (expandkey, record) => {
    //     console.log("expandkey",expandkey);
    //     console.log("record",record);
    // }
    selectTreeNode = (selectedKeys,e) => {
        const { 
            data : {
                pagination : { current , pageSize }
            },
            cost_id,
            treeData,
        } = this.state;
        this.setState({ loading : true });
        if(e.selected){
            this.setState({ cost_id : selectedKeys[0] });
            const param = { q : 'page', current : current, pageSize : pageSize, cost_id : selectedKeys[0] };
            this.getData(param);
            const rNode = this.isHasChild( treeData, selectedKeys[0] );
            if(rNode) {
                this.setState({ node : rNode });
            } 
        }else{
            const param = { q : 'page', current : current, pageSize : pageSize, cost_id : cost_id };
            this.getData(param);
        }
    }

    isHasChild = ( tree, rid) => {
        for(let i=0;i<tree.length;i++){
            if(rid == tree[i].record_id){
                return tree[i];
            }else if(tree[i].children && tree[i].children.length > 0){
                let t= this.isHasChild(tree[i].children, rid);
                if (t) {
                    return t;
                }
            }
        }
    }

    handleAddClick = () => {
        this.setState({ formVisiable: true, editFlag : false, editing : null });
    }

    editing = (record)=> {
        this.setState({ formVisiable: true, editing : record, editFlag : true });
    }

    onSave = ( saved = false ) => {
        const { 
            cost_id,
            data : {
                pagination : { current , pageSize }
            },
         } = this.state;
        const param = { q : 'page', current : current, pageSize : pageSize, cost_id : cost_id };
        if(saved){
            this.setState({ loading : true });
            this.getData(param);
        }
        this.setState({
            formVisiable : false,
            editFlag : false,
            editing : null,
        });
    }

    //删除按钮
    handleDelClick = record => { 
        Modal.confirm({
            title: `确定删除该合同模板？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: this.handleDelOKClick.bind(this, record.record_id),
        });
    }

    handleDelOKClick(params) {
        this.setState({ loading : true });
        const { 
            cost_id,
            data : {
                pagination : { current , pageSize }
            },
         } = this.state;
        const param = { q : 'page', current : current, pageSize : pageSize, cost_id : cost_id };
        delContractPlan(params).then(res => {
            this.setState({ loading : false });
            if(  res && res.status == "OK" ){
                this.getData(param);
            }else{
                if(res && res.error){
                    console.log(res.error.message);
                }
            }
        })
    }

    onTableChange = pagination => {
        const { cost_id } = this.state;
        const param = { q : 'page', current : pagination.current, pageSize : pagination.pageSize, cost_id : cost_id };
        this.getData(param);
    }

    render(){

        const { 
            treeData,
            data : { list , pagination },
            formVisiable,
            node,
            editing,
            editFlag,
            loading,
            contract_type,
        } = this.state;

        const breadcrumbList = [
            { title : "基础设定"},
            { title: '系统设定' },
            { title: '合约规划' }
        ];

        const col1 = {
            xs : { span : 15 },
            sm : { span : 12 },
            md : { span : 8 },
            lg : { span : 7 },
            xl : { span : 4 },
        }

        const col2 = {
            xs : { span : 9 },
            sm : { span : 12 },
            md : { span : 16 },
            lg : { span : 17 },
            xl : { span : 20 },
        }

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'name',
                key : 'name',
                width: 150,
            },
            {
                title : '合同类别',
                dataIndex : 'contract_type',
                key : 'contract_type',
                width: 120,
                render : (data) => {
                    for(let i=0; i<contract_type.length;i++){
                        if( contract_type[i].code == data.toString()){
                            return contract_type[i].name;
                        }
                    }
                }
            },
            {
                title : '所属科目',
                dataIndex : 'cost_name_path',
                key : 'cost_name_path',
                width: 120,
            },
            {
                title : '核算内容',
                dataIndex : 'information',
                key : 'information',
                width: 150,
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 100,
                align : 'center',
                render : (text,record) => {
                    return(
                            <span>
                                <a onClick={() => { this.editing(record)}}>编辑</a>  &nbsp;&nbsp;&nbsp;
                                <a onClick={() => { this.handleDelClick(record) }}>删除</a>
                            </span>
                    ) 
                }
            }
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => <span>共{total}条</span>,
            ...pagination
        };

        return(
            <PageHeaderLayout title="合约规划" breadcrumbList={breadcrumbList}>
                <Card bordered={ false } className={styles.cardStyle}>
                    <Row gutter={[2,0]} className={styles.rowSty}>
                    {/*  */}
                        <Col {...col1} className={styles.colLine}>
                            <Tree
                                className ="draggable-tree"
                                draggable
                                blockNode
                                // onExpand = { this.expandTreeCode }
                                onSelect = { this.selectTreeNode }
                            >
                                { this.getTreeNode(treeData) }
                            </Tree>
                        </Col>
                        <Col {...col2} className={styles.tableCol}>
                            {
                                (node && !node.children) &&
                                <div>
                                    <PButton 
                                        key='add' code="add" type='primary' style={ {marginLeft : 8, marginBottom : 10}}
                                        onClick={() => this.handleAddClick()}
                                    >
                                        添加
                                    </PButton> 
                                </div>
                            }
                            <Table
                                columns= { columns }
                                dataSource = { list }
                                scroll = { {y : 700}  }
                                bordered = { true }
                                rowKey = {record => record.record_id}
                                pagination={paginationProps}
                                onChange  ={this.onTableChange}
                                loading = { loading }
                            >

                            </Table>
                        </Col>
                    </Row>
                </Card>
                {
                    formVisiable && 
                    <ContractPlanCard formVisible= {formVisiable} onSave={this.onSave} editinfo = { editing } node = { node } editFlag={ editFlag }></ContractPlanCard>
                }
            </PageHeaderLayout>
        )
    }
}

export default ContractPlanManage;