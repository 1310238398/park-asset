import React, { PureComponent } from 'react';
import { Table, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DynamicCostProjDetail from './DynamicCostProjDetail';

class DynamicCostProj extends PureComponent{

    state = {
        data :[
            {
                record_id : '1',
                name : '开发成本',
                target_cost : 50000000,
                settlement_amount : 20000000,
                to_settled_amount : 10000000,
                transit_amount : 10000000,
                remain_plann_amount : 50000,
                result_amount : 40050000,
                transfer_amount : 0,
                balance : 0,
                children : [
                    {
                        record_id : '1-1',
                        name : '土地征用及拆迁补偿费',
                        target_cost : 50000000,
                        settlement_amount : 20000000,
                        to_settled_amount : 10000000,
                        transit_amount : 10000000,
                        remain_plann_amount : 50000,
                        result_amount : 40050000,
                        transfer_amount : 0,
                        balance : 0,
                    },
                    {
                        record_id : '1-2',
                        name : '建筑安装工程费',
                        target_cost : 50000000,
                        settlement_amount : 20000000,
                        to_settled_amount : 10000000,
                        transit_amount : 10000000,
                        remain_plann_amount : 50000,
                        result_amount : 40050000,
                        transfer_amount : 0,
                        balance : 0,
                        children : [
                            {
                                record_id : '1-2-1',
                                name : '主体工程（含甲供材料及设备）',
                                target_cost : 50000000,
                                settlement_amount : 20000000,
                                to_settled_amount : 10000000,
                                transit_amount : 10000000,
                                remain_plann_amount : 50000,
                                result_amount : 40050000,
                                transfer_amount : 0,
                                balance : 0,
                                children : [
                                    {
                                        record_id : '1-2-1-1',
                                        name : '土石方',
                                        target_cost : 50000000,
                                        settlement_amount : 20000000,
                                        to_settled_amount : 10000000,
                                        transit_amount : 10000000,
                                        remain_plann_amount : 50000,
                                        result_amount : 40050000,
                                        transfer_amount : 0,
                                        balance : 0,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ],
        loading : true,
        formVisiable : false,
        seeInfo : null,
    };

    componentWillMount(){
        //TODO 调用接口，查询数据。
        this.getData();
    }

    getData = () => {
        //返回数据后
        this.setState({ loading : false });
    }

    handleSeeDetail = record => {
        console.log('see',record);
        this.setState({ formVisiable : true, seeInfo : record});
    }

    cancel = () => {
        this.setState({ formVisiable : false, seeInfo : null });
    }
    render(){

        const { data, loading, formVisiable, seeInfo } = this.state;

        const breadcrumbList = [
            { title : '成本管理'},
            { title : '动态成本'},
        ];

        const columns = [
            {
                title : '科目名称',
                dataIndex : 'name',
                key : 'name',
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
                dataIndex : 'settlement_amount',
                key : 'settlement_amount',
                width : 100,
                align : 'center',
            },
            {
                title : '待结算金额',
                dataIndex : 'to_settled_amount',
                key : 'to_settled_amount',
                width : 100,
                align : 'center',
            },
            {
                title : '在途金额',
                dataIndex : 'transit_amount',
                key : 'transit_amount',
                width : 100,
                align : 'center',
            },
            {
                title : '剩余规划金额',
                dataIndex : 'remain_plann_amount',
                key : 'remain_plann_amount',
                width: 100,
                align : 'center',

            },
            {
                title : '最终成本',
                dataIndex : 'result_amount',
                key : 'result_amount',
                width: 100,
                align : 'center',
            },
            {
                title : '调动金额',
                dataIndex : 'transfer_amount',
                key : 'transfer_amount',
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

        return(
            <PageHeaderLayout title={'动态成本'} breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <Table
                        columns = { columns }
                        dataSource = { data }
                        rowKey={record => record.record_id}
                        pagination={false}
                        bordered = { true }
                        scroll  = { { x : 1500, y : 800 } }
                        loading = { loading }
                    >    

                    </Table>
                </Card>
                {
                    formVisiable &&
                    <DynamicCostProjDetail cancel={this.cancel} formVisiable={formVisiable} info={seeInfo}></DynamicCostProjDetail>
                }
            </PageHeaderLayout>
        )
    }
}

export default  DynamicCostProj;