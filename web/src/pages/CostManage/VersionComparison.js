import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Row, Col,
    Input,
    Modal,
    Dropdown,
    Popconfirm,
    Select,
    Radio,
    Table,
    message,
    Divider,
    Button,
    InputNumber,
} from 'antd';
import styles from './CostAccount.less';
import { } from '@/services/costAccount';
const FormItem = Form.Item;
const EditableContext = React.createContext();
class EditableCell extends React.Component {

    state = {
        toposNode: [
            "税种1",
            "税种2",
            "税种3"
        ]
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
            const { toposNode } = this.state;
            return (
                <div>
                    <Select
                        //mode="multiple"
                        style={{ width: 120 }}

                        onBlur={handleChange}
                    // onChange={handleChange}
                    >
                        {this.renderToposNode(toposNode)}
                    </Select>
                </div>
            )
        }
        else if (this.props.inputType === 'text') {
            return <Input />;
        }

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
            // style={{ paddingLeft: 5, paddingRight: 5 }}
            <td {...restProps} >
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
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
    // projectManage: state.projectManage,
    costAccount: state.costAccount,

    loading: state.loading.models.currentVersion,
}))
@Form.create()
class VersionComparison extends PureComponent {
    state = {

        columns: [

            {
                title: '科目名称',
                dataIndex: 'name',
                width: 150,
                // ellipsis: true,
                // align: 'center',
                // fixed: 'left',

            },
            {
                title: '起始版本',
                dataIndex: 'start',
                width: 100,

                align: 'center',

            },
            {
                title: '中间版本',


                children: [
                    {
                        title: '中间版本1',
                        dataIndex: 'middle01',
                        width: 100,

                        align: 'center',

                    },
                    {
                        title: '中间版本2',
                        dataIndex: 'middle02',
                        width: 100,

                        align: 'center',

                    },
                    {
                        title: '中间版本3',
                        dataIndex: 'middle03',
                        width: 100,

                        align: 'center',

                    },
                ]

            },
            {
                title: '最终版本',
                dataIndex: 'end',
                width: 100,

                align: 'center',

            },
            {
                title: '备注',
                dataIndex: 'memo',
                width: 150,
                editable: true,
                inputType: "text",

                align: 'center',

            },
            // {
            //     title: '操作',
            //     dataIndex: 'operation',
            //     key: 'operation',
            //     width: 100,
            //     align: 'center',
            //     // fixed: 'right',
            //     render: (text, record) => {
            //         const { editingKey } = this.state;
            //         const editable = this.isEditing(record);
            //         return editable ? (
            //             <div style={{ textAlign: "center" }}>
            //                 <EditableContext.Consumer>
            //                     {form => (
            //                         <a onClick={() => this.save(form, record.parent_path !== "" ? (record.parent_path + "/" + record.record_id) : (record.record_id))} style={{ marginRight: 8 }}>
            //                             保存
            //                             </a>
            //                     )}
            //                 </EditableContext.Consumer>
            //                 <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel()}>
            //                     <a>取消</a>
            //                 </Popconfirm>
            //             </div>
            //         ) : (
            //                 <div style={{ textAlign: "center" }}>
            //                     <a disabled={editingKey !== ''} onClick={() => this.edit(record.cost_id)}>
            //                         编辑
            //                     </a>

            //                 </div>
            //             );
            //     }

            // }
        ],
        tableData: [
            {
                record_id: '001',
                name: '成本科目1',
                cost_id: "001", // 成本项ID
                cost_parent_id: "", //成本项父级ID
                cost_parent_path: "",//成本项父级路经 具体到父级ID

                value: 111,


                children: [
                    {
                        record_id: '001-001',
                        name: '成本科目101',
                        cost_id: "001-001", // 成本项ID
                        cost_parent_id: "001", //成本项父级ID
                        cost_parent_path: "001",//成本项父级路经 具体到父级ID

                        value: 23232,
                        children: [
                            {
                                record_id: '001-001-001',
                                name: '成本科目10101',
                                cost_id: "001-001-001", // 成本项ID
                                cost_parent_id: "001-001", //成本项父级ID
                                cost_parent_path: "001/001-001",//成本项父级路经 具体到父级ID
                                value: 54645,
                            },
                        ],
                    },
                    {
                        record_id: '001-002',
                        name: '成本科目102',
                        cost_id: "001-002", // 成本项ID
                        cost_parent_id: "001", //成本项父级ID
                        cost_parent_path: "001",//成本项父级路经 具体到父级ID

                        value: 888
                    },
                ],
            },
        ],
        versionList:[
            "版本1",
            "版本2",
            "版本3",
            "版本4",
            "版本5"
        ],
        editingKey: '',
    };

    componentDidMount = async () => {

        const { costAccount: { formID } } = this.props;

        this.dispatch({
            type: 'currentVersion/fetch',
            payload: formID,
        });
    }


    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    isEditing = record => record.cost_id === this.state.editingKey;
    mapEditColumns = columns => {
        const ecolumns = [];
        columns.forEach(item => {
            const eitem = { ...item };
            if (eitem.editable) {
                eitem.onCell = record => ({
                    record,
                    inputType: eitem.inputType,
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

    cancel = () => {


        this.setState({ editingKey: '' });

    };
    edit(key) {
        console.log(`key:${key}`);
        this.setState({ editingKey: key });
    }

    save(form, key) {
        form.validateFields((error, row) => {

            console.log("row ");
            console.log(row);
            if (error) {
                return;
            }

            this.setState({ editingKey: '' });

        }

        );
    }

  // 按照条件查询项目
  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };
      console.log("formData ");
      console.log(formData);
     
    //   this.dispatch({
    //     type: 'projectManage/fetch',
    //     search: formData,
    //     pagination: {},
    //   });
     // this.clearSelectRows();
    });
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    // this.dispatch({
    //   type: 'projectManage/fetch',
    //   search: {},
    //   pagination: {},
    // });
  };
    renderSearchForm() {
        const {
            form: { getFieldDecorator },
            costAccount: { companyList, poltList },
          } = this.props;
          const { versionList } = this.state;
        return (
            <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
                <Row gutter={16}>
                    <Col md={6} sm={24}>
                        <Form.Item label="起始版本">
                            {getFieldDecorator('start_version')(

                                <Select placeholder="请选择起始版本" style={{ width: '100%' }}>
                                    {versionList &&
                                        versionList.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                    <Form.Item label="中间版本">
                            {getFieldDecorator('middle_version')(

                                <Select placeholder="请选择中间版本" style={{ width: '100%' }} mode="multiple">
                                    {versionList &&
                                        versionList.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                </Select>
                            )}
                        </Form.Item>
                    
                    </Col>
                    <Col md={6} sm={24}>
                    <Form.Item label="最终版本">
                            {getFieldDecorator('end_version')(

                                <Select placeholder="请选择最终版本" style={{ width: '100%' }}>
                                    {versionList &&
                                        versionList.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col md={6} sm={24}>
                    <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
                    </Col>


                </Row>
            </Form>
        );

    }

    render() {
        const {
            loading,
            form: { getFieldDecorator },
            costAccount: { formType },

        } = this.props;
        const { tableData, columns } = this.state;

        const components = {
            body: {
                // row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const ecolumns = this.mapEditColumns(columns);
        return (
            <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        components={components}
                        bordered
                        loading={loading}
                        rowKey={record => record.cost_id}
                        dataSource={tableData}
                        columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
                        pagination={false}
                        scroll={{ y: 800, x: 'calc(100%)' }}
                        rowClassName="editable-row"
                    >

                    </Table>
                </EditableContext.Provider>
            </div>

        );
    }

}
export default VersionComparison;