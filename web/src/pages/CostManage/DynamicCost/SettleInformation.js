import React,{ PureComponent } from 'react';
import { Card, Table } from 'antd';

class SettleInformation extends PureComponent{

    state = {
        dataList : [
            {
                record_id : '1',
                name : '汉峪金融商务中心A4、A6地块电梯设备买卖合同补充协议',
                code : '2013-zbnqa6-049-070-001',
                type : '合同类别',
                money : 386800.00,
                result_cost : 386800,
            },
        ],
        
    }

    componentWillMount(){
        const { subject_id } = this.props;

        console.log('prop',subject_id);

        //TODO去查询接口，--得到该科目下的合同。
    }

    render(){
        
        const {
            dataList,
        } = this.state;

        const columns = [
            {
                title : '合同名称',
                dataIndex : 'name',
                key : 'name',
                width : 200,
                align : 'center',
            },
            {
                title : '合同编号',
                dataIndex : 'code',
                key : 'code',
                width : 200,
                align : 'center',
            },
            {
                title : '合同类别',
                dataIndex : 'type',
                key : 'type',
                width : 200,
                align : 'center',
            },
            {
                title : '合同额（不含甲供）',
                dataIndex : 'money',
                key : 'money',
                width : 100,
                align : 'center',
            },
            {
                title : '结算金额',
                dataIndex : 'result_cost',
                key : 'result_cost',
                width : 100,
                align : 'center',
            }
        ];

        return(
            // <Card bordered={false}>
            <div>
                <Table
                    columns = {columns}
                    dataSource = { dataList }
                    rowKey = { record => record.record_id}
                    bordered = { true }
                    pagination={false}
                    scroll = {{ x : 1000, y : 500 }}
                >

                </Table>
            </div>
               
            // </Card>
        )
    }
}

export default SettleInformation;