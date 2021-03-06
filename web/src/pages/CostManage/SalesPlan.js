import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import {
  Form,
  Row,
  Col,
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
import { updateSalesPlan } from '@/services/costAccount';
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
      return <InputNumber   formatter={value => `${value}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}
      parser={value => (value).replace(/\\s?|(,*)/g, '')}
      style={{ width:"100%"}}
      />;
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
    editingKey: '',
    //yearList: [],
    quarterList: [
      {
        name: '第一季度',
        key: 1,
      },
      {
        name: '第二季度',
        key: 2,
      },
      {
        name: '第三季度',
        key: 3,
      },
      {
        name: '第四季度',
        key: 4,
      },
    ],
    columns: [
      {
        title: '业态名称',
        dataIndex: 'proj_business_name',
        width: '15%',
       // ellipsis: true,
        align: 'center',
      },
      {
        title: '年度',
        dataIndex: 'year',
        width: '8%',

        align: 'center',
      },
      {
        title: '季度',
        dataIndex: 'quarter',
        width: '8%',

        align: 'center',
      },

      {
        title: '销售面积(m²)',
        dataIndex: 'sale_area',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {
        
        return <span >{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        }
      },
      {
        title: '销售单价(元)',
        dataIndex: 'average_price',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }
      },
      {
        title: '合同额(元)',
        dataIndex: 'contract_amount',
        width: '15%',
        align: 'center',
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }
        // render: (text, record) => {
        //   return <span>{record.sale_area * record.average_price}</span>;
        // },
      },
      {
        title: '回款额(元)',
        dataIndex: 'payback',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }
      },
      {
        // 非项目行 该单元格可以为null
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);

          return editable ? (
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
              <a
                disabled={editingKey !== ''}
                onClick={() => this.edit(record.record_id)}
                style={{ marginRight: 8 }}
              >
                编辑
              </a>
              <Popconfirm title="确定删除?" onConfirm={() => this.deletePlan(record.record_id)}>
                <a disabled={editingKey !== ''}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ],

    view_columns: [
      {
        title: '业态名称',
        dataIndex: 'proj_business_name',
        width: '15%',
       // ellipsis: true,
        align: 'center',
      },
      {
        title: '销售面积(m²)',
        dataIndex: 'sale_area',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {

        return  <span >{`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        }

      },
      {
        title: '销售单价(元)',
        dataIndex: 'average_price',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }
      },
      {
        title: '合同额(元)',
        dataIndex: 'contract_amount',
        width: '15%',
        align: 'center',
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }

        // render: (text, record) => {
        //   return <span>{record.sale_area * record.average_price}</span>;
        // },
      },
      {
        title: '回款额(元)',
        dataIndex: 'payback',
        width: '15%',
        align: 'center',
        editable: true,
        render: (text, record) => {
        
          return <span >{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</span>
          }
      },
    ],
  };
  componentDidMount() {
    console.log('销售计划页面初始化');
    const {
      costAccount: { formID },
    } = this.props;

    this.dispatch({
      type: 'salesPlan/fetch',
      search: {},
      pagination: {},
      pro_id: formID,
    });
  }

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
    console.log('handleSearchFormSubmit');

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      const {
        costAccount: { formID },
      } = this.props;
      const formData = { ...values };
      console.log('form数据  ' + JSON.stringify(formData));

      this.dispatch({
        type: 'salesPlan/fetch',
        search: formData,
        pagination: {},
        pro_id: formID,
      });
      //this.clearSelectRows();
    });
  };

  isEditing = record => record.record_id === this.state.editingKey;

  save(form, key) {
    // key是项目业态id
    const {
      salesPlan: {
        data: { list, pagination },
      },
    } = this.props;
    console.log('要保存数据的key ' + key);

    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = list;

      const index = newData.findIndex(item => key === item.record_id);
      if (index > -1) {
        const item = newData[index];
        row.record_id = key;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        let response;

        response = await updateSalesPlan(row);
        if (response.record_id && response.record_id !== '') {
          message.success('更新成功');
          this.setState({ editingKey: '' });
          this.dispatch({
            type: 'salesPlan/saveData',
            payload: {
              list: [...newData],
              pagination: pagination,
            },
          });
        }
      }
    });
  }

  deletePlan(key) {
    this.dispatch({
      type: 'salesPlan/del',
      payload: key,
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
  handleResetFormClick = () => {
    const {
      form,
      costAccount: { formID },
    } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'salesPlan/fetch',
      search: {},
      pagination: {},
      pro_id: formID,
    });
  };

  handleTableChange = pagination => {
    const {
      costAccount: { formID },
    } = this.props;
    this.dispatch({
      type: 'salesPlan/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
        project_id: formID,
      },
    });
    //this.clearSelectRows();
  };
  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount: { formType, businessData },
      salesPlan: {
        data: { list, pagination },
        yearList,
      },
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const { quarterList, editingKey, columns, view_columns } = this.state;
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
          inputType: 'number', //col.dataIndex === 'age' ? 'number' : 'text',
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
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
            <Row gutter={16}>
              <Col md={3} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label="年份"
                  labelAlign="left"
                  style={{ paddingBottom: 10, paddingTop: 0, marginBottom: 0 }}
                >
                  {getFieldDecorator('year', {})(
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
              </Col>
              <Col md={4} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label="季度"
                  labelAlign="left"
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
                          <Select.Option key={item.key} value={item.key}>
                            {item.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </Col>
              <Col md={9} sm={24} style={{ textAlign: 'right' }}>
                {formType === 'E' && businessData.length > 0 && (
                  <Button icon="plus" type="primary" onClick={this.handleAddClick}>
                    新增计划
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </div>
        {/* <div className={styles.tableListOperator}>
         
        </div> */}
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            loading={loading}
            rowKey={record => record.record_id}
            dataSource={list}
            columns={formType === 'E' ? columns2 : formType === 'V' ? view_columns : null} //{view_columns}
            // pagination={false}
            pagination={paginationProps}
            // scroll={{ y: 500 }}
            rowClassName="editable-row"
            rowClassName={() => 'editable-row'}
            onChange={this.handleTableChange}
            // style={{ maxHeight: 500 }}
          ></Table>
        </EditableContext.Provider>
      </div>
    );
  }
}
export default SalesPlan;
