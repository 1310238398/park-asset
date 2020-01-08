import React,{ PureComponent } from 'react';
import { TreeSelect, Card, Tree, Row, Col, Table, Layout, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { queryTree } from '@/services/dictionary';
import { getCostMoveSubjectList } from '@/services/dynamicCostProj';
import CostMoveCard from './CostMoveCard';

import styles from './CostMoveMange.less';


const { TreeNode } = Tree;

@connect(state =>({
    costAccount: state.costAccount,
}))
class CostMoveMange extends PureComponent{

    state = {
        data : [
            {
                record_id : 1,
            },
        ],
        projectID : '',
        treeData : [],
        contract_type : [],
        staticInfo : {},
        proj_cost_id : '',
        selectedRowKeys: [],
        selectedRows: [],
        formVisible : false,
    };

    componentWillMount(){
        queryTree({ q: 'tree', parent_code: "contract$#contractType", level: 0 }).then(res=>{
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ contract_type : res.list });
            }
        })
        this.dispatch({  //项目列表
            type: 'costAccount/queryProTree',
            payload: {}
        });
    };

    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    formateTree(list) {  //项目列表处理
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!item.selectable) {
                item.title = <span style={{ color: '#cccccc' }}>{item.title}</span>;
            }
            if (item.children && item.children.length > 0) {
                this.formateTree(item.children);
            }
        }
    };

    handleProChange = (value, label) => {
        this.setState({ projectID : value });
        const param = { projectID : value };
        getCostMoveSubjectList(param).then(res=>{ //查询科目列表
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ treeData : res });
                // const info = { target_cost : res[0].target_cost, plan_amount : res[0].plan_amount, left_amount : res[0].left_amount };
                this.setState({ staticInfo : res[0], proj_cost_id : res[0].proj_cost_id });
            }
        });
        //和静态展示数据。静态展示数据已经得到在该接口
        //和第一个科目列表下的第一个科目下的合同列表数据。
    };

    getStatic = ( tree, rid ) => {
        for(let i=0; i<tree.length; i++){
            if( rid == tree[i].proj_cost_id ){
                return tree[i];
            }else{
                if(tree[i].children && tree[i].children.length > 0){
                    let t= this.getStatic(tree[i].children, rid);
                    if (t) {
                        return t;
                    }
                }
            }
        }
    };

    //科目列表
    getTreeNode = data => {
        return data.map(item => {
            if(item.children && item.children.length){
                return (
                    <TreeNode key={item.proj_cost_id} title={item.cost_name}>
                        {this.getTreeNode(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.proj_cost_id} title={item.cost_name}></TreeNode>;
        })
    };

    selectTreeNode = (selectedKeys,e) => {
        const {
            treeData,
            projectID,
            proj_cost_id,
        } = this.state;

        if(e.selected){
            //TODO查询该科目下的合同。
            let temp = this.getStatic( treeData, selectedKeys[0] );
            // const info = { target_cost : temp.target_cost, plan_amount : temp.plan_amount, left_amount : temp.left_amount };
            this.setState({ staticInfo : temp, proj_cost_id : selectedKeys[0] });

        }
        else{
            //TODO查询该科目下的合同。
            let temp = this.getStatic( treeData, proj_cost_id );
            // const info = { target_cost : temp.target_cost, plan_amount : temp.plan_amount, left_amount : temp.left_amount };
            this.setState({ staticInfo : temp, proj_cost_id : proj_cost_id });
        }
    };

    //选择合同
    handleTableSelectRow = ( keys, rows ) => {
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

    //清除选择
    clearSelectRows = () => {
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            return;
        }
        this.setState({ selectedRowKeys: [], selectedRows: [] });
    };


    renderDataShow(){

        const { staticInfo }= this.state;

        const col = {
            sm : 24,
            md : 8,
        };

        return(
            <Row gutter={8}>
                <Col {...col}>
                    目标成本 : {staticInfo.target_cost}
                </Col>
                <Col {...col}>
                    规划余额 : {staticInfo.plan_amount}
                </Col>
                <Col {...col}>
                    规划余量 : { staticInfo.left_amount }
                </Col>
            </Row>
        )
    };

    renderFormInfo(){

    };

    //调动操作
    costMove = () => {
        const { selectedRowKeys, selectedRows } = this.state;
        this.setState({ formVisible : true });
    }

    onCostMove = ( move = false) =>{
        if(move){
            //进行资本调动
        }
        this.setState({ formVisible : false });
        this.clearSelectRows();
    }
    
    render(){

        const { 
            projectID, 
            treeData,
            data,
            contract_type,
            staticInfo,
            selectedRowKeys,
            selectedRows,
            formVisible,
        } = this.state;

        const {
            form,
            costAccount:{ projectTreeData },
        } = this.props;

        const breadcrumbList = [
            { title : '成本管理' },
            { title : '成本调动' },
        ];

        this.formateTree(projectTreeData);

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'name',
                key : 'name',
                width : 150,
            },
            {
                title : '合同类别',
                dataIndex : 'contract_type',
                key : 'contract_type',
                width: 150,
                render : (data,record) => {
                    if(data){
                        for(let i=0; i<contract_type.length;i++){
                            if( contract_type[i].code == data.toString()){
                                return <span>{contract_type[i].name}</span>
                            }
                        }
                    }else{
                        return '';
                    }
                }
            },
        ];

        return(
            <div>
                 {
                    (projectID && projectID != "") ?
                    <PageHeaderLayout title={<div>
                        <span>当前项目：</span>
                        <TreeSelect
                            value={ projectID }
                            treeData = { projectTreeData }
                            style = {{ width : 200 }}
                            onChange={this.handleProChange}
                        >
        
                        </TreeSelect>
                    </div>} breadcrumbList={breadcrumbList}>
                        <Layout>
                            <Layout.Sider
                                width = {200}
                                className={styles.siderSty}
                            >
                                <Tree
                                    className ="draggable-tree"
                                    draggable
                                    blockNode
                                    onSelect = { this.selectTreeNode }
                                >
                                    { this.getTreeNode(treeData) }
                                </Tree>
                            </Layout.Sider>
                            <Layout.Content>
                                <Card bordered={false} >
                                    <div className={styles.tableList}>
                                        {
                                            staticInfo && 
                                            <div style={{ marginBottom : 20 }}>{this.renderDataShow()}</div>
                                        }
                                        {
                                            selectedRows.length === 1 &&
                                            <Button style={{ marginBottom : 15}} type="primary" onClick={this.costMove}>
                                                调动
                                            </Button>
                                        }
                                        <Table
                                            columns = { columns }
                                            rowSelection={{ selectedRowKeys, onChange: this.handleTableSelectRow }}
                                            rowKey = { record => record.record_id}
                                            scroll = { {x :1000,y : 700}  }
                                            bordered = { true }
                                            dataSource = { data }
                                            pagination = {false}
                                        >
            
                                        </Table>
                                    </div>
                                </Card>
                            </Layout.Content>
                        </Layout>
                        {
                            formVisible &&
                            <CostMoveCard formVisible={ formVisible } onCostMove = { this.onCostMove } staticInfo = { staticInfo } contractInfo = {selectedRows[0]}></CostMoveCard>
                        }
                    </PageHeaderLayout>
                    :
                    <PageHeaderLayout title={<div>
                        <span>当前项目：</span>
                        <TreeSelect
                            value={ projectID }
                            treeData = { projectTreeData }
                            style = {{ width : 200 }}
                            onChange={this.handleProChange}
                        >
        
                        </TreeSelect>
                    </div>} breadcrumbList={breadcrumbList}>
                        <Card bordered={false} className={ styles.cardStyle}>
                        </Card>
                    </PageHeaderLayout>
                }
            </div>
        )
    }
}

export default CostMoveMange;