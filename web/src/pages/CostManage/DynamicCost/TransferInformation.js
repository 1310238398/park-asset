import React,{ PureComponent } from 'react';
import { Table } from 'antd';
import { getDynamicCostProjTransfer } from '@/services/dynamicCostProj'


//调动信息
class TransferInformation extends PureComponent{

    state = {
        data : {
            list : [],
        },
        loading : true,
    };

    componentWillMount(){
        const { subject_id, projectID } = this.props;
        this.getData(subject_id);
    }

    getData(subject_id){
        getDynamicCostProjTransfer(subject_id).then(res =>{
            this.setState({ loading : false });
            if( res && res.error ){
                console.log(res.error.message);
            }else{
                this.setState({ data : res});
            }
        })
    }

    render(){

        const {
            data :{
                list
            },
            loading,
        } = this.state;
        
        const columns = [
            {
                title : '调出',
                dataIndex : 'transfer_out',
                key : 'transfer_out',
                align : 'center',
                children : [
                    {
                        title : '调出科目',
                        dataIndex : 'from_cost_name',
                        key : 'from_cost_name',
                        align: 'center',
                        width : 100,
                    },
                    {
                        title : '调出项',
                        dataIndex : 'from_planning_name',
                        key : 'from_planning_name',
                        align : 'center',
                        width : 150,
                    }
                ],
            },
            {
                title : '调入',
                dataIndex : 'transfer_in',
                key : 'transfer_in',
                align : 'center',
                children : [
                    {
                        title : '调入科目',
                        dataIndex : 'to_cost_name',
                        key : 'to_cost_name',
                        align : 'center',
                        width : 100,
                    },
                    {
                        title : '调入项',
                        dataIndex : 'to_planning_name',
                        key : 'to_planning_name',
                        align : 'center',
                        width : 150,
                    },
                ],
            },
            {
                title : '调动金额',
                dataIndex : 'amount',
                key : 'amount',
                align : 'center',
                width : 100,
            },
            {
                //1.调出，2.调入，3.内部调整
                title : '调动类型',
                dataIndex : 'transfer_type',
                key : "transfer_type",
                align : 'center',
                width : 100,
                render : (text,record)=>{
                    if( text === 1 ){
                        return '调出';
                    }else if( text === 2 ){
                        return '调入';
                    }else if( text === 3){
                        return '内部调整';
                    }else{
                        return ''; //数据错误。
                    }
                }
            },
            {
                title : '审批通过时间',
                dataIndex : 'pass_time',
                key : 'pass_time',
                align : 'center',
                width : 100,
            },
        ];

        return(
            <div>
                <Table
                    columns = { columns }
                    dataSource = { list }
                    rowKey = { record => record.record_id }
                    bordered = { true }
                    pagination = { false }
                    scroll = {{ x : 1000, y : 500 }}
                    loading = { loading }
                >

                </Table>
            </div>
        )
    }
}

export default TransferInformation;