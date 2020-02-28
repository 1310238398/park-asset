import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Dropdown , Menu, Icon} from 'antd';
import styles from '../../ProjectManage/ProjectManage.less';
import NewNode from './NewNode';

const { SubMenu } = Menu;
@connect(state => ({
  entrustedConstruction: state.entrustedConstruction,

  loading: state.loading.models.entrustedConstruction,
}))
class Node extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };
  componentDidMount = () => {};

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log('handleSelect ');

    let rows = [];
    let keys = [];
    if (selected) {
      rows.push(record);
      keys.push(record.record_id);

      this.setState({
        selectedRowKeys: [...keys],
        selectedRows: [...rows],
      });
    } else {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
  };

  createNew(record_id, add_type) {
   
    this.dispatch({
      type: 'entrustedConstruction/saveNewNodeFormVisible',
      payload:true,
    
    });

    this.dispatch({
      type: 'entrustedConstruction/saveAddNodeType',
      payload:add_type,
    
    });
    this.dispatch({
      type: 'entrustedConstruction/saveAddNodeRecordID',
      payload:record_id,
    
    });



  }

  editNode = (record_id) =>  {
    console.log("编辑节点");
    this.dispatch({
      type: 'entrustedConstruction/saveNewNodeFormVisible',
      payload:true,
    
    });
  }

  // 向上级提交完成节点申请
  applyFinish = () => {

  }

  editMenu = record => {
    return (
      <Menu>
        <SubMenu title="新建">
          <Menu.Item onClick={() =>  this.createNew(record, "up")}>向上添加</Menu.Item>
          <Menu.Item onClick={() =>  this.createNew(record, "down")}>向下添加</Menu.Item>
        </SubMenu>
       
          <Menu.Item onClick={() =>  this.editNode(record)}>编辑</Menu.Item>
         
        
        
          <Menu.Item onClick={() =>  this.editNode(record)}>查看</Menu.Item>
        
        <Menu.Item onClick={() =>  {}}>删除</Menu.Item>
        <Menu.Item onClick={() =>  {}}>完成申请</Menu.Item>
      </Menu>
    );
  };

  newNode = () => {
    return <NewNode></NewNode>
  }
  render() {
    const {
      loading,
      entrustedConstruction: {
        data: { pagination },
        formType,
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return (
            <Dropdown overlay={() => this.editMenu(record)} placement="bottomCenter">
              <Button>操作<Icon type="down" /></Button>
            </Dropdown>
          );
        },
      },
      {
        title: '节点名称',
        dataIndex: 'contract_node',
        width: 200,
        align: 'center',
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        width: 150,
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'end_time',
        width: 150,
        align: 'center',
      },
      {
        title: '执行状态',
        dataIndex: 'execute_status',
        width: 150,
        align: 'center',
      },
      {
        title: '负责人',
        dataIndex: 'person',
        width: 150,
        align: 'center',
      },
    ];

    const list = [
      {
        record_id: '01',
        contract_node: '节点名称',
        start_time: '节点开始执行时间',
        end_time: '节点执行完成时间',
        execute_status: '节点的执行状态',
        person: '负责人',
      },
      {
        record_id: '02',
        contract_node: '节点名称',
        start_time: '节点开始执行时间',
        end_time: '节点执行完成时间',
        execute_status: '节点的执行状态',
        person: '负责人',
      },
      {
        record_id: '03',
        contract_node: '节点名称',
        start_time: '节点开始执行时间',
        end_time: '节点执行完成时间',
        execute_status: '节点的执行状态',
        person: '负责人',
      },
      {
        record_id: '04',
        contract_node: '节点名称',
        start_time: '节点开始执行时间',
        end_time: '节点执行完成时间',
        execute_status: '节点的执行状态',
        person: '负责人',
      },
    ];
    return (
      <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
        <div className={styles.tableList}>
          <div style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span>当前状态：</span>
              <span>未提交</span>
              <span style={{ color: 'yellow' }}>审核中</span>
              <span style={{ color: 'red' }}>审核未通过</span>
              <span style={{ color: 'blue' }}>审核已通过</span>
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => this.handleAddClick()}
                style={{ marginLeft: 10 }}
              >
                提交审核
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleAddClick()}
                style={{ marginLeft: 10 }}
              >
                通过审核
              </Button>
              <Button
                type="danger"
                onClick={() => this.handleAddClick()}
                style={{ marginLeft: 10 }}
              >
                驳回审核
              </Button>
            </div>
          </div>
          <Table
            // rowSelection={{
            //   selectedRowKeys,
            //   //  onChange: this.handleTableSelectRow,
            //   // type: "radio",
            //   onSelect: this.handleSelect,
            // }}
            loading={loading}
            rowKey={record => record.record_id}
            dataSource={list}
            columns={columns}
            scroll={{ y: 500 }}
            pagination={false} //{paginationProps}
            // onChange={this.handleTableChange}
          ></Table>
        </div>
        {
          this.newNode()
        }
      </Card>
    );
  }
}
export default Node;
