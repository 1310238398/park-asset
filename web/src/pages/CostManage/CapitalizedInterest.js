import React,{ PureComponent } from  'react';
import { Table, Form, InputNumber, Popconfirm, Input } from 'antd';
import { connect } from 'dva';

import { queryCapitalized, updateCapitalized } from '@/services/costAccount';

//资本化利息

const EditableContext = React.createContext();

@Form.create()
class EditableCell extends React.Component{
    getInput = () =>{
        if(this.props.inputType === 'number'){
            if(this.props.title == '税金比例' || this.props.title == '资金年成本率' ){
                return <InputNumber style= {{ width : '90%'}} min={0} max={100} formatter={ value => `${value}%`}
                    parser = { value => value.replace('%', '')}
                />;
            }
            return <InputNumber style= {{ width : '90%'}} min={0}/>
        }
        return <Input/>
    }

    renderCell = ({ getFieldDecorator })=>{
        const { editing, dataIndex, title, inputType, 
            record, index, children, ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {
                    editing ? (
                        <Form.Item style={{ margin : 0}}>
                            {getFieldDecorator(dataIndex,{
                                rules : [
                                    {
                                        required : true,
                                        message : `请输入${title}`,
                                    }
                                ],
                                initialValue : inputType == 'number' ? (title =='税金比例' || title =="资金年成本率") ? record[dataIndex] ? record[dataIndex] * 100 : 0 : record[dataIndex] ? record[dataIndex] : 0 
                                                                     : record[dataIndex] ? record[dataIndex].tostring() : '',
                            })(this.getInput())}
                        </Form.Item>
                    ) :
                    (
                        children
                    )
                }
            </td>
        )
    };

    render(){
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    }
}

@connect(state => ({
    costAccount: state.costAccount,
}))
@Form.create()
export class CapitalizedInterest extends PureComponent {  

    state = {
        data : [
        ],
        editingKey : '',
        loading : true,
    }

    componentWillMount(){
        const {
            costAccount: { formID },
        } = this.props;
        const params = { q : 'year', projectID : formID };
        this.getData(params);
    }

    getData = (params) =>{
       queryCapitalized(params).then(res=>{
           this.setState({loading : false});
           if(res && res.error){
               console.log(res.error.message);
           }else{
               console.log("res",res);
               const data_arr = [...res];
               let total  = 0;
               for(let i=0;i<data_arr.length;i++){
                   total += data_arr[i].fund_possession_cost;
               }
               const item = {
                   record_id : '-1',
                   year : -1,
                   fund_possession_cost : total,
               }
               data_arr.push(item);
               this.setState({ data : [...data_arr]});
           }
       })
    }

    mapEditColumns = columns => {
        const ecolumns = [];
        columns.forEach(item => {
            const eitem = {...item};
            if(eitem.editable){
                eitem.onCell = record => ({
                    record,
                    inputType : item.type,
                    dataIndex : item.dataIndex,
                    title : item.title,
                    editing : this.isEditing(record),
                })
            }
            if (eitem.children) {
                eitem.children = this.mapEditColumns(eitem.children);
            }
            ecolumns.push(eitem);
        });
        return ecolumns;
    }

    isEditing = record => record.record_id === this.state.editingKey;

    edit = (rid) => {
        this.setState({ editingKey : rid});
    }

    save = (form, record) =>{
        const {
            costAccount: { formID },
        } = this.props;
        form.validateFields((err,row) => {
            if(err){
                return;
            }
            console.log('row',row);
            console.log('record',record);
            const params = {...record};
            params.interest_rate = row.interest_rate / 100;
            params.tax_rate = row.tax_rate / 100;
            params.project_id = formID;
            console.log('param',params);
            updateCapitalized(params).then( res =>{
                if(res && res.error){
                    console.log(res.error.message);
                }else{
                    const params = { q : 'year', projectID : formID };
                    this.getData(params);
                }
            })
            this.setState({ editingKey : ''});
            
        });
    }

    cancel = () => {
        this.setState({ editingKey : '' });
    }

    render(){

        const components = {
            body : {
                cell : EditableCell,
            },
        } 

        const { data , loading, editingKey } = this.state;

        const columns = [
            {
                title : "年份",
                dataIndex : 'year',
                key : 'year',
                width : 80,
                // fixed : 'left',
                align : 'center',
                render : (data) => {
                    if(data == -1){
                        return '总计';
                    }else{
                        return data;
                    }
                }
            },
            {
                title : '销售回款',
                dataIndex : 'sales_payback',
                key : 'sales_payback',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'sales_payback_1',
                        key : 'sales_payback_1',
                        width : 100,
                        align : 'center',
                    },
                    {
                        title : '二季度',
                        dataIndex : 'sales_payback_2',
                        key : 'sales_payback_2',
                        width : 100,
                        align : 'center',
                    },
                    {
                        title : '三季度',
                        dataIndex : 'sales_payback_3',
                        key : 'sales_payback_3',
                        width : 100,
                        align : 'center',
                    },
                    {
                        title : '四季度',
                        dataIndex : 'sales_payback_4',
                        key : 'sales_payback_4',
                        width : 100,
                        align : 'center',
                    },
                ]
            },
            {
                title : '成本支出',
                dataIndex : 'cost_expenditure',
                key : 'cost_expenditure',
                children : [
                   {
                        title : '一季度',
                        dataIndex : 'cost_expenditure_1',
                        key : 'cost_expenditure_1',
                        width : 100,
                        align : 'center',
                   },
                   {
                        title : '二季度',
                        dataIndex : 'cost_expenditure_2',
                        key : 'cost_expenditure_2',
                        width : 100,
                        align : 'center',
                   },
                   {
                        title : '三季度',
                        dataIndex : 'cost_expenditure_3',
                        key : 'cost_expenditure_3',
                        width : 100,
                        align : 'center',
                   },
                   {
                        title : '四季度',
                        dataIndex : 'cost_expenditure_4',
                        key : 'cost_expenditure_4',
                        width : 100,
                        align : 'center',
                   },
               ] 
            },
            {
                title : '预售保证金支出',
                dataIndex : 'margin_out',
                key : 'margin_out',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'margin_out_1',
                        key : 'margin_out_1',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '二季度',
                        dataIndex : 'margin_out_2',
                        key : 'margin_out_2',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '三季度',
                        dataIndex : 'margin_out_3',
                        key : 'margin_out_3',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '四季度',
                        dataIndex : 'margin_out_4',
                        key : 'margin_out_4',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                ] 
            },
            {
                title : '预售保证金返还',
                dataIndex : 'margin_back',
                key : 'margin_back',
                children : [
                    {
                        title : '一季度',
                        dataIndex : 'margin_back_1',
                        key : 'margin_back_1',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '二季度',
                        dataIndex : 'margin_back_2',
                        key : 'margin_back_2',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '三季度',
                        dataIndex : 'margin_back_3',
                        key : 'margin_back_3',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                    {
                        title : '四季度',
                        dataIndex : 'margin_back_4',
                        key : 'margin_back_4',
                        width : 100,
                        align : 'center',
                        editable : true,
                        type : 'number',
                    },
                ] 
            },
            {
                title : "税金比例",
                dataIndex : 'tax_rate',
                key : 'tax_rate',
                width : 100,
                editable : true,
                type : 'number',
                align : 'center',
                render : (data,record) => {
                    if(record.year != -1){
                        return (data * 100) + '%';
                    }
                }
            },
            {
                title : "税金",
                dataIndex : 'tax_payment',
                key : 'tax_payment',
                width : 100,
                align : 'center',
            },
            {
                title : "资本占用金额",
                dataIndex : 'funds_occupied_amount',
                key : 'funds_occupied_amount',
                width : 100,
                align : 'center',
            },
            {
                title : "资金年成本率",
                dataIndex : 'interest_rate',
                key : 'interest_rate',
                width : 100,
                editable : true,
                type : 'number',
                align : 'center',
                render : (data,record) => {
                    if(record.year != -1){
                        return (data * 100) + '%';
                    }
                    // return (data * 100) + '%';
                }
            },
            {
                title : "累计占用资金",
                dataIndex : 'accumulative_occupancy_funds',
                key : 'accumulative_occupancy_funds',
                width : 100,
                align : 'center',
            },
            {
                title : "资金占用费",
                dataIndex : 'fund_possession_cost',
                key : 'fund_possession_cost',
                width : 100,
                align : 'center',
            },
            {
                title : "操作",
                dataIndex : "operation",
                key : "operation",
                align : "center",
                width : 150,
                fixed : 'right',
                render : (text,record) => {
                    const editbale = this.isEditing(record);
                    if( record.year != -1){
                        return editbale ? (
                            <div>
                                <EditableContext.Consumer>
                                    {form => (
                                        <a onClick={()=> this.save(form, record)} style={{ marginRight : 8}}>保存</a>
                                    )}
                                </EditableContext.Consumer>
                                <Popconfirm title="确认要取消操作？" onConfirm={()=>this.cancel()}>
                                    <a>取消</a>
                                </Popconfirm>
                            </div>
                        )
                        : (<a disabled={ editingKey !== ''} onClick={ () => this.edit(record.record_id)}>编辑</a>)
                    }
                }
            }
        ]

        const eColumns = this.mapEditColumns(columns);
        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components = { components }
                    columns = { eColumns }
                    dataSource = { data }
                    scroll = {{ x : 15  , y : 800 }} 
                    bordered = { true }
                    pagination={false}
                    rowKey = {record => record.record_id}
                >

                </Table>
            </EditableContext.Provider>
        )
    }
}

export default CapitalizedInterest;

