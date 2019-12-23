import React, { PureComponent } from 'react';
import { Form, TreeSelect, Card, Row, Col, Tree, Table, Modal,Layout } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import ContractProCard from './ContractProCard';

import { connect } from 'dva';

import styles from './ContractPlanInfo.less';

import { queryTree } from '@/services/dictionary';
import { queryCostItemByPro } from '@/services/costAccount';
import { queryContractPlanByProj, queryContractStatistic, deleteContractPlanProj } from '@/services/contractPlanProj';

const { TreeNode } = Tree;


@connect(state =>({
    costAccount: state.costAccount,
}))

@Form.create()
class ContractPlanInfo extends PureComponent{

    state = {
        projectID : '',
        treeData : [
            // {
            //     record_id : '1',
            //     name : '开发成本',
            //     children : [
            //         {
            //             record_id : '1-1',
            //             name : '前期费用',
            //             children :[
            //                 {
            //                     record_id : '1-1-1',
            //                     name : '市政配套费'
            //                 }
            //             ]
            //         },
            //         {
            //             record_id : '1-2',
            //             name : '开发间接费'
            //         }
            //     ]
            // },
            // {
            //     record_id : '2',
            //     name : '期间费用',
            // }
        ],
        node : null,
        cost_id : '',  //科目id
        data : {
            list : [
            ],
            pagination : {},
        },
        staticInfo : {},
        contract_type : [],
        formVisible : false,
        topInfo : {},
        editInfo : null,
        loading : true,
    }

    componentWillMount(){
        //得到合同类别的字典表  
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
    }

    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    handleProChange = (value, label) => {
        this.setState({ projectID : value });
        queryCostItemByPro(value).then(res => {
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ treeData : res.list, node : res.list[0], cost_id : res.list[0].cost_id });
                const param = { pageSize : 10, current : 1, project_id : value, cost_id : res.list[0].cost_id };
                this.getDataList(param);
                this.getStaticInfo({ project_id : value, cost_id : res.list[0].cost_id });
            }
        })
    }

    getDataList(param){
        queryContractPlanByProj(param).then( res => {
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ data : res});
            }
        })
    }

    getStaticInfo(param){
        queryContractStatistic(param).then( res => {
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ staticInfo : res });
            }
        })
    }

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
    }

    //科目列表
    getTreeNode = data => {
        return data.map(item => {
            if(item.children && item.children.length){
                return (
                    <TreeNode key={item.cost_id} title={item.name}>
                        {this.getTreeNode(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.cost_id} title={item.name}></TreeNode>;
        })
    };

    selectTreeNode = (selectedKeys,e) => {
        const {
            treeData,
            data : {
                pagination : {
                    pageSize,
                    current
                }
            },
            projectID,
            cost_id,
        } = this.state;
        this.setState({ loading : true });
        if(e.selected){
            //科目类别发生改变
            this.setState({ cost_id : selectedKeys[0] }); //得到新的科目Id
            //查询该科目下的合同。
            const param = { pageSize : pageSize, current : current, project_id : projectID, cost_id : selectedKeys[0] };
            this.getDataList(param);
            this.getStaticInfo({ project_id : projectID, cost_id : selectedKeys[0] });
            //查询出node
            let rNode = this.isHasChild( treeData, selectedKeys[0] );
            if(rNode){
                this.setState({ node : rNode });
            }
        }else{
            //查询当前的科目和项目下的合约规划
            const param = { pageSize : pageSize, current : current, project_id : projectID, cost_id : cost_id };
            this.getDataList(param);
            this.getStaticInfo({ project_id : projectID, cost_id : cost_id });
        }
    }
    
    isHasChild = ( tree, rid) => {
        for(let i=0;i<tree.length;i++){
            if(rid == tree[i].cost_id){
                return tree[i];
            }else if(tree[i].children && tree[i].children.length > 0){
                let t= this.isHasChild(tree[i].children, rid);
                if (t) {
                    return t;
                }
            }
        }
    }

    //编辑
    editing = record => {
        this.setState({ formVisible : true,editInfo : record});
    }

    //添加
    handleAddClick = () => {
        this.setState({ formVisible : true, editInfo : null});
    }

    //删除
    handleDelClick = (record) => {
        Modal.confirm({
            title : '确定删除该合约规划',
            okText : '确定',
            okType : 'danger',
            cancelText : '取消',
            onOk : this.handleDelOKClick.bind(this, record.record_id),
        });
    }

    handleDelOKClick = (param) => {
        this.setState({ loading : true });
        const {
            data : {
                pagination : {
                    pageSize,
                    current,
                }
            },
            projectID,
            cost_id,
        } = this.state;
        const params = { pageSize : pageSize, current : current, project_id : projectID, cost_id : cost_id };
        deleteContractPlanProj(param).then(res => {
            this.setState({ loading : false });
            if( res && res.status == "OK" ){
                this.getDataList(params);
                this.getStaticInfo({ project_id : projectID, cost_id : cost_id });
            }else{
                if(res && res.error){
                    console.log(res.error.message);
                }
            }
        })
    } 

    onSave = ( saved = false) => {
        const {
            data : {
                pagination : {
                    pageSize,
                    current,
                }
            },
            projectID,
            cost_id,
        } = this.state;
        if(saved){
            this.setState({ loading : true });
            //查询接口，最新数据
            const param = { pageSize : pageSize, current : current, project_id : projectID, cost_id : cost_id };
            this.getDataList(param);
            this.getStaticInfo({ project_id : projectID, cost_id : cost_id });
        }
        this.setState({ formVisible : false, editInfo : null });
    }

    renderDataShow(){

        const { staticInfo }= this.state;
        return(
            <Row gutter={8}>
                <Col span={5}>
                    目标成本 : {staticInfo.target_cost}
                </Col>
                <Col span={5}>
                    规划余额 : {staticInfo.plan_amount}
                </Col>
                <Col span={5}>
                    规划余量 : { staticInfo.left_amount }
                </Col>
                <Col span={5}>
                    合约规划数 :{ staticInfo.count}
                </Col>
                <Col span={4}>
                    未引用规划数 : { staticInfo.un_refer_count }
                </Col>
            </Row>
        )
    }

    render(){

        const { 
            projectID, 
            treeData,
            node,
            data : { list , pagination },
            loading,
            contract_type,
            formVisible,
            editInfo,
            staticInfo,
        } = this.state;

        const {
            form,
            costAccount:{ projectTreeData, formID },
        } = this.props;

        const breadcrumbList = [
            { title : '成本管理' },
            { title : '合约规划' },
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

        // 1:已引用 2:未引用 3:部分引用
        const columns = [
            {
                title : '合同名称',
                dataIndex : 'name',
                key : 'name',
                width : 150,
                render : (text,record) => {
                    if(record.refer_status == 1){
                        return <span style={{ color :'red' }}>{text}</span>
                    }else if(record.refer_status == 3){
                        return <span style={{ color : 'green'}}>{text}</span>
                    }else{
                    return <span>{text}</span>
                    }
                }
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
                                // return contract_type[i].name;
                                if(record.refer_status == 1){
                                    return <span style={{ color :'red' }}>{contract_type[i].name}</span>
                                }else if(record.refer_status == 3){
                                    return <span style={{ color : 'green'}}>{contract_type[i].name}</span>
                                }else{
                                return <span>{contract_type[i].name}</span>
                                }
                            }
                        }
                    }else{
                        return '';
                    }
                }
            },
            {
                title : '合同预估金额',
                dataIndex : 'planning_price',
                key : 'planning_price',
                width : 150,
                render : (text,record) => {
                    if(record.refer_status == 1){
                        return <span style={{ color :'red' }}>{text}</span>
                    }else if(record.refer_status == 3){
                        return <span style={{ color : 'green'}}>{text}</span>
                    }else{
                    return <span>{text}</span>
                    }
                }
            },
            {
                title : '合同签订金额',
                dataIndex : 'signed_amount',
                key : 'signed_amount',
                width : 150,
                render : (text,record) => {
                    if(record.refer_status == 1){
                        return <span style={{ color :'red' }}>{text}</span>
                    }else if(record.refer_status == 3){
                        return <span style={{ color : 'green'}}>{text}</span>
                    }else{
                    return <span>{text}</span>
                    }
                }
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 200,
                align : 'center',
                render : (text,record) => {
                    return(
                        <span>
                            <a onClick={()=> {this.editing(record)}}>编辑</a>  &nbsp;&nbsp;&nbsp;
                            <a onClick={() => { this.handleDelClick(record)}}>删除</a>
                        </span>
                    ) 
                }
            }
        ];

        this.formateTree(projectTreeData);

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => <span>共{total}条</span>,
            ...pagination
        };

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
                                // style = {{ background : '#fff', borderRight :'1px solid lightGray' }}
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
                                        <div className={styles.tableListShow}>{this.renderDataShow()}</div>
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
                                        columns = { columns }
                                        rowKey = { record => record.record_id}
                                        scroll = { {x :1000,y : 700}  }
                                        bordered = { true }
                                        dataSource = { list }
                                        pagination = {paginationProps}
                                        loading = { loading }
                                    >
        
                                    </Table>
                                    </div>
                                </Card>
                            </Layout.Content>
                        </Layout>
                        {
                            formVisible &&
                            <ContractProCard formVisible={ formVisible } editInfo = { editInfo } node = { node } onSave ={ this.onSave } topInfo ={ staticInfo } projectID = { projectID }></ContractProCard>
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

export default ContractPlanInfo;