import React, { PureComponent } from 'react';
import { Table, Card, TreeSelect,Tag } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DynamicCostProjDetail from './DynamicCostProjDetail';
import { getDynamicCostProj } from '@/services/dynamicCostProj';

@connect(state =>({
    costAccount: state.costAccount,
}))
class DynamicCostProj extends PureComponent{

    state = {
        projectID : '',
        data :[
        ],
        loading : false,
        formVisiable : false,
        seeInfo : null,
        expandedRowKeys : [],
        deep : [],
    };

    componentWillMount(){
        this.dispatch({  
            type: 'costAccount/queryProTree',
            payload: {}
        });
    };

    dispatch = action => {
        const { dispatch } = this.props;
        dispatch(action);
    };

    formateTree(list) {  //项目列表处理
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!item.selectable) {
                item.title = <span style={{ color: '#cccccc' }}>{item.title}</span>;
            }
            if (item.children && item.children.length > 0) {
                this.formateTree(item.children);
            }
        }
    }

    handleProChange = (value, label) => {
        this.setState({ projectID : value, loading : true });
        const param = { projectID : value }
        getDynamicCostProj(param).then(res => {
            this.setState({ loading : false });
            if(res && res.error){
                console.log(res.error.message);
            }else{
                const d_arr = [];
                this.setState({ data : res.list });
                for(let i=1;i<=res.deep;i++){
                    d_arr.push(i);
                }
                this.setState({ deep : d_arr });
            }
        });
    }

    handleSeeDetail = record => {
        this.setState({ formVisiable : true, seeInfo : record});
    };

    cancel = () => {
        this.setState({ formVisiable : false, seeInfo : null });
    };

    handleOnExpand = (expanded, record) => {
        const { expandedRowKeys } = this.state;
        let expand_temp = [...expandedRowKeys];
        if(expanded){ //展开
            if(expand_temp.indexOf(record.proj_cost_id)==-1){
                expand_temp.push(record.proj_cost_id);
                expand_temp.sort();
            }
        }else{ //收起
            //TODO去除该项下的展开的子级。
            const children_arr = this.getExpandChildren(record);
            for( let i=0; i<children_arr.length; i++){
                for(let j=0; j<expand_temp.length;j++){
                    if (expand_temp[j] === children_arr[i]){
                        expand_temp.splice(j, 1);
                        break;
                    }
                }
            }
        }
        this.setState({ expandedRowKeys : [...expand_temp]});
    }

    getExpandChildren = ( record ) => { 
        let e_children = [];
        let i=0;
        if(record.children){
            e_children.push(record.proj_cost_id);
            for(i=0; i<record.children.length;i++){
                const children = this.getExpandChildren(record.children[i]);
                e_children.push(...children);
            }
        }
        return e_children;
    }

    handleTag = (item) => {
        const {
            data,
        } = this.state;
        const arr = this.getExpandId( item, data);
        this.setState({ expandedRowKeys : arr });
    }

    //控制展开显示的列表
    getExpandId = ( tag, dataList ) => {
        let expand_arr = [];
        for(let i=0; i<dataList.length; i++ ){
            if(dataList[i].level < tag && dataList[i].children){
                expand_arr.push(dataList[i].proj_cost_id);
                const children = this.getExpandId(tag,dataList[i].children);
                expand_arr.push(...children);
            }
        }
        return expand_arr;
    }
    
    render(){

        const { data, loading, formVisiable, seeInfo, projectID, expandedRowKeys, deep } = this.state;

        const breadcrumbList = [
            { title : '成本管理'},
            { title : '动态成本'},
        ];

        const columns = [
            {
                title : '科目名称',
                dataIndex : 'cost_name',
                key : 'cost_name',
                width : 200,
            },
            {
                title : '目标金额',
                dataIndex : 'target_cost',
                key : 'target_cost',
                width : 100,
                align : 'center',
            },
            {
                title : '结算金额',
                dataIndex : 'settled',
                key : 'settled',
                width : 100,
                align : 'center',
            },
            {
                title : '待结算金额',
                dataIndex : 'unsettled',
                key : 'unsettled',
                width : 100,
                align : 'center',
            },
            {
                title : '在途金额',
                dataIndex : 'on_approval',
                key : 'on_approval',
                width : 100,
                align : 'center',
            },
            {
                title : '剩余规划金额',
                dataIndex : 'left_plan_amount',
                key : 'left_plan_amount',
                width: 100,
                align : 'center',

            },
            {
                title : '最终成本',
                dataIndex : 'all',
                key : 'all',
                width: 100,
                align : 'center',
            },
            {
                title : '调动金额',
                dataIndex : 'transfer',
                key : 'transfer',
                width : 100,
                align : 'center',
            },
            {
                title : '余额',
                dataIndex : 'balance',
                key : 'balance',
                width : 100,
                align : 'center',
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : 100,
                align : 'center',
                fixed : 'right',
                render : (text,record) => {
                    return (
                        <a onClick={ () => { this.handleSeeDetail(record)}}>查看</a>
                    )
                }
            },
        ];

        const {
            costAccount:{ projectTreeData },
        } = this.props;
        this.formateTree(projectTreeData);

        return(
            <div>
                {
                (projectID && projectID != "") ?
                    <PageHeaderLayout title={<div>
                        <span>当前项目：</span>
                        <TreeSelect
                            value={ projectID }
                            treeData = { projectTreeData }
                            style = {{ width : 200 }}
                            onChange={this.handleProChange}
                        >
        
                        </TreeSelect>
                    </div>} breadcrumbList={breadcrumbList}>
                    <Card bordered={false}>
                        <div className='tableList'>
                            <div className='tableListOperator' style={{ marginBottom : '16px'}}>
                                控制科目列表
                                <span style={{ marginLeft : '8px' }}>
                                {
                                    deep && deep.map(item => 
                                        <Tag key={item} color = 'blue' onClick={() => this.handleTag(item)}>{item}</Tag>
                                    )
                                }
                                </span>
                            </div>
                            <Table
                                columns = { columns }
                                expandedRowKeys={expandedRowKeys}
                                dataSource = { data }
                                rowKey={ record => record.proj_cost_id }
                                pagination={false}
                                bordered = { true }
                                scroll  = { { x : 1500, y : 800 } }
                                loading = { loading }
                                onExpand={this.handleOnExpand}
                            >    

                            </Table>
                        </div>
                    </Card>
                    {
                        formVisiable &&
                        <DynamicCostProjDetail cancel={this.cancel} formVisiable={formVisiable} info={seeInfo} projectID={projectID}></DynamicCostProjDetail>
                    }
                </PageHeaderLayout>
                :
                <PageHeaderLayout title={<div>
                    <span>当前项目：</span>
                    <TreeSelect
                        value={ projectID }
                        treeData = { projectTreeData }
                        style = {{ width : 200 }}
                        onChange={this.handleProChange}
                    >

                    </TreeSelect>
                </div>} breadcrumbList={breadcrumbList}>
                    <Card bordered={false} style={{ height : 500 }}>
                    </Card>
                </PageHeaderLayout>
            }
            </div>
        )
    }
}

export default  DynamicCostProj;