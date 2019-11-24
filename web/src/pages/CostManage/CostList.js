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
  projectManage: state.projectManage,
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
        cost_id: "001", // 成本项ID
        cost_parent_id: "", //成本项父级ID
        cost_parent_path: "",//成本项父级路经 具体到父级ID

        calculate_type: 0,// 计算方式 1
        label: 1,//标签(1:成本科目 2:测算科目)科目类别
        price: 0, // 成本项价格
        project_id: "abc",// 成本项所属项目的ID
        tax_price: 0, // 缴税税额
        tax_rate: 0,//税率


        children: [
          {
            record_id: '001-001',
            name: '成本科目101',
            cost_id: "001-001", // 成本项ID
            cost_parent_id: "001", //成本项父级ID
            cost_parent_path: "001",//成本项父级路经 具体到父级ID

            calculate_type: 0,// 计算方式 1
            label: 1,//标签(1:成本科目 2:测算科目)科目类别
            price: 0, // 成本项价格
            project_id: "abc",// 成本项所属项目的ID
            tax_price: 0, // 缴税税额
            tax_rate: 0,//税率
            children: [
              {
                record_id: '001-001-001',
                name: '成本科目10101',
                cost_id: "001-001-001", // 成本项ID
                cost_parent_id: "001-001", //成本项父级ID
                cost_parent_path: "001/001-001",//成本项父级路经 具体到父级ID

                calculate_type: 0,// 计算方式 1
                label: 1,//标签(1:成本科目 2:测算科目)科目类别
                price: 0, // 成本项价格
                project_id: "abc",// 成本项所属项目的ID
                tax_price: 0, // 缴税税额
                tax_rate: 0,//税率
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
            record_id: '001-002',
            name: '成本科目102',
            cost_id: "001-002", // 成本项ID
            cost_parent_id: "001", //成本项父级ID
            cost_parent_path: "001",//成本项父级路经 具体到父级ID

            calculate_type: 0,// 计算方式 1
            label: 2,//标签(1:成本科目 2:测算科目)科目类别
            price: 0, // 成本项价格
            project_id: "abc",// 成本项所属项目的ID
            tax_price: 0, // 缴税税额
            tax_rate: 0,//税率
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

  
   
  
 
    editingKey: '',
  };




  componentDidMount = async () => {
    const {

     costAccount:{formID, formType},
      projectManage:{businessFormat},
 
    } = this.props;

  
    
    this.dispatch({
      type: 'costList/fetch',
      payload: {
        project_id: formID,
      },
    });

    console.log(" costList页面 接受的pro_id " + formID);
    console.log(" costList页面 接受的operType " + formType);
    
  }

  renderFuc= (text, record) => {

    if (record.label === 1) {
      return <span style={{ color: "red" }}>{text}</span>;
    } else {
      return <span >{text}</span>;
    }
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  isEditing = record => record.record_id === this.state.editingKey;

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

      

      if (keys.length == 1) {
        console.log('keys  1');
        let index = newData1.findIndex(item => key === item.cost_id);
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
        index_ = newData1.findIndex(item => keychild === item.cost_id);
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
          inputType: "number",//eitem.dataIndex === 'rate'? 'select':'number',
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
      form: { getFieldDecorator  },
      costAccount: { formType },
    } = this.props;

    const {   tableData, editingKey } = this.state;

    const components = {
      body: {
        // row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const formatTotalPriceData = [
      {
        title: '业态1',
        dataIndex: 'total01',

        align: 'center',
        width: 150,
        render: this.renderFuc,
      },
      {
        title: '业态2',
        dataIndex: 'total02',

        align: 'center',
        width: 150,
        render:this.renderFuc
      },
      {
        title: '业态3',
        dataIndex: 'total03',
        //key: 'companyAddress',
        align: 'center',
        width: 150,
        render: this.renderFuc

      },
      {
        title: '业态4',
        dataIndex: 'total04',
        //key: 'companyAddress',
        align: 'center',
        width: 150,
        render: this.renderFuc

      },
    ];

    const formatUnitPriceData=
    
    [
      {
        title: '业态1',
        dataIndex: 'unit01',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
        render: this.renderFuc,
      },
      {
        title: '业态2',
        dataIndex: 'unit02',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
        render: this.renderFuc
      },
      {
        title: '业态3',
        dataIndex: 'unit03',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
        render: this.renderFuc
      },
      {
        title: '业态4',
        dataIndex: 'unit04',
        //key: 'companyAddress',
        align: 'center',
        editable: true,
        width: 150,
        render: this.renderFuc
      },
    ];

    // 可编辑权限看到的标题
    const columns = [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        align: 'center',
        fixed: 'left',
        render: (text, record) => {

          if (record.label === 1) {
            return <span style={{ color: "red" }}>{text}</span>;
          } else {
            return <span >{text}</span>;
          }
        }
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
        fixed: 'right',
        render: (text, record) => {

          if (record.label === 1) {
            return <span style={{ color: "red" }}>{text}</span>;
          } else {
            return <span >{text}</span>;
          }
        }
      },
      {
        title: '税率',
        dataIndex: 'rate',
        width: 150,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        fixed: 'right',
        render: (text, record) => {

          if (record.label === 1) {
            return <span style={{ color: "red" }}>{text}</span>;
          } else {
            return <span >{text}</span>;
          }
        }

      },
      {
        title: '税金',
        dataIndex: 'rate_mon',
        width: 80,
        align: 'center',
        render: (text, record) => {
          if (record.rate && record.total) {
            if (record.label === 1) {
              return <span style={{ color: "red" }}>{record.rate * record.total}</span>;
            }
            else {
              return <span >{record.rate * record.total}</span>;
            }

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
        fixed: 'right',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);

          return record.children === undefined ? (
            editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a onClick={() => this.save(form, record.cost_parent_path !== "" ?  (record.cost_parent_path+ "/" + record.cost_id):( record.cost_id))} style={{ marginRight: 8 }}>
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
