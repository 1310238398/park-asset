import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Table, Modal, Tag, Button } from 'antd';
import PButton from '@/components/PermButton';
import AssetFloorEdit from './AssetFloorEdit';
// import AssetFloorShowMaint from './AssetFloor/AssetFloorShowMaint';
import styles from '../AssetBuildData.less';

@connect(state => ({
  assetBuildData: state.assetBuildData,
  loading: state.loading.models.assetBuildData,
}))
@Form.create()
class AssetFloorData extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const {
      location: {
        query: { recordID, projectID },
      },
      assetBuildData: { unitNum },
    } = this.props;
    this.dispatch({
      type: 'assetBuildData/fetchFloor',
      search: { building_type: 3, project_id: projectID, parent_id: recordID },
      pagination: {},
    });
    if (unitNum === 0) {
      this.dispatch({
        type: 'assetBuildData/fetchFormBuild',
        payload: { record_id: recordID },
      });
    } else {
      this.dispatch({
        type: 'assetBuildData/fetchFormUnit',
        payload: { record_id: recordID },
      });
    }
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
      type: 'assetBuildData/LoadFloor',
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
      type: 'assetBuildData/LoadFloor',
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
      title: `确定删除【楼层数据：${item.name}】？`,
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
      type: 'assetBuildData/LoadFloor',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 关闭弹窗
  handleFormCancel = () => {
    this.dispatch({
      type: 'assetBuildData/changeFormVisibleFloor',
      payload: false,
    });
  };

  // 提交数据
  handleFormSubmit = data => {
    this.dispatch({
      type: 'assetBuildData/submitFloor',
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
      type: 'assetBuildData/delFloor',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  // 跳转
  onItemDetailClick = item => {
    const {
      assetBuildData: {
        formDataBuild: { name },
      },
    } = this.props;
    this.dispatch({
      type: 'assetBuildData/plateRoute',
      payload: { item, loudongName: name },
    });
  };

  // 显示弹窗
  renderDataForm() {
    const {
      assetBuildData: { formTypeFloor },
      location: {
        query: { currentName, loudong },
      },
    } = this.props;
    if (formTypeFloor === 'A' || formTypeFloor === 'E') {
      return (
        <AssetFloorEdit
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

  render() {
    const {
      loading,
      assetBuildData: {
        dataFloor: { list, pagination },
        formDataBuild,
        unitNum,
        formDataUnit,
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '楼层号',
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
          {unitNum === 0 ? (
            <div>
              <Row>
                <Col span={4}>{formDataBuild.name}</Col>
                <Col span={4}>
                  <Tag color="#2db7f5">{this.getRentStatus(formDataBuild)}</Tag>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={4}>楼层数：{formDataBuild.unit_num}</Col>
                <Col span={6}>
                  建筑面积（㎡）：
                  {formDataBuild.building_area
                    ? (formDataBuild.building_area / 100).toString()
                    : '0'}
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={4}>已租面积（㎡）：{this.statusArea(formDataBuild)}</Col>
                <Col span={4}>出租率：{this.statusLv(formDataBuild)}</Col>
                <Col span={4}>未租面积（㎡）：{this.statusTorentArea(formDataBuild)}</Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
                <Col span={4}>{formDataUnit.name}</Col>
                <Col span={4}>
                  <Tag color="#2db7f5">{this.getRentStatus(formDataUnit)}</Tag>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={4}>楼层数：{formDataUnit.unit_num}</Col>
                <Col span={6}>
                  建筑面积（㎡）：
                  {formDataUnit.building_area
                    ? (formDataUnit.building_area / 100).toString()
                    : '0'}
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col span={4}>已租面积（㎡）：{this.statusArea(formDataUnit)}</Col>
                <Col span={4}>出租率：{this.statusLv(formDataUnit)}</Col>
                <Col span={4}>未租面积（㎡）：{this.statusTorentArea(formDataUnit)}</Col>
              </Row>
            </div>
          )}
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <PButton
                code="addFloor"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                新建楼层
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="editFloor"
                  code="editFloor"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="delFloor"
                  code="delFloor"
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

export default AssetFloorData;
