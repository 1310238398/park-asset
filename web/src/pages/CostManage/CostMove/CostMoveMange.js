import React,{ PureComponent } from 'react';
import { TreeSelect, Card, Tree, Row, Col, Table, Layout, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { queryTree } from '@/services/dictionary';
import { getCostMoveSubjectList, getDynamicCostProjPlane } from '@/services/dynamicCostProj';
import CostMoveCard from './CostMoveCard';

import styles from './CostMoveMange.less';


const { TreeNode } = Tree;

@connect(state =>({
    costAccount: state.costAccount,
}))
@Form.create()
class CostMoveMange extends PureComponent{

    state = {
        data : [
        ],
        projectID : '',
        treeData : [],
        contract_type : [],
        staticInfo : {},
        proj_cost_id : '',
        selectedRowKeys: [],
        selectedRows: [],
        formVisible : false,
        loading : true
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

    //项目列表处理
    formateTree(list) {  
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
        //查询科目列表
        getCostMoveSubjectList(param).then(res=>{ 
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ treeData : res.list });
                this.setState({ staticInfo : res.list[0], proj_cost_id : res.list[0].proj_cost_id });
                this.getData(res.list[0].proj_cost_id);
            }
        });
    };

    //合同列表
    getData = (proj_cost_id) => {
        getDynamicCostProjPlane(proj_cost_id).then( res=> {
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ data : res.list});
            }
        })
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

        // const param = { projectID : projectID };
        this.setState({ loading : true });

        if(e.selected){
            let temp = this.getStatic( treeData, selectedKeys[0] );
            this.setState({ staticInfo : temp, proj_cost_id : selectedKeys[0] });
            this.getData(selectedKeys[0]);
        }
        else{
            let temp = this.getStatic( treeData, proj_cost_id );
            this.setState({ staticInfo : temp, proj_cost_id : proj_cost_id });
            this.getData(proj_cost_id);
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

    renderSearchForm(){

        const {
            form: { getFieldDecorator },
        } = this.props;

        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
        const col = {
            sm: 24,
            md: 12,
        };
        return (
            <Form onSubmit={this.handleSearchFormSubmit} className={styles.form}  style={{ marginBottom: '10px' }}>
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
            loading,
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
                dataIndex : 'contract_name',
                key : 'contract_name',
                width : 200,
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
                                            this.renderSearchForm()
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
                                            rowKey = { record => record.contract_id}
                                            scroll = { {x :1000,y : 700}  }
                                            bordered = { true }
                                            dataSource = { data }
                                            pagination = {false}
                                            loading = { loading }
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