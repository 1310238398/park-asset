import React,{ PureComponent } from  'react';
import {Table, Form, InputNumber, Input, Popconfirm } from 'antd';
import { connect } from 'dva';

import { queryLandValue, updateLandValue } from '@/services/costAccount';

const EditableContext = React.createContext();

@Form.create()
class EditableCell extends React.Component{
    getInput = () => {
        if(this.props.inputType === 'number'){
            if(this.props.title == "计算比例"){
                return <InputNumber min={0} max={100} formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}/>;
            }
            return <InputNumber />
        }
        return <Input/>;
    };

    renderCell = ({ getFieldDecorator }) => {
        const { editing, dataIndex, title, inputType, record, index, children,
            ...restProps  
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
                                initialValue :  inputType =='number' ? record[dataIndex] ? record[dataIndex]*100 : 0  :  record[dataIndex] ? record[dataIndex].toString() : "" ,
                            })(this.getInput())}
                        </Form.Item>
                    )
                    : (
                        children
                    )
                }
            </td>
        )
    };
    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    }
}

@connect(state=>({
    costAccount: state.costAccount,
}))
@Form.create()
class LandValueAddedTax extends PureComponent{  //土增

    state = {
        data : [],
        projectID : "6dc94eb7-4675-44f2-9323-312ff9659854",  
        loading : true,
        editingKey : "",
        metadata : {},
    }

    componentWillMount(){
        const {
            costAccount: { formID },
        } = this.props;
        this.setState({ projectID : formID });
        this.getData();
    }

    getData = () =>{
        const { projectID } = this.state;

        const params = { projectID : projectID };
        queryLandValue(params).then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                const list = this.transformData(res);
                this.setState({ data : [...list], metadata : {...res}});
            }
        });
    }

    transformData = (res) =>{
        const data = {...res};
        let list = [];
        list[0] = { key : "income", name : "不含税销售收入",money : data.income };
        list[1] = { key : "cost", name : "扣除项目金额",money : data.cost };
        list[2] = { key : "additional_tax", name : "附加税", money : data.additional_tax };
        list[3] = { key : "finance_add_rate",name : "财务费用", scal : data.finance_add_rate, money : data.cost * data.finance_add_rate }; // 财务
        list[4] = { key : "manage_add_rate", name : "管理和销售费用", scal : data.manage_add_rate, money : data.cost * data.manage_add_rate };
        list[5] = { key : "cost_add_rate" , name : "加计费用", scal : data.cost_add_rate, money : data.cost * data.cost_add_rate };
        list[6] = { key : "tax", name : "土地增值税", money : data.tax };
        return list;
    }

    mapEditColumns = columns => {
        const ecolumns = [];
        columns.forEach(item =>{
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
            ecolumns.push(eitem);
        });
        return ecolumns;
    }

    isEditing = record => record.key === this.state.editingKey;

    save = (form,record) => {
        const { metadata } = this.state;
        form.validateFields((err,row) => {
            if(err){
                return;
            }
            this.setState({ loading : true });
            metadata[record.key] = row.scal / 100 ;
            updateLandValue(metadata).then(res=>{
                this.setState({ loading : false });
                if(res && res.error){
                    console.log(res.error.message);
                }else{
                    this.getData();
                }
            })

            this.setState({ editingKey : ''});
        });
    }

    cancel = () => {
        this.setState({ editingKey : ''});
    }

    edit = (rid) => {
        this.setState({ editingKey: rid });
    }

    render(){
        const { data, loading, editingKey } = this.state;
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        const columns = [
            {
                title : "计算项",
                dataIndex : "name",
                key : "name",
                align : "center",
                width: 150,
            },
            {
                title : "计算比例",
                dataIndex : "scal",
                key : "scal",
                align : "center",
                width : 100,
                editable: true,  
                type : 'number',
                render : data => {
                    if(data){
                        return (data * 100)+'%';
                    }
                }
            },
            {
                title : "金额",
                dataIndex : "money",
                key : "money",
                align : "center",
                width : 80,
                render : data => {
                    return data+"元";
                }
            },
            {
                title : "操作",
                dataIndex : "operation",
                key : "operation",
                align : "center",
                width : 100,
                render : (text,record) =>{
                    if(record.scal){
                        const editable = this.isEditing(record);
                        return editable ? (
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
                        :(
                            // <div style={{ textAlign: "center" }} onClick={()=> this.edit(record.key)}>
                            //     <a>
                            //         编辑
                            //     </a>
                            // </div>
                             <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                                编辑
                            </a>
                        )
                    }
                }
            }
        ];

        const eColumns = this.mapEditColumns(columns);
        return(
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components = { components }
                    dataSource = {data}
                    columns = { eColumns }
                    loading = { loading }
                    rowKey={record => record.key}
                    pagination={false}
                >

                </Table>
            </EditableContext.Provider>
        )
    }
}

export default LandValueAddedTax;