import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
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
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
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
  // salesPlan: state.salesPlan,
  costAccount: state.costAccount,
  loading: state.loading.models.salesPlan,
}))
@Form.create()
class CostList extends PureComponent {
  state = {
    tableData: [
      {
        record_id: '001',
        name: '成本科目1',

        children: [
          {
            record_id: '001/001',
            name: '成本科目101',

            children: [
              {
                record_id: '001/001/001',
                name: '成本科目10101',
                unit01: 10,
                unit02: 11,
                unit03: 12,

                unit04: 13,

                rate: 0.09,
                total: 100.0,
              },
            ],
          },
          {
            record_id: '001/002',
            name: '成本科目102',
            unit01: 10,
            unit02: 11,
            unit03: 12,
            unit04: 13,
            rate: 0.09,
            total: 100.0,
          },
        ],
      },
    ],
    formatUnitPriceData: [
      {
        title: '业态1',
        dataIndex: 'unit01',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
      },
      {
        title: '业态2',
        dataIndex: 'unit02',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
      },
      {
        title: '业态3',
        dataIndex: 'unit03',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
      },
      {
        title: '业态4',
        dataIndex: 'unit04',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
      },
    ],
    formatTotalPriceData: [
      {
        title: '业态1',
        dataIndex: 'total01',
       
        align: 'center',
        width: 150,
      },
      {
        title: '业态2',
        dataIndex: 'total02',
        
        align: 'center',
        width: 150,   
      },
      {
        title: '业态3',
        dataIndex: 'total03',
        //key: 'companyAddress',
        align: 'center',
        width: 150,
        
      },
      {
        title: '业态4',
        dataIndex: 'total04',
        //key: 'companyAddress',
        align: 'center',
        width: 150,
       
      },
    ],
    editingKey: '',
  };

  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  isEditing = record => record.record_id === this.state.editingKey;

  save(form, key) {
    form.validateFields((error, row) => {
    
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
        for (let n = 0; n < i; n++) {
          keychild = keychild + keys[n] + '/';
        }
        keychild = keychild + keys[i];
        console.log('keychild ' + keychild);
        index_ = newData1.findIndex(item => keychild === item.record_id);
        console.log('keychild ' + keychild);
        console.log('index_ ' + index_);

        if (index_ > -1 && i === keys.length - 1 && key === keychild) {
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
          newData1[index_].children.length > 0 &&
          key != keychild
        ) {
          console.log('进入下一层');
          newData1 = newData1[index_].children;
          console.log('newData1 ' + newData1.length);
        }
      }

      // const index = newData.findIndex(item => key === item.record_id);
      // if (index > -1) {
      //   const item = newData[index];
      //   newData.splice(index, 1, {
      //     ...item,
      //     ...row,
      //   });
      //   this.setState({ data: newData, editingKey: '' });
      // } else {
      //   newData.push(row);
      //   this.setState({ data: newData, editingKey: '' });

      // }
    });
  }
  edit(key) {
    console.log(`key:${key}`);
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  mapEditColumns = columns => {
    const ecolumns = [];
    columns.forEach(item => {
      const eitem = { ...item };
      if (eitem.editable) {
        eitem.onCell = record => ({
          record,
          inputType: 'number',
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

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount: { formType },
    } = this.props;

    const { formatTotalPriceData, formatUnitPriceData, tableData, editingKey } = this.state;

    const components = {
      body: {
       // row: EditableFormRow,
        cell: EditableCell,
      },
    };

    // 可编辑权限看到的标题
    const columns = [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '单价',
        children: formatUnitPriceData,
        // editable: true,
      },

      {
        title: '总价',
        children: formatTotalPriceData,
      },
     
      {
        title: '汇总',
        dataIndex: 'total',
        width: 150,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        fixed: 'right'
      },
      {
        title: '税率',
        dataIndex: 'rate',
        width: 150,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        fixed: 'right'
      },
      {
        title: '税金',
        dataIndex: 'rate_mon',
        width: 80,
        align: 'center',
        render: (text, record) => {
          if (record.rate && record.total) {
            return <span>{record.rate * record.total}</span>;
          } else {
            return '';
          }
        },
      },
      {
        // 非项目行 该单元格可以为null
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        align: 'center',
        fixed:'right',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);

          return record.children === undefined ? (
            editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a onClick={() => this.save(form, record.record_id)} style={{ marginRight: 8 }}>
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

    // 只有查看权限的人看到的标题
    const view_columns = [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '单价',
        // width: 600,
        children: formatUnitPriceData,
      },
      {
        title: '总价',
        children: formatTotalPriceData,
      },
     
      {
        title: '汇总',
        dataIndex: 'total',
        width: 80,
        //  ellipsis: true,
        align: 'center',
      },
      {
        title: '税率',
        dataIndex: 'rate',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        editable: true,
      },
      {
        title: '税率',
        dataIndex: 'rate_mon',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        render: (text, record) => {
          if (record.rate && record.total) {
            return <span>{record.rate * record.total}</span>;
          } else {
            return '';
          }
        },
      },
    ];

    const ecolumns = this.mapEditColumns(columns);
    console.log(ecolumns);

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

export default CostList;
