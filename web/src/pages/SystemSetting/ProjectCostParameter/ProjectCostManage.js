import React, { PureComponent } from 'react';
import { Card, Table, Input, InputNumber, Form, Popconfirm, Select, Dropdown, Menu } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';

import styles from './ProjectCostManage.less';


const EditableContext = React.createContext();

@Form.create()
class EditableCell extends React.Component {  //根据editing 改变该行的某列是否是可编辑的
    getInput = () => {  //编辑框
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        if (this.props.inputType === "select") {
            if (this.props.dataIndex == "type") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">科目类别1</Select.Option>
                    <Select.Option value="2">科目类别2</Select.Option>
                </Select>;
            }
            if (this.props.dataIndex == "is_reckon_in") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="2">否</Select.Option>
                </Select>;
            }
        }

        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const { editing, dataIndex,
            title, inputType, record, index, children, required, ...restProps } = this.props;

        console.log("record",record,"editing",editing,"dataIndex",dataIndex);

        return (
            <td {...restProps}>
                {
                    editing ? (
                        <Form.Item style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [
                                    {
                                        required: required,
                                        message: "请输入",
                                    },
                                ],
                                initialValue: record[dataIndex].toString(),
                            })(this.getInput())}
                        </Form.Item>
                    ) : (
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

@Form.create()
class ProjectCostManage extends PureComponent {

    constructor(props) {
        super(props);
        // const { callback } = this.props;
        // callback(this.formSubmit);
        this.columns = [
            {
                title: "科目名称",
                dataIndex: "name",
                key: "name",
                width: 100,
                editable: true,
                // align : "center",
                required: true,
                type: "text",
            },
            {
                title: "科目类别",
                dataIndex: "type",
                key: "type",
                width: 100,
                editable: true,
                align: "center",
                required: true,
                type: "select",
                render: data => {
                    return data == 1 ? "科目类别1" : "科目类别2"
                }
            },
            {
                title: "是否计入土地增值税扣除项",
                dataIndex: "is_reckon_in",
                key: "is_reckon_in",
                width: 200,
                editable: true,
                align: 'center',
                required: true,
                type: "select",
                render: data => {
                    return data == 1 ? "是" : "否";
                }
            },
            {
                title: '单价',
                dataIndex: 'unit_price',
                key: "unit_price",
                align: "center",
                editable: true,
                children: [
                    {
                        title: '住宅',
                        dataIndex: "zhuzhai",
                        key: "zhuzhai",
                        width: 80,
                        align: "center",
                        editable: true,
                        required: true,
                        type: "text",
                    },
                    {
                        title: '车位',
                        dataIndex: "chewei",
                        key: 'chewei',
                        width: 80,
                        align: "center",
                        editable: true,
                        required: true,
                        type: "text",
                    }
                ]
            },
            {
                title: "税种",
                dataIndex: "tax",
                key: "tax",
                width: 80,
                align: "center",
                editable: true,
                required: true,
                type: "text",
            },
            {
                title: "备注",
                dataIndex: "memo",
                key: "memo",
                width: 80,
                align: "center",
                editable: true,
                required: false,
                type: "text",
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 145,
                align: "center",
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);  // 判断该行是否是要编辑的那一行
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        onClick={() => this.save(form, record.record_id)}
                                        style={{ marginRight: 8 }}
                                    >
                                        保存
                            </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="确定要删除?" onConfirm={() => this.cancel()}>
                                <a>取消</a>
                            </Popconfirm>
                        </span>
                    ) :
                        (
                            <div>
                                {/* 没有点击编辑的状态 */}
                                <PButton disabled={editingKey !== ''} key="add" code="add" style={{ marginLeft: 8 }}>
                                    <Dropdown overlay={() => this.getMenu(record)} placement="bottomCenter">
                                        <a>新建</a>
                                    </Dropdown>
                                    {/* 新建 */}
                                </PButton>
                                <PButton disabled={editingKey !== ''} key="edit" code="edit" style={{ marginLeft: 8 }}
                                    onClick={() => this.edit(record.record_id)}
                                >
                                    编辑
                                </PButton>

                                <PButton disabled={editingKey !== ''} key="del" code="del" style={{ marginLeft: 8 }}>
                                    删除
                                </PButton>
                            </div>

                        );
                },
            }
        ];
        this.state = {
            formatList: [],
            dataList: [
                {
                    record_id: "1",
                    name: "项目成本",
                    type: 1,
                    is_reckon_in: 1,
                    zhuzhai: "zhuzhai",
                    chewei: "chewei",
                    tax: "tax",
                    memo: '',
                    children: [
                        {
                            record_id: "1-1",
                            name: "开发成本",
                            type: 2,
                            is_reckon_in: 1,
                            zhuzhai: "zhuzhai",
                            chewei: "chewei",
                            tax: "tax",
                            memo: '',
                            children: [
                                {
                                    record_id: "1-1-1",
                                    name: "土地征用及拆迁补偿费",
                                    type: 1,
                                    is_reckon_in: 1,
                                    zhuzhai: "zhuzhai",
                                    chewei: "chewei",
                                    tax: "tax",
                                    memo: '',
                                    children: [
                                        {
                                            record_id: "1-1-1-1",
                                            name: "土地出让金",
                                            type: 2,
                                            is_reckon_in: 1,
                                            zhuzhai: "zhuzhai",
                                            chewei: "chewei",
                                            tax: "tax",
                                            memo: '',
                                        },
                                        {
                                            record_id: "1-1-1-2",
                                            name: "契税",
                                            type: 1,
                                            is_reckon_in: 1,
                                            zhuzhai: "zhuzhai",
                                            chewei: "chewei",
                                            tax: "tax",
                                            memo: '',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            record_id: "1-2",
                            name: "期间费用",
                            type: 2,
                            is_reckon_in: 1,
                            zhuzhai: "zhuzhai",
                            chewei: "chewei",
                            tax: "tax",
                            memo: '',
                        },
                    ],
                }
            ],
            expandHang: [],
            expandedRowKeys: [],
            editingKey: '',   //编辑行的record_id
        };
    }

    handleOnExpand = (expanded, record) => {
        // console.log("expanded, record", expanded, record);
        const { expandHang } = this.state;
        if (expanded) {
            expandHang.push(record.record_id);
            expandHang.sort();
        } else {
            for (let i = 0; i < expandHang.length; i++) {
                if (expandHang[i] === record.record_id) {
                    if (i > 0) {
                        expandHang.splice(i, 1);
                    } else {
                        expandHang.splice(0, 1);
                    }
                }
                if (record.children) {
                    for (let y = 0; y < record.children.length; y++) {
                        if (expandHang[i] === record.children[y].record_id) {
                            delete expandHang[i];
                        }
                    }
                }
            }
        }

        this.setState({ expandedRowKeys: [...expandHang] });
    }

    getMenu = (record) => {
        // console.log("getMenu "+ JSON.stringify(record));
        return (
        <Menu >
          <Menu.Item> {/*  onClick={() => this.brotherLevelAdd(record)} */}
            同级添加
          </Menu.Item>
        
          <Menu.Item>{/* onClick={() => this.childLevelAdd(record)} */}
            下级添加
          </Menu.Item>
        </Menu>);
      };

    save = (form, rid) => {
        form.validateFields((err, row) => {
            if (err) {
                return;
            }

            console.log("save", row); //得到数据
            console.log(rid);
            // const newData = [...this.state.dataList];
            // const index = newData.findIndex(item => rid === item.record_id);
            // if(index >-1){
            //     const item = newData[index];
            //     newData.splice(index, 1, {...item,...row})
            // }
            // this.se
            this.setState({ editingKey: "" });
        });
    }
    cancel = () => {
        // console.log("删除",rid);
        this.setState({ editingKey: "" });
    }

    edit = (rid) => {
        this.setState({ editingKey: rid });
    }

    // isEditing = record => record.record_id === this.state.editingKey;

    isEditing = record => {
        return record.record_id === this.state.editingKey;
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        }

        const breadcrumbList = [
            { title: "基础设定" },
            { title: "系统设定" },
            { title: "项目成本管理" }
        ];

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            };
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.type, // col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                    required: col.required,
                    // handleSave: this.handleSave,
                }),
            };
        });


        const { dataList, expandedRowKeys } = this.state;

        // console.log("expandedRowkeys",expandedRowKeys);

        return (
            <PageHeaderLayout title="项目成本管理" breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderSearchForm()}</div>*/}
                        {/* <div className={styles.tableListOperator}></div>  */}
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                components={components}
                                expandedRowKeys={expandedRowKeys}
                                columns={columns}
                                // loading = { true }
                                dataSource={dataList}
                                rowKey={record => record.record_id}
                                pagination={false}
                                onExpand={this.handleOnExpand}
                                scroll={{ x: 1500, y: 800 }}
                                rowClassName="editable-row"
                            >

                            </Table>
                        </EditableContext.Provider>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}

// const ProjectCostManage = Form.create()(EditableTable);

export default ProjectCostManage;