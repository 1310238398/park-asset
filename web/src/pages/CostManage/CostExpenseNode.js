import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Table,
    Card,
    InputNumber,
    Popconfirm,
    Select,
    DatePicker,
    TreeSelect
} from 'antd';

//import EditableCell from '@/components/EditableCell/EditableCell';
import styles from './CostAccount.less';
import moment from 'moment';

const EditableContext = React.createContext();

@connect(state => ({  
    costExpenseNode: state.costExpenseNode,
}))
class EditableCell extends React.Component {

    state = {

        // toposNode: [
        //     "完成时间",
        //     "完成时间前30天",
        //     "平摊之每个月"
        // ]
    }
    renderToposNode = (data) => {
        let ret = [];
        ret = data.map(obj => {
            return (<Select.Option key={obj} value={obj}>{obj}</Select.Option>)
        })
        return ret;
    }
    getInput = () => {
        let handleChange = (value) => {
            console.log(value);
        }
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        else if (this.props.inputType === 'select') {
            const { costExpenseNode: {selectListNode} } = this.props
            return (
                <div>
                    <Select
                        //mode="multiple"
                        style={{ width: 120 }}

                        onBlur={handleChange}
                    // onChange={handleChange}
                    >
                        {this.renderToposNode(selectListNode)}
                    </Select>
                </div>
            )
        }
        else if (this.props.inputType === 'time') {
            // 时间组件
           return (
            <DatePicker 
            //showTime
            //defaultValue={}
           // style={{width:"100%"}}
            placeholder="请选择开始时间"
            format="YYYY-MM-DD"
           // locale={locale}
            />
           )
        }
        else if (this.props.inputType === 'multiply') {
            return (<TreeSelect></TreeSelect>)
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            // form: { getFieldDecorator, getFieldValue },
            children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`,
                                },
                            ],
                            initialValue:inputType === "time" ? moment(record[dataIndex]): record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

@connect(state => ({
    costAccount: state.costAccount,
    costExpenseNode: state.costExpenseNode,
    loading: state.loading.models.costExpenseNode,
}))
@Form.create()
class CostExpenseNode extends PureComponent {
    state = {


        tableData: [
            {
                acc_expend_rate: 0.5, // 支出比例
                end_time: "2020-11-24",
                expenditure_time_type: 1,//资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)

                is_acc_expend: 1,//	integer($int32)
                name: "节点1", //项目支出节点名称

                parent_id: "",//父级ID

                parent_path: "",//父级路经

                proj_cost_items: [],
                project_id: "",//成本项目ID

                record_id: "001",//记录ID

                start_time: "2019-11-24",//开始时间

                total_cost: 0,//支出总额
            }

        ],
        editingKey: '',


    };

    componentDidMount() {
        // this.dispatch({
        //   type: 'costExpenseNode/fetch',
        // });
        // 请求列表 请求单选 多选的列表

        
    }
    mapEditColumns = columns => {
        const ecolumns = [];
        columns.forEach(item => {
            const eitem = { ...item };
            if (eitem.editable) {
                eitem.onCell = record => ({
                    record,
                    inputType: eitem.inputType,//eitem.dataIndex === 'rate'? 'select':'number',
                    dataIndex: item.dataIndex,
                    title: item.title,
                    editing: this.isEditing(record),
                });
            }

            if (eitem.children) {
                eitem.children = this.mapEditColumns(eitem.children);
            }
            ecolumns.push(eitem);
        });
        return ecolumns;
    };
    isEditing = record => record.record_id === this.state.editingKey;
    edit(key) {
        console.log(`key:${key}`);
        this.setState({ editingKey: key });
    }

    cancel = () => {
        this.setState({ editingKey: '' });
    };
    save(form, key) {
        // key包含cost_id的路径
        form.validateFields((error, row) => {

            console.log("row ");
            console.log(row);
            if (error) {
                return;
            }
            const newData = [...this.state.tableData];

            let keys = [];
            keys = key.split('/');
            console.log(keys);


            let index_ = -1;

            let newData1 = [...newData];

            console.log('keys ' + keys);

            if (keys.length == 1) {
                console.log('keys  1');
                let index = newData1.findIndex(item => key === item.record_id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    this.setState({ tableData: newData, editingKey: '' });
                } else {
                    newData.push(row);
                    this.setState({ tableData: newData, editingKey: '' });
                }

                return;
            }

            for (let i = 0; i < keys.length; i++) {
                let keychild = '';
                // for (let n = 0; n < i; n++) {
                //   keychild = keychild + keys[n] + '/';
                // }
                keychild = keys[i];
                console.log('keychild ' + keychild);
                index_ = newData1.findIndex(item => keychild === item.record_id);
                console.log('keychild ' + keychild);
                console.log('index_ ' + index_);

                if (index_ > -1 && i === keys.length - 1) {
                    console.log('更新数据');
                    const item = newData1[index_];
                    console.log('被更新的数据 ' + JSON.stringify(item));
                    console.log('row 要更新的数据 ' + JSON.stringify(row));
                    newData1.splice(index_, 1, {
                        ...item,
                        ...row,
                    });
                    // 一级一级更新数据
                    this.setState({ editingKey: '' });
                    console.log('查看数据有没有变化 ' + JSON.stringify(this.state.tableData));
                }

                if (
                    index_ > -1 &&
                    newData1[index_].children &&
                    newData1[index_].children.length > 0 && i < (keys.length - 1)

                ) {
                    console.log('进入下一层');
                    newData1 = newData1[index_].children;
                    console.log('newData1 ' + newData1.length);
                }
            }


        });
    }

    render() {

        const {
            loading,
            form: { getFieldDecorator },
            costAccount: { formType },
        } = this.props;

        console.log("formType "+ formType);

        const components = {
            body: {
                // row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const { tableData } = this.state;
        // 只有查看权限的人看到的标题
        const view_columns = [
            {
                title: '节点名称',
                dataIndex: 'name',
                width: 200,
                ellipsis: true,
                align: 'center',
                fixed: 'left',
            },
            {
                title: '节点类别',
                dataIndex: 'type',
                width: 100,
                align: 'center',


            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: 150,
                align: 'center',

            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: 150,
                align: 'center',

            },

            {
                title: '成本科目',
                dataIndex: 'proj_cost_items',
                width: 200,

                align: 'center',
            },
            {
                title: '资金支出时间',
                dataIndex: 'expenditure_time_type',
                width: 150,

                align: 'center',
                editable: true,
            },
            {
                title: '资金支出比例',
                dataIndex: 'acc_expend_rate',
                width: 150,
                //  ellipsis: true,
                align: 'center',

            },
        ];

        const columns = [
            {
                title: '节点名称',
                dataIndex: 'name',
                width: 200,
                ellipsis: true,
                align: 'center',
                fixed: 'left',
            },
            {
                title: '节点类别',
                dataIndex: 'type',
                width: 100,
                align: 'center',


            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: 150,
                align: 'center',
                editable: true,
                inputType: "time"

            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: 150,
                align: 'center',
                editable: true,
                inputType: "time"

            },

            {
                title: '成本科目',
                dataIndex: 'proj_cost_items',
                width: 200,

                align: 'center',
                editable: true,
                inputType:"multiply"
            },
            {
                title: '资金支出时间',
                dataIndex: 'expenditure_time_type',
                width: 150,

                align: 'center',
                editable: true,
                inputType: "select"
            },
            {
                title: '资金支出比例',
                dataIndex: 'acc_expend_rate',
                width: 150,
                //  ellipsis: true,
                align: 'center',
                editable: true,
                inputType: "number"

            },
            {
                // 非项目行 该单元格可以为null
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 150,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);

                    return record.children === undefined ? (
                        editable ? (
                            <span>
                                <EditableContext.Consumer>
                                    {form => (
                                        <a onClick={() => this.save(form, record.parent_path !== "" ? (record.parent_path + "/" + record.record_id) : (record.record_id))} style={{ marginRight: 8 }}>
                                            保存
                        </a>
                                    )}
                                </EditableContext.Consumer>
                                <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.record_id)}>
                                    <a>取消</a>
                                </Popconfirm>
                            </span>
                        ) : (
                                <div>
                                    <a disabled={editingKey !== ''} onClick={() => this.edit(record.record_id)}>
                                        编辑
                    </a>
                                </div>
                            )
                    ) : null;
                },
            },
        ];
        const ecolumns = this.mapEditColumns(columns);

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components={components}
                    bordered
                    loading={loading}
                    rowKey={record => record.record_id}
                    dataSource={tableData}
                    columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
                    pagination={false}
                    scroll={{ y: 500, x: 'calc(700px + 50%)' }}
                    rowClassName="editable-row"
                    rowClassName={() => 'editable-row'}
                    style={{ maxHeight: 500 }}
                />
            </EditableContext.Provider>
        );
    }

}
export default CostExpenseNode;