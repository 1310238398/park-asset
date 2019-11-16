import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Popconfirm, Form, message, Button,  Dropdown, Menu } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';


const FormItem = Form.Item;
import * as menuService from '@/services/menu';
const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i.toString(),
    standard: `精装修 ${i}`,

    address: `大堂 ${i}`,
    children: [
      {
        key: i.toString() + '-1',
        standard: '精装修' + i.toString() + '-1',

        address: '大堂' + i.toString() + '-1',
      },
      {
        key: i.toString() + '-2',
        standard: '精装修' + i.toString() + '-2',

        address: '大堂' + i.toString() + '-2',
        children: [
          {
            key: i.toString() + '-2-1',
            standard: '精装修' + i.toString() + '-2-1',

            address: '大堂' + i.toString() + '-2-1',
          },
        ],
      },
    ],
  });
}
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
@Form.create()
class EditableCell extends React.Component {
  // state = {
  //   editing: false,
  // };

  // toggleEdit = () => {
  //   const editing = !this.state.editing;
  //   this.setState({ editing }, () => {
  //     if (editing) {
  //       this.input.focus();
  //     }
  //   });
  // };

  // save = e => {
  //   const { record, handleSave } = this.props;
  //   this.form.validateFields((error, values) => {
  //     if (error && error[e.currentTarget.id]) {
  //       return;
  //     }
  //     this.toggleEdit();
  //     handleSave({ ...record, ...values });
  //   });
  // };

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
  projectManage: state.projectManage,
}))
@Form.create()
export default class Step3 extends PureComponent {
  constructor(props) {
    super(props);
    const { callback } = this.props;
    callback(this.formSubmit);
    this.state = {
      data,
      editingKey: '',

      expandHang: [],
      expandedRowKeys: [],
      count: 5,
      //所有的二级key
      //所有的三级key
    };
    this.menu = (
      <Menu>
        <Menu.Item>
          <a  rel="noopener noreferrer" href="">
           同级添加
          </a>
        </Menu.Item>
      
        <Menu.Item>
          <a  rel="noopener noreferrer" href="">
           下级添加
          </a>
        </Menu.Item>
      </Menu>
    );
    this.columns = [
      // {
      //   title: 'name',
      //   dataIndex: 'name',
      //   width: '25%',
      //   editable: true,
      // },
      // {
      //   title: 'age',
      //   dataIndex: 'age',
      //   width: '15%',
      //   editable: true,
      // },
      {
        title: '地块/部位',
        dataIndex: 'address',
        key: 'address',
        width: '30%',
        editable: true,
      },
      {
        title: '交付标准',
        dataIndex: 'standard',
        key: 'standard',
        width: '40%',
        editable: true,
      },
      {
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
            {/* 点击添加出现下拉菜单选择 同级添加还是 下级添加 */}
           
            <Dropdown overlay={this.menu} placement="bottomCenter">
              <a  style={{ marginLeft: 8 }}>添加</a> 
            </Dropdown>
            <a style={{ marginLeft: 8 }}>删除</a>
         
            </div>
          );
        },
      },
    ];
  }

  formSubmit = () => {
    console.log('Step3');
    const { form, onSubmit, nextHandler } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const formData = { ...values };

      console.log(this.state.data);
      // 接口
      message.success('保存成功');
      if (nextHandler) nextHandler();
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    console.log('要保存数据的key ' + key);
    // form.validateFields((error, row) => {
    //   if (error) {
    //     return;
    //   }
    //   const newData = [...this.state.data];
    //   const index = newData.findIndex(item => key === item.key);
    //   if (index > -1) {
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //       ...item,
    //       ...row,
    //     });
    //     this.setState({ data: newData, editingKey: '' });
    //   } else {
    //     newData.push(row);
    //     this.setState({ data: newData, editingKey: '' });
    //   }

    // });

    form.validateFields((error, row) => {
      if (error) {
        return;
      }
     // debugger;
      const newData = [...this.state.data];

      let keys = [];
      keys = key.split('-');
      console.log(keys);
      let index_ = -1;

      let newData1 = [...newData];

      console.log("keys "+keys);
      

      if (keys.length == 1) {
        console.log("keys  1");
       let index = newData1.findIndex(item => key === item.key);
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

        return;

      }

      for (let i = 0; i < keys.length; i++) {
        let keychild = '';
        for (let n = 0; n < i; n++) {
          keychild = keychild + keys[n] + '-';
        }
        keychild = keychild + keys[i];
        console.log('keychild ' + keychild);
        index_ = newData1.findIndex(item => keychild === item.key);
        console.log('keychild ' + keychild);
        console.log('index_ ' + index_);

        if (index_ > -1 && i === keys.length - 1 && (key === keychild)) {
          console.log("更新数据");
          const item = newData1[index_];
          console.log("被更新的数据 "+ JSON.stringify(item));
          console.log("row 要更新的数据 "+ JSON.stringify(row));
          newData1.splice(index_, 1, {
            ...item,
            ...row,
          });
          // 一级一级更新数据
          this.setState({ editingKey: '' });
          console.log('查看数据有没有变化 ' + JSON.stringify(this.state.data));
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

     
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  expandRow(ji) {
    const { data } = this.state;
    if (ji === 1) {
      this.setState({ expandedRowKeys: [], expandHang: [] });
      return;
    }
    let line = ji - 1; // 显示第二级菜单 就是展开第一级菜单

    for (let i = 0; i < data.length; i++) {}
  }

  handleOnExpand = (expanded, record) => {
    console.log('handleOnExpand');
    const { expandHang } = this.state;

    //  let tempHang = expandHang;
    if (expanded) {
      console.log('true');
      console.log('push');
      expandHang.push(record.key);
      expandHang.sort();
    } else {
      console.log('false');
      for (let i = 0; i < expandHang.length; i++) {
        if (expandHang[i] === record.key) {
          if (i > 0) {
            console.log('pop');
            expandHang.splice(i, 1);
          } else {
            expandHang.splice(0, 1);
          }
        }
        if (record.children) {
          for (let y = 0; y < record.children.length; y++) {
            if (expandHang[i] === record.children[y].key) {
              console.log('hahah');
              delete expandHang[i];
            }
          }
        }
      }
    }
    this.setState({
      expandedRowKeys: [...expandHang],
    });

    console.log(this.state.expandHang);
  };

  handleAdd = () => {
    const { count, data } = this.state;
    const newData = {
      key: count.toString(),
      standard: "请输入标准内容",

      address: "请输入部位名称",
    };
    this.setState({
      data: [...data, newData],
      count: count + 1,
    });
    console.log('handleAdd');
  };

  handleSave = row => {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ data: newData });
  };

  render() {
    //const { expandHang } = this.state;
    // const {

    //   form: { getFieldDecorator, getFieldValue },
    //   onCancel,
    // } = this.props;
    // const {columns, data} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    //   onSelect: (record, selected, selectedRows) => {
    //     console.log(record, selected, selectedRows);
    //   },
    //   onSelectAll: (selected, selectedRows, changeRows) => {
    //     console.log(selected, selectedRows, changeRows);
    //   },
    // };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
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
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Button
          onClick={() => {
            this.expandRow(2);
          }}
        >
          二级
        </Button>
        <Button
          onClick={() => {
            this.expandRow(3);
          }}
        >
          三级
        </Button>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          //expandRowByClick={true}
          expandedRowKeys={this.state.expandedRowKeys}
          // onExpand={record}
          rowKey={record => record.key}
          //expandedRowRender={}
          onExpand={this.handleOnExpand}
          rowClassName={() => 'editable-row'}
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}
