import React,{ PureComponent } from  'react';
import { Table } from 'antd';

export class CapitalizedInterest extends PureComponent {
    render(){

        const columns = [
            {
                title : "年份",
                dataIndex : 'year',
                key : 'year',
                width : 80,
                fixed : 'left'
            },
            {
                title : '销售回款',
                dataIndex : 'huikuan',
                key : 'huikuan',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'huikuan1',
                        key : 'huikuan1',
                        width : 100,
                    },
                    {
                        title : '二季度',
                        dataIndex : 'huikuan2',
                        key : 'huikuan2',
                        width : 100,
                    },
                    {
                        title : '三季度',
                        dataIndex : 'huikuan3',
                        key : 'huikuan3',
                        width : 100,
                    },
                    {
                        title : '四季度',
                        dataIndex : 'huikuan4',
                        key : 'huikuan4',
                        width : 100,
                    },
                ]
            },
            {
               title : '成本支出',
               dataIndex : 'costused',
                key : 'costused',
               children : [
                   {
                        title : '一季度',
                        dataIndex : 'costused1',
                        key : 'costused1',
                        width : 100,
                   },
                   {
                        title : '二季度',
                        dataIndex : 'costused2',
                        key : 'costused2',
                        width : 100,
                   },
                   {
                        title : '三季度',
                        dataIndex : 'costused3',
                        key : 'costused3',
                        width : 100,
                   },
                   {
                        title : '四季度',
                        dataIndex : 'costused4',
                        key : 'costused4',
                        width : 100,
                   },
               ] 
            },
            {
                title : '预售保证金支出',
                dataIndex : 'a',
                key : 'a',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'a1',
                        key : 'a1',
                        width : 100,
                    },
                    {
                        title : '二季度',
                        dataIndex : 'a2',
                        key : 'a2',
                        width : 100,
                    },
                    {
                        title : '三季度',
                        dataIndex : 'a3',
                        key : 'a3',
                        width : 100,
                    },
                    {
                        title : '四季度',
                        dataIndex : 'a4',
                        key : 'a4',
                        width : 100,
                    },
                ] 
            },
            {
                title : '预售保证金返还',
                dataIndex : 'b',
                key : 'b',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'b1',
                        key : 'b1',
                        width : 100,
                    },
                    {
                        title : '二季度',
                        dataIndex : 'b2',
                        key : 'b2',
                        width : 100,
                    },
                    {
                        title : '三季度',
                        dataIndex : 'b3',
                        key : 'b3',
                        width : 100,
                    },
                    {
                        title : '四季度',
                        dataIndex : 'b4',
                        key : 'b4',
                        width : 100,
                    },
                ] 
            },
            {
                title : "税金比例",
                dataIndex : 'c',
                key : 'c',
                width : 100,
            },
            {
                title : "税金",
                dataIndex : 'd',
                key : 'd',
                width : 100,
            },
            {
                title : "资本占用金额",
                dataIndex : 'e',
                key : 'e',
                width : 100,
            },
            {
                title : "资金年成本率",
                dataIndex : 'f',
                key : 'f',
                width : 100,
            },
            {
                title : "累计占用资金",
                dataIndex : 'g',
                key : 'g',
                width : 100,
            },
            {
                title : "资金占用费",
                dataIndex : 'h',
                key : 'h',
                width : 100,
            },
            {
                title : "税金比例",
                dataIndex : 'i',
                key : 'i',
                width : 100,
            },
            {
                title : "操作",
                dataIndex : "operation",
                key : "operation",
                align : "center",
                width : 100,
                fixed : 'right',
                render : (text,record) => {
                    return <a>编辑</a>
                }
            }
        ]
        return (
            <Table
                columns = { columns }
                scroll = {{ x : 15  , y : 800 }} 
            >

            </Table>
        )
    }
}

export default CapitalizedInterest;

