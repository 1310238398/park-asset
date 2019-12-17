import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Card,
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
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import styles from './ContractSigning.less';
const FormItem = Form.Item;
@connect(state => ({
  contractSiging: state.contractSiging,
  contractSupplement: state.contractSupplement,
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSupplementAdd extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };
  componentDidMount() {
    const {
      contractSiging: { formID },
    } = this.props;
    this.props.dispatch({
      type: 'contractSiging/fetch',
      search: {},
      pagination: {},
      pro_id: formID,
    });
  }
   // 选择checkbox 事件
   handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };
   // 取消选中的复选框
    clearSelectRows = () => {
      const { selectedRowKeys } = this.state;
      if (selectedRowKeys.length === 0) {
        return;
      }
      this.setState({ selectedRowKeys: [], selectedRows: [] });
    };
    // 新增结算信息
    handleAddClick = () =>{
      console.log("新增")
    }
    // 编辑结算信息
    handleEditClick = item =>{
      console.log("编辑")
      console.log(item)
    }

    // 删除结算信息
    handleDelClick = item =>{
      console.log("删除")
      console.log(item)
    }

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const {
      loading,
      form: { getFieldDecorator },
      contractSiging: {
        formTypeSiging,
        dataSiging: { list, pagination },
      },
    } = this.props;
    const columns = [
      {
        title: '报告编号',
        dataIndex: 'index',
        width: 100,
      },
      {
        title: '报告名称',
        dataIndex: 'date',
        width: 150,
      },
      {
        title: '送审值',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '其中甲供金额',
        dataIndex: 'sex',
        width: 150,
      },

      {
        title: '审定值',
        dataIndex: 'tags',
        width: 150,
      },
      {
        title: '其中甲供金额',
        dataIndex: 'age',
        width: 150,
      },
      {
        title: '审减率',
        dataIndex: 'ye',
        width: 150,
      },
      {
        title: '报告日期',
        dataIndex: 'rq',
        width: 150,
      },
      {
        title: '咨询造价单位',
        dataIndex: 'dw',
        width: 150,
      },
      {
        title: '经办人',
        dataIndex: 'jbr',
        width: 150,
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const data = [
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b542',
        index: '1',
        date: '2019-10-22',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
        sex: 'nan',
        ye: 233,
        rq: '2019-10-10',
        dw: 'sss',
        jbr: 'ddd',
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b541',
        index: '2',
        date: '2019-10-22',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
        sex: 'nan',
        ye: 555,
        rq: '2019-10-10',
        dw: 'sss',
        jbr: 'ddd',
      },
      {
        record_id: '6cc5f9d-62d3-4367-8197-c7d02557b54e',
        index: '3',
        date: '2019-10-22',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        sex: 'nan',
        ye: 333,
        rq: '2019-10-10',
        dw: 'sss',
        jbr: 'ddd',
      },
    ];

    return (
      <div className={styles.addSuplementList}>
        <Card bordered={false}>
          <div className={styles.addSuplementBtn}>
            <PButton
              code="add"
              icon="plus"
              type="primary"
              onClick={() => this.handleAddClick()}
            >
              新增
            </PButton>
            {selectedRows.length === 1 && [
              <PButton
                key="edit"
                code="edit"
                icon="edit"
                onClick={() => this.handleEditClick(selectedRows[0])}
              >
                编辑
              </PButton>,
              <PButton
                key="delete"
                code="delete"
                icon="delete"
                type="danger"
                onClick={() => this.handleDelClick(selectedRows[0])}
              >
                删除
              </PButton>,
            ]}
          </div>
          <div className={styles.tableList}>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                dataSource={data}
                columns={columns}
                pagination={false}
                scroll={{ x: 1000 }}
              ></Table>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
export default ContractSupplementAdd;
