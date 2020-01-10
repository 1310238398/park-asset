import React, { PureComponent } from 'react';
import { Table, Card, TreeSelect } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DynamicCostProjDetail from './DynamicCostProjDetail';
import { getDynamicCostProj } from '@/services/dynamicCostProj';

@connect(state =>({
    costAccount: state.costAccount,
}))
class DynamicCostProj extends PureComponent{

    state = {
        projectID : '',
        data :[
            // {
            //     record_id : '1',
            //     name : '开发成本',
            //     target_cost : 50000000,
            //     settlement_amount : 20000000,
            //     to_settled_amount : 10000000,
            //     transit_amount : 10000000,
            //     remain_plann_amount : 50000,
            //     result_amount : 40050000,
            //     transfer_amount : 0,
            //     balance : 0,
            //     children : [
            //         {
            //             record_id : '1-1',
            //             name : '土地征用及拆迁补偿费',
            //             target_cost : 50000000,
            //             settlement_amount : 20000000,
            //             to_settled_amount : 10000000,
            //             transit_amount : 10000000,
            //             remain_plann_amount : 50000,
            //             result_amount : 40050000,
            //             transfer_amount : 0,
            //             balance : 0,
            //         },
            //         {
            //             record_id : '1-2',
            //             name : '建筑安装工程费',
            //             target_cost : 50000000,
            //             settlement_amount : 20000000,
            //             to_settled_amount : 10000000,
            //             transit_amount : 10000000,
            //             remain_plann_amount : 50000,
            //             result_amount : 40050000,
            //             transfer_amount : 0,
            //             balance : 0,
            //             children : [
            //                 {
            //                     record_id : '1-2-1',
            //                     name : '主体工程（含甲供材料及设备）',
            //                     target_cost : 50000000,
            //                     settlement_amount : 20000000,
            //                     to_settled_amount : 10000000,
            //                     transit_amount : 10000000,
            //                     remain_plann_amount : 50000,
            //                     result_amount : 40050000,
            //                     transfer_amount : 0,
            //                     balance : 0,
            //                     children : [
            //                         {
            //                             record_id : '1-2-1-1',
            //                             name : '土石方',
            //                             target_cost : 50000000,
            //                             settlement_amount : 20000000,
            //                             to_settled_amount : 10000000,
            //                             transit_amount : 10000000,
            //                             remain_plann_amount : 50000,
            //                             result_amount : 40050000,
            //                             transfer_amount : 0,
            //                             balance : 0,
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     ]
            // },
        ],
        loading : false,
        formVisiable : false,
        seeInfo : null,
    };

    componentWillMount(){
        this.dispatch({  
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
    }

    handleProChange = (value, label) => {
        this.setState({ projectID : value, loading : true });
        const param = { projectID : value }
        getDynamicCostProj(param).then(res => {
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                this.setState({ data : res.list });
            }
        });
    }

    handleSeeDetail = record => {
        this.setState({ formVisiable : true, seeInfo : record});
    };

    cancel = () => {
        this.setState({ formVisiable : false, seeInfo : null });
    };
    render(){

        const { data, loading, formVisiable, seeInfo, projectID } = this.state;

        const breadcrumbList = [
            { title : '成本管理'},
            { title : '动态成本'},
        ];

        const columns = [
            {
                title : '科目名称',
                dataIndex : 'cost_name',
                key : 'cost_name',
                width : 200,
            },
            {
                title : '目标金额',
                dataIndex : 'target_cost',
                key : 'target_cost',
                width : 100,
                align : 'center',
            },
            {
                title : '结算金额',
                dataIndex : 'Settled',
                key : 'Settled',
                width : 100,
                align : 'center',
            },
            {
                title : '待结算金额',
                dataIndex : 'unsettled',
                key : 'unsettled',
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
                title : '剩余规划金额',
                dataIndex : 'left_plan_amount',
                key : 'left_plan_amount',
                width: 100,
                align : 'center',

            },
            {
                title : '最终成本',
                dataIndex : 'all',
                key : 'all',
                width: 100,
                align : 'center',
            },
            {
                title : '调动金额',
                dataIndex : 'transfer',
                key : 'transfer',
                width : 100,
                align : 'center',
            },
            {
                title : '余额',
                dataIndex : 'balance',
                key : 'balance',
                width : 100,
                align : 'center',
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 100,
                align : 'center',
                fixed : 'right',
                render : (text,record) => {
                    return (
                        <a onClick={ () => { this.handleSeeDetail(record)}}>查看</a>
                    )
                }
            },
        ];

        const {
            costAccount:{ projectTreeData },
        } = this.props;
        this.formateTree(projectTreeData);

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
                    <Card bordered={false}>
                        <Table
                            columns = { columns }
                            dataSource = { data }
                            rowKey={ record => record.cost_id }
                            pagination={false}
                            bordered = { true }
                            scroll  = { { x : 1500, y : 800 } }
                            loading = { loading }
                        >    

                        </Table>
                    </Card>
                    {
                        formVisiable &&
                        <DynamicCostProjDetail cancel={this.cancel} formVisiable={formVisiable} info={seeInfo} projectID={projectID}></DynamicCostProjDetail>
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
                    <Card bordered={false} style={{ height : 500 }}>
                    </Card>
                </PageHeaderLayout>
            }
            </div>
        )
    }
}

export default  DynamicCostProj;