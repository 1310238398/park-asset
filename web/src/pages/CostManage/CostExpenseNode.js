import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Form,
    Input,
    Table,
    Card,
    InputNumber,
    Popconfirm,
    Select,
    DatePicker,
    TreeSelect,
    message,
    Dropdown,
    Menu
} from 'antd';
import { createCostNode, updateCostNode, deleteCostNode } from '@/services/costAccount';
//import EditableCell from '@/components/EditableCell/EditableCell';
import styles from './CostAccount.less';
import moment from 'moment';
const { SHOW_PARENT } = TreeSelect;
const EditableContext = React.createContext();

@connect(state => ({
    costExpenseNode: state.costExpenseNode,
}))
class EditableCell extends React.Component {

    state = {

       
    }
    renderToposNode = (data) => {
        let ret = [];
        ret = data.map(obj => {
            return (<Select.Option key={obj.key} value={obj.key}>{obj.name}</Select.Option>)
        })
        return ret;
    }
    getInput = () => {

        const { costExpenseNode:{costNodeItems }} = this.props;
        const { selectableCostItems } = this.state;

        

        let handleChange = (value) => {
            console.log(value);
        }
        if (this.props.inputType === 'number') {
            if (this.props.dataIndex === "expend_rate") {
                return <InputNumber max={100} min={0} placeholder="请输入"/>;
            }
            else {
                return <InputNumber placeholder="请输入"/>;
            }

        }
        else if (this.props.inputType === 'select') {
            const { costExpenseNode: { selectListNode } } = this.props
            return <Select
                //mode="multiple"
                style={{ width: 200 }}
                

            // onBlur={handleChange}

            // onChange={handleChange}
            >
                {this.renderToposNode(selectListNode)}
            </Select>



        }
        else if (this.props.inputType === 'time') {
            // 时间组件
            return <DatePicker style={{ width: "100%" }}
                //showTime
                //defaultValue={}
                // style={{width:"100%"}}
                placeholder="请选择开始时间"
                format="YYYY-MM-DD"
            // locale={locale}
            />;

        }
        else if (this.props.inputType === 'multiply') {

            return <TreeSelect treeData={costNodeItems} style={{ width: 180 }}
                treeCheckable={true}
                showCheckedStrategy={SHOW_PARENT}
                searchPlaceholder='请选择'
            ></TreeSelect>;
        }
        return <Input placeholder="请输入"/>;
    };

    // // 设置初始值
    setInitValue = (inputType, record, dataIndex) => {
        if (inputType === "time") {

            return moment(record[dataIndex]);
        }
        else if (inputType === "expend_rate") {

            return (record[dataIndex] * 100);

        }
        else {
            return record[dataIndex];
        }


    }

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
                    <Form.Item style={{ margin: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`,
                                },
                            ],
                            initialValue: inputType === "time" ? moment(record[dataIndex]) : (dataIndex === "expend_rate" ? (record[dataIndex] * 100) : record[dataIndex]),
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
    costAccount: state.costAccount,
    costExpenseNode: state.costExpenseNode,
    loading: state.loading.models.costExpenseNode,
}))
@Form.create()
class CostExpenseNode extends PureComponent {
    state = {
        tableData: [
            {
                expend_rate: 0.5, // 支出比例
                category: "大纲",// 工作类别(大纲 里程碑 一级 二级)
                end_time: "2020-11-24",
                expenditure_time_type: 1,//资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)


                name: "节点1", //项目支出节点名称

                parent_id: "",//父级ID

                parent_path: "",//父级路经

                proj_cost_items: [
                    "0-0-0"
                ],
                project_id: "",//成本项目ID

                record_id: "001",//记录ID

                start_time: "2019-11-24",//开始时间

                total_cost: 0,//支出总额
            },
            {
                expend_rate: 0.5, // 支出比例
                category: "大纲",// 工作类别(大纲 里程碑 一级 二级)
                end_time: "2020-11-24",
                expenditure_time_type: 1,//资金支出时间方式(1:完成时间前30天 2:完成时间 3:完成时间后30天 4:完成时间后2个月 5:完成时间后6个月 6:完成时间后1年 7:平摊道每个月 8:平摊道每个季度)


                name: "节点1", //项目支出节点名称

                parent_id: "",//父级ID

                parent_path: "",//父级路经

                proj_cost_items: ["0-0-0"],
                project_id: "",//成本项目ID

                record_id: "002",//记录ID

                start_time: "2019-11-24",//开始时间

                total_cost: 0,//支出总额
            }

        ],
        editingKey: '', addingNew: false, // 表示正在添加新的item

        expandHang: [],
        expandedRowKeys: [],
    };

    componentDidMount() {
        const { costAccount: { formID } } = this.props;

        this.dispatch({
            type: 'costExpenseNode/fetch',
            payload: formID,
        });
        // 请求列表 请求单选 多选的列表
    }
    mapEditColumns = columns => {
        const ecolumns = [];
        columns.forEach(item => {
            const eitem = { ...item };
            if (eitem.editable) {
                eitem.onCell = record => ({
                    record,
                    inputType: eitem.inputType,//eitem.dataIndex === 'rate'? 'select':'number',
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
    isEditing = record => record.record_id === this.state.editingKey;
    edit(key) {
        console.log(`key:${key}`);
        this.setState({ editingKey: key });
    }

    cancel = (record) => {
        
       
        if (record.record_id === "") { // 如果是新建的取消 需要做删除
           
            console.log("删除想要添加的临时节点");
            this.deleteNode(record);
            this.setState({ addingNew: false });
         

        }
        this.setState({ editingKey: '' });

    };
    save(form, key) {
        const { costExpenseNode: { data }, costAccount: { formID } } = this.props;
        // key包含cost_id的路径
        form.validateFields(async (error, row) => {

           
            row.expend_rate = row.expend_rate / 100.00;
            //proj_cost_items
          
            if (error) {
                return;
            }
            const newData = [...data];

            let keys = [];
            keys = key.split('/');
            console.log(keys);


            let index_ = -1;

            let newData1 = [...newData];

            console.log('keys ' + keys);

            if (keys.length === 1) {
                console.log('keys  1');
                let index = newData1.findIndex(item => key === item.record_id);
                if (index > -1) {
                    const item = newData[index];
                    row.project_id = formID;
                    let response;
                    console.log("row 要更新的数据 ");
                    console.log(row);
                    if (key === "") {

                        row.parent_path = "";
                        row.parent_id = "";
                        response = await createCostNode(row);
                    }
                    else {
                        row.record_id = item.record_id;
                        response = await updateCostNode(row);
                    }
                    if (response.record_id && response.record_id !== "") {
                        message.success('成功');
                        if (row.record_id === "") {
                            this.setState({ addingNew: false });
              
                          }
                        row = { ...response };

                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });
                        this.dispatch({
                            type: 'costExpenseNode/saveData',
                            payload: newData,
                        });
                        this.setState({ editingKey: '' });
                    }


                }
                return;
            }

            for (let i = 0; i < keys.length; i++) {
                let keychild = '';

                keychild = keys[i];
                console.log('keychild ' + keychild);
                index_ = newData1.findIndex(item => keychild === item.record_id);

                console.log('index_ ' + index_);

                if (index_ > -1 && i === keys.length - 1) {
                    console.log('更新数据');
                    const item = newData1[index_];
                    console.log('被更新的数据 ' + JSON.stringify(item));

                    row.project_id = formID;
                    let response;
                    console.log("row 要更新的数据 ");
                    console.log(row);

                    if (keychild === "") {
                        row.parent_path = key.substring(0, key.lastIndexOf("/"));
                        row.parent_id = keys[keys.length - 2];
                        response = await createCostNode(row);
                    }
                    else {
                        row.record_id = item.record_id;
                        response = await updateCostNode(row);
                    }

                    if (response.record_id && response.record_id !== "") {
                        message.success('成功');
                        if (row.record_id === "") {
                            this.setState({ addingNew: false });
              
                          }
                        row = { ...response };
                        newData1.splice(index_, 1, {
                            ...item,
                            ...row,
                        });
                        this.dispatch({
                            type: 'costExpenseNode/saveData',
                            payload: newData,
                        });
                        this.setState({ editingKey: '' });
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

    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    mapTime(type) {
        const { costExpenseNode: { selectListNode } } = this.props;

        let index = selectListNode.findIndex(item => type === item.key);
        const item = selectListNode[index];
        return item.name;
    }

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

      brotherLevelAdd = (currentItem) => {
        const { costExpenseNode:{ data }} = this.props;
        this.setState({ addingNew: true});
        let datatemp = [...data];
        if (currentItem.parent_path === "") {
            console.log("顶级添加");
            const newItem = {
                record_id: "",
              
                parent_path : "",
                parent_id: "",
                name: "",
                expenditure_time_type: 1,
                expend_rate: 0,
                category:""

              };
              datatemp.push(newItem);
              this.dispatch({
                type: 'costExpenseNode/saveData',
                payload: datatemp,
              });
              return;

        }

        let item = this.findItem(datatemp, currentItem.parent_path);
        const newItem = {
            record_id: "",
           
            parent_id:item.record_id,
            parent_path:item.parent_path !== "" ? item.parent_path+"/"+item.record_id : item.record_id,
            name: "",
            expenditure_time_type: 1,
            expend_rate: 0,
            category:""
          };
          if (item.children) {
            item.children.push(newItem);
          }
          else {
            item.children = [];
            item.children.push(newItem);
          }
   
      }
      childLevelAdd = (currentItem) => {
        const {  expandedRowKeys} = this.state;
        const { costExpenseNode:{ data }} = this.props;
        this.setState({ addingNew: true});
        //递归遍历
        let item = this.findItem(data, currentItem.parent_path !== "" ? (currentItem.parent_path+"/"+currentItem.record_id) : currentItem.record_id);

        const newItem = {
            record_id: "",
            parent_id: item.record_id,
            parent_path:item.parent_path !== "" ?  (item.parent_path + "/"+ item.record_id) : item.record_id,
            name: "",
            expenditure_time_type: 1,
            expend_rate: 0,
            category:""

          };

          if (item.children !== undefined && item.children !== null) {
            item.children.push(newItem);
          }
          else {
              console.log("新增节点");
            item.children = [];
            item.children.push(newItem); 
          }
          let expandKeys =[];
          expandKeys.push(item.record_id);
          for (let i in item.children) {
              console.log("展开新增节点");
            expandKeys.push(item.children[i].record_id);
          }
          this.setState({
    
            expandedRowKeys:[...expandedRowKeys, ...expandKeys],
           
          });
          console.log("需要展开的子项 "+ this.state.expandedRowKeys);
          console.log("需要展开的子项 "+ this.state.expandKeys);
          console.log('添加结果 '+ JSON.stringify(data));
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
            index = objList.findIndex(item => keychild === item.record_id);
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

      deleteNode = async (record) => {
        const { costExpenseNode:{ data }} = this.props;
        let dataTemp = [...data];
       
  
        if (record.parent_path === "") {

            if (record.record_id === "") { // 删除临时节点（想创建但是又取消的）
                
                dataTemp = dataTemp.filter(item => item.record_id !== record.record_id);

                this.dispatch({
                    type: 'costExpenseNode/saveData',
                    payload: dataTemp,
                  });
                return;
    
            }

            let response;
            response = await deleteCostNode(record.record_id);
            if (response.status === "OK") {
                message.success("删除成功");
                dataTemp = dataTemp.filter(item => item.record_id !== record.record_id);

                this.dispatch({
                    type: 'costExpenseNode/saveData',
                    payload: dataTemp,
                  });
            }
            return;
        }

        let parentItem = this.findItem(dataTemp, record.parent_path);

        if (record.record_id === "") { // 删除临时节点（想创建但是又取消的）
            if (parentItem.children && parentItem.children.length > 0) {
                parentItem.children =  parentItem.children.filter(item => item.record_id !== record.record_id);

                if (parentItem.children.length === 0) {
                    parentItem.children = null;
                }
                this.dispatch({
                    type: 'costExpenseNode/saveData',
                    payload: dataTemp,
                  });

            }
            return;

        }
        let response;
        response = await deleteCostNode(record.record_id);
      
        if (response.status === "OK") {
            message.success("删除成功");
            if (parentItem.children && parentItem.children.length > 0) {
                parentItem.children =  parentItem.children.filter(item => item.record_id !== record.record_id);

                if (parentItem.children.length === 0) {
                    parentItem.children = null;
                }
                this.dispatch({
                    type: 'costExpenseNode/saveData',
                    payload: dataTemp,
                  });

            }
        }

      }
      handleOnExpand = (expanded, record) => {
        console.log('handleOnExpand');
        const { expandedRowKeys } = this.state;
    
          let expandHang = [...expandedRowKeys];
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
                  //delete expandHang[i];
                  expandHang.splice(i, 1);
                }
              }
            }
          }
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
            costAccount: { formType },
            costExpenseNode: { data , costNodeItems}
        } = this.props;

        console.log("formType " + formType);

        const components = {
            body: {
                // row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const { tableData } = this.state;
        // 只有查看权限的人看到的标题
        const view_columns = [
            {
                title: '节点名称',
                dataIndex: 'name',
                width: 200,
                ellipsis: true,
               
                align: 'center',
                fixed: 'left',
            },
            {
                title: '节点类别',
                dataIndex: 'type',
                width: 100,
                align: 'center',
                render: (text) => {

                    return <div style={{ textAlign: "center" }}>{text}</div>
                }


            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: 150,
                align: 'center',
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }}>{moment(record.start_time).format("YYYY-MM-DD")}</div>
                }

            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: 150,
                align: 'center',
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }}>{moment(record.end_time).format("YYYY-MM-DD")}</div>
                }

            },

            {
                title: '成本科目',
                dataIndex: 'proj_cost_items',
                width: 200,

                align: 'center',
            },
            {
                title: '资金支出时间',
                dataIndex: 'expenditure_time_type',
                width: 220,

                align: 'center',
                editable: true,
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }}>{this.mapTime(text)}</div>

                }
            },
            {
                title: '资金支出比例',
                dataIndex: 'expend_rate',
                width: 150,
                //  ellipsis: true,
                align: 'center',
                inputType: "number",
                render: (text) => {

                    return <div style={{ textAlign: "center" }}>{text * 100 + "%"}</div>
                }

            },
        ];

        const columns = [
            {
                title: '节点名称',
                dataIndex: 'name',
                width: 200,
                ellipsis: true,
                align: 'center',
                fixed: 'left',
                editable: true
            },
            {
                title: '节点类别',
                dataIndex: 'category',
                width: 100,
                align: 'center',
                editable: true,
                render: (text) => {

                    return <div style={{ textAlign: "center" }}>{text}</div>
                }


            },
            {
                title: '开始时间',
                dataIndex: 'start_time',
                width: 150,
                align: 'center',
                editable: true,
                inputType: "time",
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }}>{moment(record.start_time).format("YYYY-MM-DD")}</div>
                }

            },
            {
                title: '结束时间',
                dataIndex: 'end_time',
                width: 150,
                align: 'center',
                editable: true,
                inputType: "time",
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }} >{moment(record.end_time).format("YYYY-MM-DD")}</div>
                }

            },

            {
                title: '成本科目',
                dataIndex: 'proj_cost_items',
                width: 200,

                align: 'center',
                editable: true,
                inputType: "multiply",
                render: (text, record) => {
                   return <TreeSelect treeData={costNodeItems} style={{ width: 180 }}
                  // treeCheckable={true}
                  defaultValue={text}
                  placeholder="请选择对应科目"
                   showCheckedStrategy={SHOW_PARENT}
                   //searchPlaceholder='请选择'
                   disabled
               ></TreeSelect>

                }
            },
            {
                title: '资金支出时间',
                dataIndex: 'expenditure_time_type',
                width: 220,

                align: 'center',
                editable: true,
                inputType: "select",
                render: (text, record) => {

                    return <div style={{ textAlign: "center" }}>{this.mapTime(text)}</div>

                }

            },
            {
                title: '资金支出比例',
                dataIndex: 'expend_rate',
                width: 150,
                //  ellipsis: true,
                align: 'center',
                editable: true,
                inputType: "number",
                render: (text) => {

                    return <div style={{ textAlign: "center" }}>{text * 100 + "%"}</div>
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
                    const { editingKey, addingNew } = this.state;
                    const editable = this.isEditing(record);

                    return editable ? (
                        <div style={{ textAlign: "center" }}>
                            <EditableContext.Consumer>
                                {form => (
                                    <a onClick={() => this.save(form, record.parent_path !== "" ? (record.parent_path + "/" + record.record_id) : (record.record_id))} style={{ marginRight: 8 }}>
                                        保存
                                        </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="确定取消修改?" onConfirm={() => this.cancel(record)}>
                                <a>取消</a>
                            </Popconfirm>
                        </div>
                    ) : (
                            <div style={{ textAlign: "center" }}>
                                <a disabled={editingKey !== '' || addingNew} onClick={() => this.edit(record.record_id)}>
                                    编辑
                                </a>
                                <Dropdown overlay={() => this.getMenu(record)} placement="bottomCenter" disabled={editingKey !== '' || addingNew}>
                                    <a style={{ marginLeft: 8 }} disabled={editingKey !== ''}
                                    // onMouseEnter={() =>this.currentClickKey(record)}
                                    >添加</a>
                                </Dropdown>
                                <Popconfirm title="确定删除?" onConfirm={() => this.deleteNode(record)}>
                                    <a style={{ marginLeft: 8 }} disabled={editingKey !== '' || addingNew}>删除</a>
                                </Popconfirm>
                            </div>
                        )
                        ;
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
                    rowKey={record => record.record_id}
                    dataSource={data}
                    columns={formType === 'E' ? ecolumns : formType === 'V' ? view_columns : null} //{view_columns}
                    pagination={false}
                    scroll={{ y: 500, x: 'calc(700px + 50%)' }}
                    rowClassName="editable-row"
                    rowClassName={() => 'editable-row'}
                    style={{ maxHeight: 500 }}
                    onExpand={this.handleOnExpand}
                    expandedRowKeys={this.state.expandedRowKeys}
                />
            </EditableContext.Provider>
        );
    }

}
export default CostExpenseNode;