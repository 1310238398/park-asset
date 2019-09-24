import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Table, Modal } from 'antd';
import PButton from '@/components/PermButton';
import AssetUnitEditMaint from './AssetUnitEditMaint';
import AssetUnitShowMaint from './AssetUnitShowMaint';
import styles from './AssetDataMaint.less';

@connect(state => ({
  assetDatamaint: state.assetDatamaint,
  loading: state.loading.models.assetDatamaint,
}))
@Form.create()
class AssetUnitMaint extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    // const { recordID } = this.props.location.query;
    this.dispatch({
      type: 'assetDatamaint/fetchUnit',
      search: { building_type: 2 },
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

  // 新增单元
  handleAddClick = () => {
    this.dispatch({
      type: 'assetDatamaint/LoadUnit',
      payload: {
        type: 'A',
      },
    });
  };

  // 编辑单元
  handleEditClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'assetDatamaint/LoadUnit',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  // 删除单元
  handleDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【单元数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  // 查看单元
  handleSeeClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'assetDatamaint/LoadUnit',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 关闭弹窗
  handleFormCancel = () => {
    this.dispatch({
      type: 'assetDatamaint/changeFormVisibleUnit',
      payload: false,
    });
  };

  // 提交数据
  handleFormSubmit = data => {
    this.dispatch({
      type: 'assetDatamaint/submitUnit',
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

  // 显示弹窗
  renderDataForm() {
    const {
      assetDatamaint: { formTypeUnit },
    } = this.props;
    if (formTypeUnit === 'A' || formTypeUnit === 'E') {
      return (
        <AssetUnitEditMaint onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />
      );
    }
    if (formTypeUnit === 'S') {
      return <AssetUnitShowMaint onCancel={this.handleFormCancel} />;
    }
    return <React.Fragment></React.Fragment>;
  }

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
        title: '单元号',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '是否整单元出租',
        dataIndex: 'is_all_rent',
        width: 200,
      },
      {
        title: '出租状态',
        dataIndex: 'rent_status',
        width: 150,
      },
      {
        title: '建筑面积（㎡）',
        dataIndex: 'building_area',
        width: 150,
      },
      {
        title: '已租面积（㎡）',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '出租率',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '未租面积（㎡）',
        dataIndex: 'asset_type',
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
      <div>
        <Card>
          <div>
            <p>A3-5</p>
            <Row type="flex" justify="start">
              <Col span={4}>单元数：3</Col>
              <Col span={4}>楼层数：2</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={4}>建筑面积（㎡）：1</Col>
              <Col span={4}>已租面积（㎡）：2</Col>
              <Col span={4}>出租率：1%</Col>
              <Col span={4}>未租面积（㎡）：2</Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <PButton
                code="addUnit"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                新建单元
              </PButton>

              {selectedRows.length === 1 && [
                <PButton
                  key="editUnit"
                  code="editUnit"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="delUnit"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                <PButton code="queryUnit" onClick={() => this.handleSeeClick(selectedRows[0])}>
                  查看
                </PButton>,
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
                onRow={record => {
                  return {
                    onClick: () => {
                      this.onItemDetailClick(record);
                    },
                  };
                }}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </div>
    );
  }
}

export default AssetUnitMaint;
