import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Table, Modal } from 'antd';
import PButton from '@/components/PermButton';
import PayEdit from './PayEdit';
import RentEdit from './RentEdit';

import styles from '../AssetDataMaint.less';

@connect(state => ({
  assetDatamaint: state.assetDatamaint,
  loading: state.loading.models.assetDatamaint,
}))
@Form.create()
class RentInformation extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'assetDatamaint/fetch',
      search: {},
      pagination: {},
    });
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 租金
  handleAddZJClick = () => {
    this.dispatch({
      type: 'assetDatamaint/loadFormZJ',
      payload: {
        type: 'AZJ',
      },
    });
  };

  // 缴费
  handleAddJFClick = () => {
    this.dispatch({
      type: 'assetDatamaint/loadFormZJ',
      payload: {
        type: 'AJF',
      },
    });
  };

  handleEditClick = item => {
    this.dispatch({
      type: 'assetDatamaint/loadFormZJ',
      payload: {
        type: 'EJF',
        id: item.record_id,
      },
    });
  };

  handleDelClick = item => {
    Modal.confirm({
      title: `确定删除【租金数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  handleTableSelectRow = (selectedRowKeys, selectedRows) => {
    let keys = [];
    let rows = [];
    if (selectedRowKeys.length > 0 && selectedRows.length > 0) {
      keys = [selectedRowKeys[selectedRowKeys.length - 1]];
      rows = [selectedRows[selectedRows.length - 1]];
    }
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  handleTableChange = pagination => {
    this.dispatch({
      type: 'assetDatamaint/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    this.dispatch({
      type: 'assetDatamaint/fetch',
      search: {},
      pagination: {},
    });
  };

  handleDataFormSubmit = data => {
    this.dispatch({
      type: 'assetDatamaint/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDataFormCancel = () => {
    this.dispatch({
      type: 'assetDatamaint/changeFormVisible',
      payload: false,
    });
  };

  handleJFCancel = () => {
    this.dispatch({
      type: 'assetDatamaint/changeFormVisibleJF',
      payload: false,
    });
  };

  handleJFSubmit = data => {
    this.dispatch({
      type: 'assetDatamaint/submitJF',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleZJCancel = () => {
    this.dispatch({
      type: 'assetDatamaint/changeFormVisibleZJ',
      payload: false,
    });
  };

  handleZJSubmit = data => {
    this.dispatch({
      type: 'assetDatamaint/submitZJ',
      payload: data,
    });
    this.clearSelectRows();
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'assetDatamaint/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  renderDataFormZJ = () => {
    const {
      assetDatamaint: { formTypeJF },
    } = this.props;
    if (formTypeJF === 'AJF' || formTypeJF === 'EJF') {
      return <PayEdit onCancel={this.handleJFCancel} onSubmit={this.handleJFSubmit} />;
    }
    if (formTypeJF === 'AZJ') {
      return <RentEdit onCancel={this.handleZJCancel} onSubmit={this.handleZJSubmit} />;
    }

    return <React.Fragment></React.Fragment>;
  };

  render() {
    const {
      loading,
      assetDatamaint: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRowKeys, selectedRows } = this.state;

    const columns = [
      {
        title: '缴费周期',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '应收金额（元）',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '缴费期限',
        dataIndex: 'memo',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <PButton
                code="add"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddZJClick()}
              >
                新增租金
              </PButton>
              {selectedRows.length === 1 && [
                <Button
                  code="add"
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleAddJFClick()}
                >
                  已缴费
                </Button>,
                <Button
                  key="edit"
                  code="edit"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </Button>,
                <Button
                  key="del"
                  code="del"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </Button>,
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                loading={loading}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataFormZJ()}
        {this.renderDataFormJF()}
      </div>
    );
  }
}

export default RentInformation;
