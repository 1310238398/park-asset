import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Tag,
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
import { updateCostItem, createCostItem, deleteCostItem } from '@/services/costAccount';
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  // <EditableContext.Provider value={form}>
  <tr {...props} />
  //</EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    toposNode: ['税种1', '税种2', '税种3'],
  };
  renderToposNode = data => {
    let ret = [];
    ret = data.map(obj => {
      return (
        <Select.Option key={obj} value={obj}>
          {obj}
        </Select.Option>
      );
    });
    return ret;
  };
  getInput = () => {
    let handleChange = value => {
      console.log(value);
    };
    if (this.props.inputType === 'number') {
      if (this.props.dataIndex === 'tax_rate') {
        return (
          <InputNumber
            max={100}
            min={0}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
          />
        );
      } else {
        return (
          <InputNumber
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\\s?|(,*)/g, '')}
          />
        );
      }
    } else if (this.props.inputType === 'select') {
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
      );
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
      <td {...restProps} style={{ paddingLeft: 5, paddingRight: 5 }}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`,
                },
              ],
              initialValue: dataIndex === 'tax_rate' ? record[dataIndex] * 100 : record[dataIndex],
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
  costList: state.costList,
  loading: state.loading.models.salesPlan,
}))
@Form.create()
class CostList extends PureComponent {
  state = {
    tableData: [
      {
        record_id: '001',
        name: '成本科目1',
        cost_id: '001', // 成本项ID
        cost_parent_id: '', //成本项父级ID
        cost_parent_path: '', //成本项父级路经 具体到父级ID

        calculate_type: 0, // 计算方式 1
        label: 1, //标签(1:成本科目 2:测算科目)科目类别
        price: 0, // 成本项价格
        project_id: 'abc', // 成本项所属项目的ID
        tax_price: 0, // 缴税税额
        tax_rate: 0, //税率

        children: [
          {
            record_id: '001-001',
            name: '成本科目101',
            cost_id: '001-001', // 成本项ID
            cost_parent_id: '001', //成本项父级ID
            cost_parent_path: '001', //成本项父级路经 具体到父级ID

            calculate_type: 0, // 计算方式 1
            label: 1, //标签(1:成本科目 2:测算科目)科目类别
            price: 0, // 成本项价格
            project_id: 'abc', // 成本项所属项目的ID
            tax_price: 0, // 缴税税额
            tax_rate: 0, //税率
            children: [
              {
                record_id: '001-001-001',
                name: '成本科目10101',
                cost_id: '001-001-001', // 成本项ID
                cost_parent_id: '001-001', //成本项父级ID
                cost_parent_path: '001/001-001', //成本项父级路经 具体到父级ID
                editable: true,
                calculate_type: 0, // 计算方式 1
                label: 1, //标签(1:成本科目 2:测算科目)科目类别
                price: 0, // 成本项价格
                project_id: 'abc', // 成本项所属项目的ID
                tax_price: 0, // 缴税税额
                tax_rate: 0, //税率
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
            cost_id: '001-002', // 成本项ID
            cost_parent_id: '001', //成本项父级ID
            cost_parent_path: '001', //成本项父级路经 具体到父级ID

            calculate_type: 0, // 计算方式 1
            label: 2, //标签(1:成本科目 2:测算科目)科目类别
            price: 0, // 成本项价格
            project_id: 'abc', // 成本项所属项目的ID
            tax_price: 0, // 缴税税额
            tax_rate: 0, //税率
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

    columns: [
      {
        title: '科目名称',
        dataIndex: 'name',
        width: 200,
        //  ellipsis: true,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '科目类别',
        dataIndex: 'label',
        width: 100,
        align: 'center',
        render: (text, record) => {
          //return <span >{record.rate * record.total}</span>;
          // (1:成本科目 2:测算科目)
          if (record.label === 1) {
            return <div style={{ width: '100%', textAlign: 'center' }}>成本科目</div>;
          } else if (record.label === 2) {
            return <div style={{ width: '100%', textAlign: 'center' }}>测算科目</div>;
          }
        },
      },
      {
        title: '单价(元)',
        children: [], //formatUnitPriceData,

        // editable: true,
      },

      {
        title: '总价(元)',
        children: [], //formatTotalPriceData,
      },

      {
        title: '汇总',
        dataIndex: 'price',
        width: 100,
        //  ellipsis: true,
        editable: true,
        align: 'center',

        // render: text => {
        //   return <div style={{ width: '100%', textAlign: 'center' }}>{text}</div>;
        // },
        render: (text, record) => {
          return <div style={{ width: '100%',textAlign: "center"}}>{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
        }
        // fixed: 'right',
      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        width: 100,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        // fixed: 'right',
        render: (text, record) => {
          return <div style={{ width: '100%', textAlign: 'center' }}>{text * 100 + '%'}</div>;
        },
      },
      {
        title: '税金',
        dataIndex: 'tax_price',
        width: 80,
        align: 'center',
        // render: (text, record) => {
        //   if (record.rate && record.total) {
        //     return <span>{record.rate * record.total}</span>;
        //   } else {
        //     return '';
        //   }
        // },
        render: (text, record) => {
          return <div style={{ width: '100%',textAlign: "center"}}>{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
        }
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

          return record.record_id !== '' ? (
            record.editable ? (
              editable ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() =>
                          this.save(
                            form,
                            record.cost_parent_path !== ''
                              ? record.cost_parent_path + '/' + record.cost_id
                              : record.cost_id
                          )
                        }
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.cost_id)}>
                    <a>取消</a>
                  </Popconfirm>
                </div>
              ) : (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <a
                    disabled={editingKey !== ''}
                    onClick={() => this.edit(record)}
                    style={{ marginRight: 8 }}
                  >
                    编辑
                  </a>

                  <Popconfirm
                    title="确定忽略?"
                    onConfirm={() => {
                      this.ignore(record);
                    }}
                  >
                    <a disabled={editingKey !== ''}>忽略</a>
                  </Popconfirm>
                </div>
              )
            ) : null
          ) : (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Popconfirm
                title="确定启用?"
                onConfirm={() => {
                  this.enable(record);
                }}
              >
                <a disabled={editingKey !== ''}>启用</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ],

    editingKey: '',
    expandedRowKeys: [],
    depth: 4, // 树的最大深度
    depthMap: [],
    currentDepth: 1,
  };

  componentDidMount = async () => {
    const {
      costAccount: { formID, formType },
      projectManage: { businessFormat },
    } = this.props;

    this.dispatch({
      type: 'costList/fetch',
      payload: {
        projectID: formID,
      },
    });

    console.log(' costList页面 接受的pro_id ' + formID);
    console.log(' costList页面 接受的operType ' + formType);
    this.initDepthMap();
  };
  initDepthMap() {
    const { depth, depthMap } = this.state;
    let newList = [];
    for (let i = 1; i <= depth; i++) {
      newList.push(i);
    }
    this.setState({ depthMap: [...newList] });
  }

  renderFuc = (text, record) => {
    if (record.label === 1) {
      return <span style={{ color: 'red' }}>{text}</span>;
    } else {
      return <span>{text}</span>;
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };
  isEditing = record => record.cost_id === this.state.editingKey;

  save(form, key) {
    const {
      costList: { data, formateData },
    } = this.props;

    //const { tableData } = this.state;
    // key包含cost_id的路径
    form.validateFields(async (error, row) => {
      row.tax_rate = row.tax_rate / 100.0;
      console.log('row ');
      console.log(row);
      let business_list = [];
      for (let i = 0; i < formateData.length; i++) {
        let item = {};
        item.proj_business_id = formateData[i].record_id;
        item.unit_price = row[formateData[i].record_id + '_unit'];
        business_list.push(item);
      }
      row.business_list = [...business_list];

      if (error) {
        return;
      }
      const newData = [...data];

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
          row.record_id = item.record_id;
          newData.splice(index, 1, {
            ...item,
            ...row,
          });

          let response;

          response = await updateCostItem(row);
          if (response.record_id && response.record_id !== '') {
            message.success('更新成功');
            this.setState({ editingKey: '' });
            this.dispatch({
              type: 'costList/saveData',
              payload: newData,
            });
          }
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
          row.record_id = item.record_id;
          console.log('被更新的数据 ' + JSON.stringify(item));
          console.log('row 要更新的数据 ' + JSON.stringify(row));
          newData1.splice(index_, 1, {
            ...item,
            ...row,
          });

          let response;

          response = await updateCostItem(row);
          if (response.record_id && response.record_id !== '') {
            message.success('更新成功');
            this.setState({ editingKey: '' });
            // this.dispatch({
            //   type: 'costList/saveData',
            //   payload: newData1,
            // });
          }
        }

        if (
          index_ > -1 &&
          newData1[index_].children &&
          newData1[index_].children.length > 0 &&
          i < keys.length - 1
        ) {
          console.log('进入下一层');
          newData1 = newData1[index_].children;
          console.log('newData1 ' + newData1.length);
        }
      }
    });
  }

  enable = async record => {
    const {
      costList: { data },
      costAccount: { formID },
    } = this.props;
    let response;
    record.project_id = formID;
    response = await createCostItem(record);
    if (response && response.record_id) {
      message.success('启用成功');
      let item = this.findItem(
        data,
        record.cost_parent_path !== ''
          ? record.cost_parent_path + '/' + record.cost_id
          : record.cost_id
      );

      item.record_id = response.record_id;
      item.editable = true; // response.editable;
    }
  };
  ignore = async record => {
    const {
      costList: { data },
    } = this.props;
    let response;
    response = await deleteCostItem(record.record_id);
    if (response && response.status === 'OK') {
      message.success('忽略成功');
      let item = this.findItem(
        data,
        record.cost_parent_path !== ''
          ? record.cost_parent_path + '/' + record.cost_id
          : record.cost_id
      );

      item.record_id = '';
    }
  };

  findItem(objList, key) {
    console.log('findItem 路径  ' + key);
    let keys = [];
    keys = key.split('/');
    console.log('keys   ' + keys);
    let index = -1;
    for (let i = 0; i < keys.length; i++) {
      let keychild = '';
      keychild = keys[i];
      index = objList.findIndex(item => keychild === item.cost_id);
      if (index > -1 && i === keys.length - 1) {
        console.log('找到了！！');
        return objList[index];
      }
      if (
        index > -1 &&
        objList[index].children &&
        objList[index].children.length > 0 &&
        i < keys.length - 1
      ) {
        console.log('进入下一层');
        //  for (let m = 0; m < i; m++) {
        let index_ = key.indexOf('/');
        key = key.substring(index_ + 1);
        //  }
        return this.findItem(objList[index].children, key);
      }
    }
  }

  edit(record) {
    const { columns } = this.state;
    const {
      costList: { formatUnitPriceData },
    } = this.props;

    let index = columns.findIndex(item => 'price' === item.dataIndex);
    // 先改变单元格的可编辑状态
    if (record.calculate_type === 1) {
      // 单价可编
      let item = columns[index];
      item.editable = false;

      // 修改column
      for (let i = 0; i < formatUnitPriceData.length; i++) {
        formatUnitPriceData[i].editable = true;
      }
    } else if (record.calculate_type === 2) {
      // 汇总可编辑

      let item = columns[index];
      item.editable = true;
      for (let i = 0; i < formatUnitPriceData.length; i++) {
        formatUnitPriceData[i].editable = false;
      }
    }

    console.log(`key:${record.cost_id}`);
    this.setState({ editingKey: record.cost_id });
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
          inputType: 'number', //eitem.dataIndex === 'rate'? 'select':'number',
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

  initColumns() {
    const { columns } = this.state;
    const {
      costList: { formatUnitPriceData, formatTotalPriceData },
    } = this.props;
    let index = columns.findIndex(item => '单价(元)' === item.title);
    let item = columns[index];
    item.children = [...formatUnitPriceData];

    let index1 = columns.findIndex(item => '总价(元)' === item.title);
    let item1 = columns[index1];
    item1.children = [...formatTotalPriceData];
  }

  expandRowByLevel(ji) {
    this.setState({ currentDepth: ji });
    this.setState({ expandedRowKeys: [] });
    const {
      costList: { data },
    } = this.props;
    const { expandedRowKeys } = this.state;
    if (ji === 1) {
      this.setState({ expandedRowKeys: [] });
      return;
    }

    let expandHang = [...expandedRowKeys];
    for (let m = 0; m < data.length; m++) {
      if (data[m].children !== null) {
        expandHang.push(data[m].cost_id);
      }
    }

    let level = ji - 1; // 显示第二级菜单 就是展开第一级菜单
    if (level >= 1) {
      //let keys = [];
      this.findExpandKeysByLevel(data, level, expandHang);
      // this.setState({ expandedRowKeys: [...expandedRowKeys, ...keys] });
    }

    expandHang.sort();

    this.setState({ expandedRowKeys: [...expandHang] });
  }

  findExpandKeysByLevel(objList, level, expandHang) {
    const { expandedRowKeys } = this.state;

    for (let n = 0; n < objList.length; n++) {
      let eitem = objList[n];
      if (eitem.level <= level) {
        let index = expandedRowKeys.findIndex(item => eitem.cost_id === item);

        if (index === -1) {
          expandHang.push(eitem.cost_id);
        }
        if (eitem.children && eitem.children.length > 0) {
          this.findExpandKeysByLevel(eitem.children, level, expandHang);
        }
      }
    }

    //expandHang.sort();
    this.setState({ expandedRowKeys: [...expandHang] }); // 异步的
    //console.log("最终展开的数据 ");
    // console.log(expandHang);
  }

  handleOnExpand = (expanded, record) => {
    console.log('handleOnExpand');
    const { expandedRowKeys } = this.state;

    // console.log("expandHang "+ expandHang);
    let expandHang = [...expandedRowKeys];
    if (expanded) {
      console.log('true');
      console.log('push');
      expandHang.push(record.cost_id);
      expandHang.sort();
    } else {
      console.log('false');
      for (let i = 0; i < expandHang.length; i++) {
        if (expandHang[i] === record.cost_id) {
          console.log('找到了。。');
          if (i > 0) {
            console.log('pop');
            expandHang.splice(i, 1);
          } else {
            expandHang.splice(0, 1);
          }
        }
        if (record.children) {
          for (let y = 0; y < record.children.length; y++) {
            if (expandHang[i] === record.children[y]._id) {
              console.log('hahah');
              //  delete expandHang[i];
              expandHang.splice(i, 1);
            }
          }
        }
      }

      expandHang = [...expandHang];
    }
    this.setState({
      expandedRowKeys: [...expandHang],
    });

    console.log(expandHang);
  };
  render() {
    const {
      loading,
      form: { getFieldDecorator },
      costAccount: { formType, businessData },
      costList: { formatTotalPriceData, formatUnitPriceData, data, treeDepth },
    } = this.props;

    const { editingKey, tableData, columns, depthMap, currentDepth } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    this.initColumns();

    // 可编辑权限看到的标题

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
        title: '单价(元)',
        // width: 600,
        children: formatUnitPriceData,
      },
      {
        title: '总价(元)',
        children: formatTotalPriceData,
      },

      {
        title: '汇总',
        dataIndex: 'price',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        render: (text, record) => {
          return <div style={{ width: '100%',textAlign: "center"}}>{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
        }
      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        render: (text, record) => {
          return <div style={{ width: '100%', textAlign: 'center' }}>{text}</div>;
        },
      },
      {
        title: '税金',
        dataIndex: 'tax_price',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        render: (text, record) => {
          return <div style={{ width: '100%',textAlign: "center"}}>{`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
        }
        // render: (text, record) => {
        //   if (record.rate && record.total) {
        //     return <span>{record.rate * record.total}</span>;
        //   } else {
        //     return '';
        //   }
        // },
      },
    ];

    const ecolumns = this.mapEditColumns(columns);

    return (
      <EditableContext.Provider value={this.props.form}>
        {
          businessData.length > 0 && 
          
          <div className={styles.tableListOperator} style={{ marginBottom: 10 }}>
          <span style={{ marginRight: 10, fontSize: 13 }}>控制列表</span>
          {treeDepth.map(item => (
            <Tag
              value={item}
              color={currentDepth === item ? 'blue' : ''}
              key={item}
              onClick={() => {
                this.expandRowByLevel(item);
              }}
            >
              {item}
            </Tag>
          ))}
        </div>
        }
    
        <Table
          components={components}
          expandedRowKeys={this.state.expandedRowKeys}
          bordered
          loading={loading}
          rowKey={record => record.cost_id}
          dataSource={businessData.length === 0 ? [] : data}
          columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
          pagination={false}
          scroll={{ y: 800, x: 'calc(100%)' }}
          rowClassName="editable-row"
          onExpand={this.handleOnExpand}
          // rowClassName={(record) => record.record_id !== "" ?  'editable-row' : "{background: 'blue'}"}
          // style={{ maxHeight: 500 }}
        />
      </EditableContext.Provider>
    );
  }
}

export default CostList;
