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
import { updateCostItem , createCostItem, deleteCostItem} from '@/services/costAccount';
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
      if ( this.props.dataIndex === 'tax_rate') {

        return <InputNumber max={1} min={0} step={0.01}/>;
      }
      else {
         return <InputNumber />;
      }
     
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
                editable: true,
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

      costAccount: { formID, formType },
      projectManage: { businessFormat },

    } = this.props;



    this.dispatch({
      type: 'costList/fetch',
      payload: {
        projectID: formID,
      },
    });

    console.log(" costList页面 接受的pro_id " + formID);
    console.log(" costList页面 接受的operType " + formType);

  }

  renderFuc = (text, record) => {

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
  isEditing = record => record.cost_id === this.state.editingKey;

  save(form, key) {
    const { costList: { data } } = this.props;
    //const { tableData } = this.state;
    // key包含cost_id的路径
    form.validateFields(async (error, row) => {

      console.log("row ");
      console.log(row);
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
          if (response.record_id && response.record_id !== "") {
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
          if (response.record_id && response.record_id !== "") {
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
          newData1[index_].children.length > 0 && i < (keys.length - 1)

        ) {
          console.log('进入下一层');
          newData1 = newData1[index_].children;
          console.log('newData1 ' + newData1.length);
        }
      }


    });
  }

  enable = async (record) => {
    const { costList:{data}} = this.props;
    let response ;
    response = await createCostItem(record);
    if (response && response.record_id) {

      message.success("启用成功");
      let item = this.findItem(data, record.cost_parent_path !== "" ? (record.cost_parent_path+"/"+ record.cost_id): record.cost_id);

      item.record_id = response.record_id;

    }

  }
  ignore = async (record) => {
    const { costList:{data}} = this.props;
    let response ;
    response = await deleteCostItem(record.record_id);
    if (response && response.status === "OK") {

      message.success("忽略成功");
      let item = this.findItem(data, record.cost_parent_path !== "" ? (record.cost_parent_path+"/"+ record.cost_id): record.cost_id);

      item.record_id = "";

    }

  }

  findItem(objList, key) {
    console.log("findItem 路径  "+key);
    let keys =[];
    keys = key.split("/");
    console.log("keys   "+ keys);
    let index = -1;
    for (let i = 0; i < keys.length; i++) {

        let keychild = '';
        keychild = keys[i];
        index = objList.findIndex(item => keychild === item.cost_id);
        if (index > -1 && i === keys.length - 1) {
            console.log("找到了！！");
            return objList[index]; 
        }
        if (index > -1 && objList[index].children && objList[index].children.length > 0 && i < (keys.length - 1)) {

            console.log("进入下一层");
          //  for (let m = 0; m < i; m++) {
                let index_ = key.indexOf("/");
              key =   key.substring(index_+1);
          //  }
            return this.findItem(objList[index].children, key);
        }
    }

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
      form: { getFieldDecorator },
      costAccount: { formType },
      costList: { formatTotalPriceData, formatUnitPriceData, data }
    } = this.props;

    const { editingKey, tableData } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
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
        title: '科目类别',
        dataIndex: 'label',
        width: 100,

        align: 'center',
        render: (text, record) => {
          //return <span >{record.rate * record.total}</span>;
          // (1:成本科目 2:测算科目)
          if (record.label === 1) {
            return <div style={{ width: "100%", textAlign: "center" }}>成本科目</div>;
          }
          else if (record.label === 2) {
            return <div style={{ width: "100%", textAlign: "center" }}>测算科目</div>;
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
        dataIndex: 'price',
        width: 100,
        //  ellipsis: true,
        align: 'center',
        //  editable: true,
        fixed: 'right',
        render: (text, record) => {
          //1.单价算总价,2.总价算单价
          if (record.calculate_type === 1) {

            editable: true;
          }
          else if (record.calculate_type === 2) {



          }
        }

      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        width: 100,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        fixed: 'right',
        render: (text, record) => {
          return <div style={{ width: "100%", textAlign: "center" }}>{text}</div>

        }


      },
      {
        title: '税金',
        dataIndex: 'tax_price',
        width: 80,
        align: 'center',
        render: (text, record) => {
          if (record.rate && record.total) {

            return <span >{record.rate * record.total}</span>;


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

          return record.record_id !== "" ?
            (record.editable ? (
              editable ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <EditableContext.Consumer>
                    {form => (
                      <a onClick={() => this.save(form, record.cost_parent_path !== "" ? (record.cost_parent_path + "/" + record.cost_id) : (record.cost_id))} style={{ marginRight: 8 }}>
                        保存
                    </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.cost_id)}>
                    <a>取消</a>
                  </Popconfirm>
                </div>
              ) : (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <a disabled={editingKey !== ''} onClick={() => this.edit(record.cost_id)} style={{ marginRight: 8 }}>
                      编辑
                </a>

                    <Popconfirm title="确定忽略?" onConfirm={() => {this.ignore(record) }}>
                      <a disabled={editingKey !== ''} >
                        忽略
                </a>
                    </Popconfirm>

                  </div>
                )
            ) : null) :
            (<div style={{ width: "100%", textAlign: "center" }}>
              <Popconfirm title="确定启用?" onConfirm={() => { this.enable(record)}}>
                <a disabled={editingKey !== ''} >
                  启用
                </a>
              </Popconfirm>

            </div>);
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
        dataIndex: 'price',
        width: 80,
        //  ellipsis: true,
        align: 'center',
      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        width: 80,
        //  ellipsis: true,
        align: 'center',
        editable: true,
        render: (text, record) => {
          return <div style={{ width: "100%", textAlign: "center" }}>{text}</div>

        }
      },
      {
        title: '税金',
        dataIndex: 'tax_price',
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


    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          loading={loading}
          rowKey={record => record.cost_id}
          dataSource={data}
          columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
          pagination={false}
          scroll={{ y: 800, x: 'calc(100%)' }}
        //  rowClassName="editable-row"
          rowClassName={(record) => record.record_id !== "" ?  'editable-row' : "{background: 'blue'}"}
        // style={{ maxHeight: 500 }}
        />
      </EditableContext.Provider>
    );
  }
}

export default CostList;


