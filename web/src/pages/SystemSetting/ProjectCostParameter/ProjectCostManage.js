import React, { PureComponent } from 'react';
import { Card, Table, Input, InputNumber, Form, Popconfirm, Select, Dropdown, Menu, Modal, Tag, } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';

import styles from './ProjectCostManage.less';

import { query, create, del, update } from '@/services/projectCostManage';
import { queryListNotPage } from '@/services/formatManage';
import { queryList } from '@/services/taxManage';  

const EditableContext = React.createContext();

@Form.create()
class EditableCell extends React.Component {  

    getInput = () => {  //编辑框
        if (this.props.inputType === 'number') {
            return <InputNumber min={0} style= {{ width : '90%'}}/>;
        }
        if (this.props.inputType === "select") {
            if (this.props.dataIndex == "label") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">成本科目</Select.Option>
                    <Select.Option value="2">测算科目</Select.Option>
                </Select>;
            }
            if (this.props.dataIndex == "in_land_tax") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">计入</Select.Option>
                    <Select.Option value="2">不计入</Select.Option>
                </Select>;
            }
            if (this.props.dataIndex == "status") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">启用</Select.Option>
                    <Select.Option value="2">停用</Select.Option>
                </Select>;
            }
            if (this.props.dataIndex == "calculate_type") {
                return < Select placeholder="请选择" style={{ width: '100%' }}>
                    <Select.Option value="1">单价算总价</Select.Option>
                    <Select.Option value="2">总价算单价</Select.Option>
                </Select>;
            }
            if(this.props.dataIndex == "tax_id"){
                const children1 = [];
                for(let i=0;i<this.props.taxList.length;i++){
                    children1.push(<Select.Option key={this.props.taxList[i].record_id} value={this.props.taxList[i].record_id}>{this.props.taxList[i].name}</Select.Option>);
                }
                return <Select placeholder="请选择" style={{ width: '100%' }}>
                    { children1 }
                </Select>
            }
        }

        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const { editing, dataIndex,
            title, inputType, record, index, children, required, taxList, ...restProps } = this.props;

        return (
            <td {...restProps}>
                {
                    editing ? (
                        <Form.Item style={{ margin: 0 }}>
                            {getFieldDecorator(dataIndex, {
                                rules: [
                                    {
                                        required: required,
                                        message: inputType != "select"? `请输入${title}` : `请选择${title}` ,
                                    },
                                ],
                                initialValue: inputType =='number' ? record[dataIndex] ? record[dataIndex] : 0 : record[dataIndex] ? record[dataIndex].toString() : "" ,
                            })(this.getInput())}
                        </Form.Item>
                    ) : (
                            children
                        )
                }
            </td>
        )
    };
    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    }
}

@Form.create()
class ProjectCostManage extends PureComponent {
    state = {
        formatList: [],
        taxList : [
            {
                record_id: "0000001",
                category: "",
                name: "请选择",
                calculation_formula: "",
                type: 1,
                tax_rate: 0,
                memo: "",
            },
        ],
        dataList: [
        ],
        temp_data : [],
        expandedRowKeys: [],
        editingKey: '',  
        loading : true,
        chooseBtn : '',
        level : [],
    };

    componentWillMount(){  
        let is_get_format = false;
        let is_get_tax = false;
        queryListNotPage().then(res=>{
            if(res && res.error){
                console.log(res.error.message);
            }else{
                is_get_format = true;
                const format_list = [];
                for(let i=0; i < res.list.length; i++){
                    const one={
                        title: res.list[i].name,
                        dataIndex: res.list[i].record_id,
                        key: res.list[i].record_id,
                        width: 100,
                        align: "center",
                        editable: true,
                        required: true,
                        type: "number",
                    };

                    format_list.push(one);
                    [...format_list];
                }
                this.setState( { formatList : [...format_list] } );
            }
        });

        queryList().then(res =>{
            const {
                taxList 
            } = this.state;
            const list = taxList;
            if(res && res.error){
                console.log(res.error.message);
            }else{
                is_get_tax = true;
                for(let i=0;i<res.list.length;i++){
                    list.push({...res.list[i]})
                }
                this.setState({taxList : list});
            }
        });
        this.in = setInterval(()=>{
            if(is_get_format && is_get_tax){
                clearInterval(this.in);
                this.getDataList();
            }
        },1000);
    }

    getDataList = () =>{ 
        query().then(res=>{
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                const level_arr = [];
                for(let i=1;i<=res.deep;i++){
                    level_arr.push(i);
                }
                this.setState( { dataList : res.tree, temp_data : JSON.parse(JSON.stringify(res.tree)), level : [...level_arr] } );
            }
        });
    };

    handleOnExpand = (expanded, record) => {  
        const { expandedRowKeys } = this.state;
        let expandHang = [...expandedRowKeys];
        if (expanded) {  
            if(expandHang.indexOf(record.record_id)==-1){
                expandHang.push(record.record_id);
                expandHang.sort();
            }
        } else { 
            if(record.children){
                const temp_expand = this.getExpandChildren(record);
                for( let i=0; i<temp_expand.length; i++){
                    for(let j=0; j<expandHang.length;j++){
                        if (expandHang[j] === temp_expand[i]){
                            expandHang.splice(j, 1);
                            break;
                        }
                    }
                }
            }else{
                if(expandHang.indexOf(record.record_id) !=-1){
                    let w = expandHang.indexOf(record.record_id);
                    if (w > 0) {
                        expandHang.splice(w, 1);
                    } else {
                        expandHang.splice(0, 1);
                    }
                }
            }
        }
        this.setState({ expandedRowKeys: [...expandHang] });    
    }

    getExpandChildren = ( record ) => { 
        let e_children = [];
        let i=0;
        if(record.children){
            e_children.push(record.record_id);
            for(i=0; i<record.children.length;i++){
                const children = this.getExpandChildren(record.children[i]);
                e_children.push(...children);
            }
        }
        return e_children;
    }

    brotherLevelAdd = (currentItem) => {  //----同级添加
        const { dataList } = this.state;
        let parent_id = currentItem.parent_id;
        if(parent_id == ""){  //顶级的同级添加
            let count = dataList.length;
            const newItem = {
                record_id: (count+1).toString(),
                parent_id : parent_id,
            };
            const list = this.moveAdd(newItem,dataList);
            this.setState({dataList : [...list], editingKey : (count+1).toString(), chooseBtn : "A" });
            return;
        }else{ //子级的同级添加
            let item = this.findItem(dataList,parent_id); //得到父级item
            let count = item.children.length;
            const newItem = {
                record_id: (count+1).toString(),
                parent_id : parent_id,
            };
            item.children = this.moveAdd(newItem,item.children);
            this.setState({dataList : [...dataList], editingKey : (count+1).toString(), chooseBtn : "A" });
            return;
        }  
        
    }

    childLevelAdd = (currentItem) =>{  //子级添加
        const { dataList } = this.state;
        let item = currentItem;
        let count = 0;
        if(currentItem.children){
            count = currentItem.children.length;
        }else{
            item.children = [];
        }
        const newItem = {
            record_id: (count+1).toString(),
            parent_id : currentItem.record_id,
        };
        item.children = this.moveAdd(newItem,item.children);
        this.handleOnExpand(true,item);
        this.setState({ 
            dataList : [...dataList], 
            editingKey : newItem.record_id, 
            chooseBtn : "A"
        });
        return;
    }

    findItem = (objList, key) => {  
        for(let i=0;i<objList.length;i++){
            if(key == objList[i].record_id){
                return objList[i];
            }else if(objList[i].children && objList[i].children.length > 0){
                this.findItem(objList[i].children, key);
            }
        }
    }

    moveAdd = (item, arr) => { 
        const data = arr;
        if(data.length==0){
            data.push(item);
        }else{
            for(let i=data.length-1;i>=0;i--){
                data[i+1] = data[i];
            }
            data[0]= item;
        }
        return data;
    }

    getMenu = (record) => { 
        return (
        <Menu >
          <Menu.Item onClick={() => this.brotherLevelAdd(record)} >
            同级添加
          </Menu.Item>
        
          <Menu.Item onClick={() => this.childLevelAdd(record)} >
            下级添加
          </Menu.Item>
        </Menu>);
    };

    save = (form, record) => {
        const { chooseBtn, formatList, dataList, temp_data } = this.state;
        form.validateFields((err, row) => {
            if (err) {
                return;
            }
            this.setState({ loading : true });
            const getRow = {...row};
            let parent_id = record.parent_id ? record.parent_id : "";
            let paramsAdd = {};
            if(chooseBtn == "A"){
                paramsAdd = {
                    business_list : [],
                    calculate_type : 0 ,
                    in_land_tax : 0,
                    label : 0,
                    name : "",
                    parent_id : parent_id,
                    status : 0,
                    tax_id : "",
                };
            }
            if(chooseBtn == "E"){
                paramsAdd = {
                    record_id : '',
                    business_list : [],
                    calculate_type : 0 ,
                    in_land_tax : 0,
                    label : 0,
                    name : "",
                    parent_id : parent_id,
                    status : 0,
                    tax_id : "",
                    children : [],
                };
            }
            let formats = { business_id : "", unit_price : 0 };
            for(let i=0; i < formatList.length;i++){
                let formats = { business_id : "", unit_price : 0 };
                formats.business_id = formatList[i].dataIndex;
                formats.unit_price =  (row[formatList[i].dataIndex]) * 1;
                paramsAdd.business_list.push(formats);
            }
            paramsAdd.business_list = [...paramsAdd.business_list];
            paramsAdd.calculate_type = parseInt(getRow.calculate_type);
            paramsAdd.in_land_tax = parseInt(getRow.in_land_tax);
            paramsAdd.label = parseInt(getRow.label);
            paramsAdd.name = getRow.name;
            paramsAdd.status = parseInt(getRow.status);
            if(getRow.tax_id === '0000001'){
                paramsAdd.tax_id = '';
            }else{
                paramsAdd.tax_id = getRow.tax_id;
            }
            paramsAdd = {...paramsAdd};
            if(chooseBtn == "A"){//添加
                create(paramsAdd).then(res => {
                    this.setState({ loading : false });
                    if(res && res.error){
                        console.log(res.error.message);
                        this.setState({ dataList : JSON.parse(JSON.stringify(temp_data)) });
                    }else{
                        this.getDataList();
                    }
                })
            }
            if(chooseBtn == "E"){
                paramsAdd.record_id = record.record_id;
                paramsAdd.children = record.children ? record.children : [];
                paramsAdd = {...paramsAdd};
                update(paramsAdd).then(res=>{
                    this.setState({ loading : false });
                    if(res && res.error){
                        console.log(res.error.message);
                    }else{
                        this.getDataList();
                    }
                })
            }
            this.setState({ editingKey: "" });
        });
    }
    cancel = () => {  
        const { temp_data, chooseBtn } = this.state;
        if(chooseBtn =='A'){ //添加的操作
            this.setState({ dataList : JSON.parse(JSON.stringify(temp_data)) });
        }
        this.setState({ editingKey: "" });
    }

    edit = (rid) => {  
        this.setState({ editingKey: rid, chooseBtn : "E" });
    }

    //删除按钮
    handleDelClick = (record) => {
        let title_mess = "确定删除该成本？";
        if(record.children){
            title_mess = "该成本含有子项，删除后子项将一起删除，是否删除？"
        }
        Modal.confirm({
            title: title_mess,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: this.handleDelOKClick.bind(this, record),
        });
    };

    handleDelOKClick(params) {
        this.setState({ loading : true });
        del(params).then( res => {
            this.setState({ loading : false });
            if( res && res.status == "OK" ){
                this.getDataList();
                this.handleOnExpand(false,params);
            }else{
                if(res && res.error){
                    console.log(res.error.message);
                }
            }
        });
    }

    isEditing = record => record.record_id === this.state.editingKey;

    mapEditColumns = columns => {
        const { taxList } = this.state;
        const ecolumns = [];
        columns.forEach(item => {
          const eitem = { ...item };
          if (eitem.editable) {
            eitem.onCell = record => ({
              record,
              inputType: item.type, 
              dataIndex: item.dataIndex,
              title: item.title,
              editing: this.isEditing(record),
              required: item.required,
              taxList : taxList,
            });
          }
    
          if (eitem.children) {
            eitem.children = this.mapEditColumns(eitem.children);
          }
          ecolumns.push(eitem);
        });
        return ecolumns;
    };

    handleTag = ( tag ) => {   //编辑和添加的时候是无法进行操作的，置灰操作,还有收起的操作
        const { dataList } = this.state;
        const arr =this.getLevel(tag,dataList);
        this.setState({ expandedRowKeys : [...arr] });
    }

    getLevel = ( tag, list ) =>{
        let expandList = [];
        let i=0;
        for( i=0; i<list.length; i++ ){
            if(list[i].children){
                if(list[i].level != tag){
                    expandList.push(list[i].record_id);
                    const children = this.getLevel( tag, list[i].children);
                    expandList.push(...children);
                }
                
            }
        }
        return expandList;
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const breadcrumbList = [
            { title: "基础设定" },
            { title: "系统设定" },
            { title: "成本科目" }
        ];
        
        const { dataList, expandedRowKeys, formatList, taxList, loading, level, editingKey } = this.state;

        const columns = [
            {
                title: "科目名称",
                dataIndex: "name",
                key: "name",
                width: 200,
                editable: true,
                required: true,
                type: "text",
                // fixed: 'left',
            },
            {
                title: "科目类别",
                dataIndex: "label",
                key: "label",
                width: 150,
                editable: true,
                align: "center",
                required: true,
                type: "select",
                render: data => {
                    return data == 1 ? "成本科目" : "测算科目";
                }
            },
            {
                title: "税种",
                dataIndex: "tax_id",
                key: "tax_id",
                width: 200,
                align: "center",
                editable: true,
                required: false,
                type: "select",
                render : data =>{
                    if(data){
                        for(let i=0;i<taxList.length;i++){
                            if(taxList[i].record_id == data){
                                return taxList[i].name;
                            }
                        }
                    }else{
                        return '';
                    }
                    
                }
            },
            {
                title: '单价',
                dataIndex: 'unit_price',
                key: "unit_price",
                align: "center",
                children: formatList,
            },
            
            {
                title: "计算方式",
                dataIndex: "calculate_type",
                key: "calculate_type",
                width: 150,
                editable: true,
                align: 'center',
                required: true,
                type: "select",
                render: data => {
                    return data == 1 ? "单价算总价" : "总价算单价";
                }
            },
            {
                title: "计入土地增值税扣除项",
                dataIndex: "in_land_tax",
                key: "in_land_tax",
                width: 180,
                editable: true,
                align: 'center',
                required: true,
                type: "select",
                render: data => {
                    return data == 1 ? "计入" : "不计入";
                }
            },
            {
                title: "状态",
                dataIndex: "status",
                key: "status",
                width: 100,
                align: "center",
                editable: true,
                required: true,
                type: "select",
                render : data => {
                    return data == 1 ?  <Tag color='blue'>启用</Tag> : <Tag color='red'>停用</Tag>;
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 300,
                align: "center",
                fixed: 'right',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);  // 判断该行是否是要编辑的那一行
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        onClick={() => this.save(form, record)}
                                        style={{ marginRight: 8 }}
                                    >
                                        保存
                            </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="确定要取消操作?" onConfirm={() => this.cancel()}>
                                <a>取消</a>
                            </Popconfirm>
                        </span>
                    ) :
                        (
                            <div className={styles.operation}>
                                {/* 没有点击编辑的状态 */}
                                <PButton disabled={editingKey !== ''} key="add" code="add" style={{ marginLeft: 8 }}>
                                    <Dropdown overlay={() => this.getMenu(record)} placement="bottomCenter">
                                        <a>新建</a>
                                    </Dropdown>
                                    {/* 新建 */}
                                </PButton>
                                <PButton disabled={editingKey !== ''} key="edit" code="edit" style={{ marginLeft: 8 }}
                                    onClick={() => this.edit(record.record_id)}
                                >
                                    编辑
                                </PButton>

                                <PButton disabled={editingKey !== ''} key="del" code="del" style={{ marginLeft: 8 }}
                                    onClick = {() => { this.handleDelClick(record) }}
                                >
                                    删除
                                </PButton>
                            </div>

                        );
                },
            }
        ];
        const eColumns = this.mapEditColumns(columns);

        return (
            <PageHeaderLayout title="成本科目" breadcrumbList={breadcrumbList}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/* <div className={styles.tableListForm}>{this.renderSearchForm()}</div>*/}
                        <div className={styles.tableListOperator}>
                            控制科目列表 
                            <span>
                                {   editingKey == '' ?
                                        level.map(item => 
                                            <Tag key={item} color = 'blue'
                                                onClick={() => this.handleTag(item)}
                                            >
                                                {item}
                                            </Tag>
                                    )
                                    :
                                        level.map(item => 
                                            <Tag key={item}>
                                                {item}
                                            </Tag>
                                    )
                                } 
                            </span>
                        </div> 
                        <EditableContext.Provider value={this.props.form}>
                            <Table
                                components={components}
                                expandedRowKeys={expandedRowKeys}
                                columns={eColumns}
                                loading = { loading }
                                dataSource={dataList}
                                rowKey={record => record.record_id}
                                pagination={false}
                                onExpand={this.handleOnExpand}
                                scroll={{ x: 1500, y: 800 }}
                                rowClassName="editable-row"
                                bordered = { true }
                            >

                            </Table>
                        </EditableContext.Provider>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}

// const ProjectCostManage = Form.create()(EditableTable);

export default ProjectCostManage;