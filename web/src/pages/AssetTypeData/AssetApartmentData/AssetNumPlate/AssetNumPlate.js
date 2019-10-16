import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Table, Modal, Tag, Button } from 'antd';
import PButton from '@/components/PermButton';
import AssetNumPlateEdit from './AssetNumPlateEdit';
// import AssetFloorShowMaint from './AssetFloor/AssetFloorShowMaint';
import styles from '../../AssetBuildData/AssetBuildData.less';

@connect(state => ({
  assetApartmentData: state.assetApartmentData,
  loading: state.loading.models.assetApartmentData,
}))
@Form.create()
class AssetNumPlate extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const {
      location: {
        query: { recordID, projectID },
      },
    } = this.props;
    this.dispatch({
      type: 'assetApartmentData/fetchPlate',
      search: { building_type: 4, project_id: projectID, parent_id: recordID },
      pagination: {},
    });

    this.dispatch({
      type: 'assetApartmentData/fetchFormFloor',
      payload: { record_id: recordID },
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

  // 新增楼层
  handleAddClick = () => {
    const {
      location: {
        query: { projectID },
      },
    } = this.props;
    this.dispatch({
      type: 'assetApartmentData/LoadPlate',
      payload: {
        type: 'A',
        inProjectID: projectID,
      },
    });
  };

  // 编辑楼层
  handleEditClick = () => {
    const {
      location: {
        query: { projectID },
      },
    } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'assetApartmentData/LoadPlate',
      payload: {
        type: 'E',
        id: item.record_id,
        inProjectID: projectID,
      },
    });
  };

  // 删除楼层
  handleDelClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    Modal.confirm({
      title: `确定删除【门牌数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleDelOKClick.bind(this, item.record_id),
    });
  };

  // 查看楼层
  handleSeeClick = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    const item = selectedRows[0];
    this.dispatch({
      type: 'assetApartmentData/LoadPlate',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 关闭弹窗
  handleFormCancel = () => {
    this.dispatch({
      type: 'assetApartmentData/changeFormVisiblePlate',
      payload: false,
    });
  };

  // 提交数据
  handleFormSubmit = data => {
    this.dispatch({
      type: 'assetApartmentData/submitPlate',
      payload: data,
    });
    this.clearSelectRows();
  };

  // 判断数值
  statusValue = value => {
    if (value && value !== 0) {
      return value / 100;
    }
    return 0;
  };

  // 出租率
  statusLv = value => {
    if (value.is_all_rent === 1) {
      if (value.rent_status !== 3) {
        return 0;
      }
      return <span>100%</span>;
    }
    return <span>{value.rent_area}</span>;
  };

  // 计算已租面积
  statusArea = value => {
    if (value.is_all_rent === 1) {
      if (value.rent_status !== 3) {
        return 0;
      }
      return -1;
    }
    return <span>{this.statusValue(value.rent_area)}</span>;
  };

  // 计算未租面积
  statusTorentArea = value => {
    if (value.is_all_rent === 1) {
      if (value.rent_status !== 3) {
        return 0;
      }
      return -1;
    }
    return <span>{this.statusValue(value.rent_area)}</span>;
  };

  //  未租1	锁定2	已租3
  getRentStatus = value => {
    if (value.rent_status === 3) {
      return '已租';
    }
    if (value.rent_status === 2) {
      return '锁定';
    }
    return '出租中';
  };

  handleDelOKClick(id) {
    this.dispatch({
      type: 'assetApartmentData/delPlate',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  // 显示弹窗
  renderDataForm() {
    const {
      assetApartmentData: { formTypePlate },
      location: {
        query: { currentName, loudong },
      },
    } = this.props;
    if (formTypePlate === 'A' || formTypePlate === 'E') {
      return (
        <AssetNumPlateEdit
          onCancel={this.handleFormCancel}
          onSubmit={this.handleFormSubmit}
          titleName={currentName}
          loudong={loudong}
        />
      );
    }
    // if (formTypeFloor === 'S') {
    //   return <AssetFloorShowMaint onCancel={this.handleFormCancel} />;
    // }
    return <React.Fragment></React.Fragment>;
  }

  // 跳转 子门牌
  onItemDetailClick = item => {
    this.dispatch({
      type: 'assetApartmentData/subDoorRoute',
      payload: item,
    });
  };

  render() {
    const {
      loading,
      assetApartmentData: {
        dataPlate: { list, pagination },
        unitNum,
        formDataUnit,
        formDataFloor,
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '门牌号',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '是否整租',
        dataIndex: 'is_all_rent',
        width: 150,
        render: val => {
          if (val === 0) {
            return '';
          }
          if (val === 1) {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '建筑面积（㎡）',
        dataIndex: 'building_area',
        width: 150,
        render: val => {
          return <span>{this.statusValue(val)}</span>;
        },
      },
      {
        title: '计租面积（㎡）',
        dataIndex: 'rent_area',
        width: 150,
        render: val => {
          return <span>{this.statusValue(val)}</span>;
        },
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
            <Row>
              <Col span={4}>{formDataFloor.name}</Col>
              <Col span={4}>
                <Tag color="#2db7f5">{this.getRentStatus(formDataFloor)}</Tag>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={4}>楼层数：{formDataFloor.unit_num}</Col>
              <Col span={6}>
                建筑面积（㎡）：
                {formDataFloor.building_area ? (formDataFloor.building_area / 100).toString() : '0'}
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={4}>已租面积（㎡）：{this.statusArea(formDataFloor)}</Col>
              <Col span={4}>出租率：{this.statusLv(formDataFloor)}</Col>
              <Col span={4}>未租面积（㎡）：{this.statusTorentArea(formDataFloor)}</Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <PButton
                code="addPlate"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                新建门牌
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="editPlate"
                  code="editPlate"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="delPlate"
                  code="delPlate"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                // <PButton
                //   code="queryFloor"
                //   key="queryFloor"
                //   onClick={() => this.handleSeeClick(selectedRows[0])}
                // >
                //   查看
                // </PButton>,
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

export default AssetNumPlate;
