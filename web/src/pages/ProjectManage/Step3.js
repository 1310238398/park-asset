import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Popconfirm, Form, message, Button,  Dropdown, Menu } from 'antd';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import DicSelect from '@/components/DictionaryNew/DicSelect';


const FormItem = Form.Item;
import * as menuService from '@/services/menu';
import { updateStandard, createStandard, deleteStandard } from '@/services/projectManage';

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
      defaultData:[
        {
          content	:"交付标准内容",
          parent_id: "",
          parent_path: "",
          part:"交付部位",
          record_id:"",

        }
      ],
      
      editingKey: '',

      expandHang: [],
      expandedRowKeys: [],
     
      //所有的二级key
      //所有的三级key
    };
   
    this.columns = [
     
      {
        title: '地块/部位',
        dataIndex: 'part',
       
        width: '30%',
        editable: true,
      },
      {
        title: '交付标准',
        dataIndex: 'content',
       
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
                  <a onClick={() => this.save(form, record.parent_path !== "" ? (record.parent_path+"/"+ record.record_id) : record.record_id)} style={{ marginRight: 8 }}>
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record.record_id)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <div >
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.record_id)}>
              编辑
            </a>
            {/* 点击添加出现下拉菜单选择 同级添加还是 下级添加 */}
           
            <Dropdown overlay={() => this.getMenu(record)} placement="bottomCenter" disabled={editingKey !== ''}>
              <a  style={{ marginLeft: 8 }} disabled={editingKey !== ''} 
             // onMouseEnter={() =>this.currentClickKey(record)}
              >添加</a> 
            </Dropdown>
            <Popconfirm title="确定删除?" onConfirm={() => this.deleteStandard(record)}>
            <a style={{ marginLeft: 8 }} disabled={editingKey !== ''}>删除</a>
            </Popconfirm>
            </div>
          );
        },
      },
    ];
  }

  formSubmit = () => {
    console.log('Step3 formSubmit');
    const { form, onSubmit, nextHandler } = this.props;
    if (nextHandler) nextHandler();

    // form.validateFieldsAndScroll((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   const formData = { ...values };

    //   console.log(this.state.data);
    //   // 接口
    //   message.success('保存成功');
    //   if (nextHandler) nextHandler();
    // });
  };

  isEditing = record => record.record_id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };


  createStandard(objList, row) {


  }
  
  save(form, key) {
    const { projectManage:{formID, deliveryStandard }} = this.props;
    console.log('要保存数据的父级路径  ' + key);
   
    

    form.validateFields( async (error, row) => {
      if (error) {
        return;
      }

      const newData = [...deliveryStandard];

   

      let keys = [];
      keys = key.split('/');
      console.log(keys);
      let index_ = -1;

      let newData1 = [...newData];

      console.log("keys ");
      console.log(keys);

      if (keys.length === 1) {
        console.log("keys  1");
       let index = newData1.findIndex(item => key === item.record_id);
        if (index > -1) {
          const item = newData[index];
          row.project_id = formID;
          let response ;
          console.log("row 要更新的数据 ");
          console.log(row);
          if (key === "") {
            row.parent_path= "";
            row.parent_id = "";
            response = await createStandard(row);
          }
          else {
            row.record_id = item.record_id;
            response = await updateStandard(row);
          }

          if (response.record_id && response.record_id !== "") {
            message.success('成功');
            row = {...response};
    

              newData.splice(index, 1, {
                ...item,
                ...row,
              });
              console.log(row)
              this.dispatch({
                type: 'projectManage/saveDeliveryStandard',
                payload: newData,
              });
              this.setState({ editingKey: '' });
            
          }
        } 

        return;

      }

      for (let i = 0; i < keys.length; i++) {
        let keychild = '';
       
        keychild =  keys[i];
        console.log('keychild ' + keychild);
        index_ = newData1.findIndex(item => keychild === item.record_id);
       
        console.log('index_ ' + index_);

        if (index_ > -1 && i === keys.length - 1 ) {
          console.log("更新数据");
          const item = newData1[index_];
          console.log("被更新的数据 "+ JSON.stringify(item));
          

         
          row.project_id = formID;
          let response ;
          console.log("row 要更新的数据 ");
          console.log(row);
          if (keychild === "") {
            row.parent_path= key.substring(0,key.lastIndexOf("/"));
            row.parent_id = keys[keys.length -2];
            response = await createStandard(row);
          }
          else {
            row.record_id = item.record_id;
            response = await updateStandard(row);
          }
          
          if (response.record_id && response.record_id !== "") {
            message.success('成功');
            row = {...response};
            console.log(newData);
            //let index = newData1.findIndex(item => key === item.record_id);
           // if (index > -1) {
             // const item = newData1[index];
              newData1.splice(index_, 1, {
                ...item,
                ...row,
              });
             
              this.dispatch({
                type: 'projectManage/saveDeliveryStandard',
                payload: newData,
              });
             this.setState({ editingKey: '' });
           // } 
          }
        
          
          
         
        }

        if (
          index_ > -1 &&
          newData1[index_].children &&
          newData1[index_].children.length > 0 &&
           i < (keys.length - 1)
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

  deleteStandard = async (record) => {
    const { projectManage:{ deliveryStandard }} = this.props;

    let deliveryStandardData = [...deliveryStandard];

    if (record.parent_path === "") {
      let response ;
      response = await deleteStandard(record.record_id);
      if (response.status === "OK") {
        message.success("删除成功");

         deliveryStandardData = deliveryStandardData.filter(item => item.record_id !== record.record_id);
         this.dispatch({
          type: 'projectManage/saveDeliveryStandard',
          payload: deliveryStandardData,
        }); 
      }
      // 删除顶级节点
     

      return;

    }
    let parentItem = this.findItem(deliveryStandardData, record.parent_path);
    let response ;
    response = await deleteStandard(record.record_id);
    if (response.status === "OK") {

      message.success("删除成功");
      if (parentItem.children && parentItem.children.length > 0) {
        parentItem.children =  parentItem.children.filter(item => item.record_id !== record.record_id);
        if (parentItem.children.length === 0) {
          parentItem.children = null;
        }
        console.log("删除后的数据 ");
        console.log(parentItem);
        console.log(deliveryStandardData);

        this.dispatch({
          type: 'projectManage/saveDeliveryStandard',
          payload: deliveryStandardData,
        });

      }

    }

  }

  componentDidMount() {}

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  getMenu = (record) => {
  
    return (
    <Menu >
      <Menu.Item  onClick={() => this.brotherLevelAdd(record)}>
        
         同级添加
        
      </Menu.Item>
    
      <Menu.Item onClick={() => this.childLevelAdd(record)}>
      
         下级添加
        
      </Menu.Item>
    </Menu>);
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
      expandHang.push(record.record_id);
      expandHang.sort();
    } else {
      console.log('false');
      for (let i = 0; i < expandHang.length; i++) {
        if (expandHang[i] === record.record_id) {
          if (i > 0) {
            console.log('pop');
            expandHang.splice(i, 1);
          } else {
            expandHang.splice(0, 1);
          }
        }
        if (record.children) {
          for (let y = 0; y < record.children.length; y++) {
            if (expandHang[i] === record.children[y].record_id) {
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

  

  // 同级添加
  brotherLevelAdd = (currentItem) => {
    console.log("brotherLevelAdd");
    const {  projectManage:{ deliveryStandard } } = this.props;

    let deliveryStandardData = [...deliveryStandard];
    if (currentItem.parent_path === "") {
      console.log("顶级添加");
      // 直接顶层添加
     
      const newItem = {
        record_id: "",
        content: "请输入标准内容",
  
        part: "请输入部位名称",
        parent_path : "",
        parent_id: "",
      };
      deliveryStandardData.push(newItem);
      this.dispatch({
        type: 'projectManage/saveDeliveryStandard',
        payload: deliveryStandardData,
      });
      
      return;
    }
    let item = this.findItem(deliveryStandardData,currentItem.parent_path);  

    let count =  0;
    const newItem = {
      record_id: "",
      content: "请输入标准内容",

      part: "请输入部位名称",
      parent_id:item.record_id,
      parent_path:item.parent_path !== "" ? item.parent_path+"/"+item.record_id : item.record_id,
    };
    if (item.children) {
      item.children.push(newItem);
    }
    else {
      item.children = [];
      item.children.push(newItem);
    }

  }

  //子级添加
  childLevelAdd = (currentItem) => {
    const {  expandedRowKeys} = this.state;
    const {  projectManage:{ deliveryStandard }  } = this.props;

    
   
    // 递归遍历
      let item = this.findItem(deliveryStandard, currentItem.parent_path+"/"+currentItem.record_id);  
    
    const newItem = {
      record_id: "",
      content: "请输入标准内容",

      part: "请输入部位名称",
      parent_id: item.record_id,
      parent_path:item.parent_path !== "" ?  (item.parent_path + "/"+ item.record_id) : item.record_id,
    };
    if (item.children) {
      item.children.push(newItem);
    }
    else {
      item.children = [];
      item.children.push(newItem);
    }
    
    let expandKeys =[];
    expandKeys.push(item.record_id);
    for (let i in item.children) {
      expandKeys.push(item.children[i].record_id);
    }
    this.setState({
    
      expandedRowKeys:[...expandedRowKeys, ...expandKeys],
     // count: count + 1,
    });
    console.log("需要展开的子项 "+ this.state.expandedRowKeys);

    // 并展开子项
  
    console.log('添加结果 '+ JSON.stringify(this.state.data));
  };

  // 递归遍历(有问题)
  findItem(objList, key) {
    console.log("findItem 路径  "+key);
    console.log("objList "+ JSON.stringify(objList));

    let keys =[];
    keys = key.split("/");
    console.log("keys   "+ keys);

    // 递归遍历 
    let index = -1;
  //  let newData = [...objList];
 
    for (let i = 0; i < keys.length; i++) {
      let keychild = '';
        // for (let n = 0; n < i; n++) {
        //   keychild = keychild + keys[n] + '/';
        // }
        keychild =  keys[i];
        index = objList.findIndex(item => keychild === item.record_id);
        if (index > -1 && i === keys.length - 1) {

          console.log("找到了！！");
           

          return objList[index];
        }
        if (  index > -1 &&
          objList[index].children &&
          objList[index].children.length > 0 && i < (keys.length - 1)) {

            console.log('进入下一层');
            for (let m = 0; m < i; m++) {
           let index_ =  key.indexOf("/");
           key.slice(index+1);

            }
           
            return this.findItem(objList[i].children, key);


        }
    }
 
    
   
    // for (let i = 0; i < objList.length; i++) {
    //   console.log("循环");
    //   console.log("objList[i].record_id "+objList[i].record_id);

     

    //   if (key === objList[i].record_id) {
    //     console.log("定位到对象 "+JSON.stringify(objList[i]));
    //     return objList[i];
       
    //   }
    //   else if (key.indexOf(objList[i].record_id) !== -1 &&  objList[i].children && objList[i].children.length > 0) {

    //     return this.findItem(objList[i].children, key);
    //   }

    // }
  
  }

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

  currentClickKey(item) {
    console.log("当前点击的key "+ item.key);
    this.setState({currentItem: item});
  }

  render() {
    const { defaultData } = this.state;
    const {

      //form: { getFieldDecorator, getFieldValue },
      projectManage: { deliveryStandard },
      onCancel,
    } = this.props;
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
         // handleSave: this.handleSave,
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
        {/* <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button> */}
        <Table
          components={components}
          bordered
          dataSource={deliveryStandard}
          columns={columns}
          rowClassName="editable-row"
          //expandRowByClick={true}
          expandedRowKeys={this.state.expandedRowKeys}
          // onExpand={record}
          rowKey={record => record.record_id}
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
