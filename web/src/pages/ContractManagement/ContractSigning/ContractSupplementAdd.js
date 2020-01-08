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
  loading: state.loading.models.contractSiging,
}))
@Form.create()
class ContractSupplementAdd extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      selectData: [],
    };
  }
 

  componentDidMount() {
    const { formID } = this.props;
    this.props.dispatch({
      type: 'contractSiging/fetchSettlemet',
      search: {},
      pagination: {},
      record_id: formID,
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
  handleAddClick = () => {
    const { callback } = this.props;
    callback();
    this.clearSelectRows();
  };

  // 编辑结算信息
  handleEditClick = item => {
    const { callback } = this.props;
    callback(item);
    // this.clearSelectRows();
  };

  // 删除结算信息
  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【结算数据：${item.report_name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item),
    });
  };
  // 删除结算信息
  handleDelOKClick(item) {
    this.props.dispatch({
      type: 'contractSiging/delSettlement',
      payload: { record_id: item.record_id, comcontract_id: item.comcontract_id },
    });
    this.clearSelectRows();
  }

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const {
      loading,
      form: { getFieldDecorator },
      contractSiging: {
        formTypeSiging,
        dataSupplement: { list, pagination },
      },
    } = this.props;
    const columns = [
      {
        title: '报告编号',
        dataIndex: 'report_no',
        width: 100,
      },
      {
        title: '报告名称',
        dataIndex: 'report_name',
        width: 150,
      },
      {
        title: '送审值',
        dataIndex: 'songshen',
        width: 150,
      },
      {
        title: '其中甲供金额',
        dataIndex: 'songshen_jiagongg',
        width: 150,
      },

      {
        title: '审定值',
        dataIndex: 'shending',
        width: 150,
      },
      {
        title: '其中甲供金额',
        dataIndex: 'shending_jiagong',
        width: 150,
      },
      {
        title: '审减率',
        dataIndex: '',
        width: 150,
      },
      {
        title: '报告日期',
        dataIndex: 'report_date',
        width: 150,
      },
      {
        title: '咨询造价单位',
        dataIndex: 'zaojiazixun',
        width: 150,
      },
      {
        title: '经办人',
        dataIndex: 'zaojiazixun_jingban',
        width: 150,
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };
    return (
      <div className={styles.addSuplementList}>
        <Card bordered={false}>
          <div className={styles.addSuplementBtn}>
            <PButton code="add" icon="plus" type="primary" onClick={() => this.handleAddClick()}>
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
                dataSource={list}
                columns={columns}
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
