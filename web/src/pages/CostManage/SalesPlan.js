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

@Form.create()
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
  salesPlan: state.salesPlan,
  costAccount: state.costAccount,
  loading: state.loading.models.salesPlan,
}))
// 销售计划页面
@Form.create()
class SalesPlan extends PureComponent {
  state = {
    data: [
      {
        key: '1',
        name: '住宅地上10层',
        area: 100.0,
        unit_price: 1,
        total_contract_price: 0,
        repayment_amount: 0,
      },
//       average_prise	number($double)
// 均价

// contract_amount	number($double)
// 合同额度

// memo	string
// 备注

// payback	number($double)
// 销售回款

// principal	string
// 负责人

// proj_business_id	string
// 项目业态ID

// proj_business_name	string
// 项目业态名称

// proj_income_id	string
// 项目收益测算ID

// project_id	string
// 成本项目ID

// quarter	integer($int32)
// 季度

// record_id	string
// 记录ID

// sale_area	number($double)
// 销售面积

// tax_prise	number($double)
// 销售税额

// year	integer($int32)
// 年度
      // {
      //   key: '2',
      //   name: '住宅地上17层',
      //   area: 100.0,
      //   unit_price: 1,
      //   total_contract_price: 0,
      //   repayment_amount: 0,
      // },
      // {
      //   key: '3',
      //   name: '地下车位',
      //   area: 100.0,
      //   unit_price: 1,
      //   total_contract_price: 0,
      //   repayment_amount: 0,
      // },
    ],
    editingKey: '',

    yearList: ['2020', '2019', '2018', '2017'],
    quarterList: ['合计', '第一季度', '第二季度', '第三季度', '第四季度'],
    columns: [
      {
        title: '业态名称',
        dataIndex: 'name',
        width: '15%',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '销售面积(万m²)',
        dataIndex: 'area',
        width: '10%',
        align: 'center',
        editable: true,
      },
      {
        title: '销售单价(万元)',
        dataIndex: 'unit_price',
        width: '15%',
        align: 'center',
        editable: true,
      },
      {
        title: '合同额(万元)',
        dataIndex: 'total_contract_price',
        width: '15%',
        align: 'center',

        render: (text, record) => {
          return <span>{record.area * record.unit_price}</span>;
        },
      },
      {
        title: '回款额(万元)',
        dataIndex: 'repayment_amount',
        width: '15%',
        align: 'center',
        editable: true,
      },
      {
        // 非项目行 该单元格可以为null
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '15%',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);

          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (

                  <a onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                编辑
              </a>
            </div>
          );
        },
      },
    ],

    view_columns:[
      {
        title: '业态名称',
        dataIndex: 'name',
        width: '15%',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '销售面积(万m²)',
        dataIndex: 'area',
        width: '10%',
        align: 'center',
        editable: true,
      },
      {
        title: '销售单价(万元)',
        dataIndex: 'unit_price',
        width: '15%',
        align: 'center',
        editable: true,
      },
      {
        title: '合同额(万元)',
        dataIndex: 'total_contract_price',
        width: '15%',
        align: 'center',

        render: (text, record) => {
          return <span>{record.area * record.unit_price}</span>;
        },
      },
      {
        title: '回款额(万元)',
        dataIndex: 'repayment_amount',
        width: '15%',
        align: 'center',
        editable: true,
      },
      
    ],

  };
  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleSelectChange = value => {
    console.log('handleChange');
    console.log(`selected ${value}`);

    // 调接口查询
  };

  // 季度选择
  handleQuarterChange = e => {
    console.log('季度选择 ' + e.target.value);
    this.setState({ currentQuarter: e.target.value });
  };

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
      console.log('form数据  ' + JSON.stringify(formData));

      // this.dispatch({
      //   type: 'projectManage/fetch',
      //   search: formData,
      //   pagination: {},
      // });
      // this.clearSelectRows();
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  save(form, key) {
    console.log('要保存数据的key ' + key);
   
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
    
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });

        
      }

      console.log('保存后的数据 '+ JSON.stringify(this.state.data));
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleAddClick = () => {
    const {
      salesPlan: { addSalesPlanVisible },
    } = this.props;
    console.log('handleAddClick');
    // this.dispatch({
    //   type: 'costAccount/loadForm',
    //   payload: {
    //     type: 'addSalesPlan',
    //     payload: {},
    //   },
    // });
    this.dispatch({
      type: 'salesPlan/changeSalesPlanFormVisible',
      payload: true,
    });

  };
  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount:{formType}
    } = this.props;
    const { data, yearList, quarterList, editingKey, columns, view_columns } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns2 = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'tyext', //col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
         // handleSave: this.handleSave,
        }),
      };
    });

    //console.log("column转换后 "+ JSON.stringify(columns2));

    // const columns_view = view_columns.map(col => {

    // });
    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <div className={styles.top_div}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <FormItem
              {...formItemLayout}
              label="年份"
              labelAlign='left'
              style={{ paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
            >
              {getFieldDecorator('year', {
                rules: [
                  {
                    required: true,
                    message: '请选择年份',
                  },
                ],
              })(
                <Select
                  placeholder="请选择年份"
                  // defaultValue="lucy"
                  style={{ width: 120 }}
                  // onChange={this.handleSelectChange}
                >
                  {yearList &&
                    yearList.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="季度"
              labelAlign='left'
              style={{ marginLeft: 50, paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
            >
              {getFieldDecorator('quarter', {})(
                <Select
                  placeholder="请选择季度"
                  // defaultValue="lucy"
                  style={{ width: 120 }}
                  //  onChange={this.handleSelectChange}
                >
                  {quarterList &&
                    quarterList.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </FormItem>

            <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
              查询
            </Button>
          </div>
          <Button type="primary" onClick={this.handleAddClick}>
            新增计划
          </Button>
        </div>

        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            loading={loading}
            rowKey={record => record.key}
            dataSource={data}
            columns={formType === "E" ? columns2 : (formType === 'V' ? view_columns: null)} //{view_columns}
            pagination={false}
            scroll={{ y: 500 }}
            rowClassName="editable-row"
            rowClassName={() => 'editable-row'}
            style={{ maxHeight: 500 }}
          ></Table>
        </EditableContext.Provider>
      
      </Form>
    );
  }
}
export default SalesPlan;
