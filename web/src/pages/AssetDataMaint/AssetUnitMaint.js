import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Table, Modal } from 'antd';
import PButton from '@/components/PermButton';
import AssetUnitEditMaint from './AssetUnitEditMaint';
import AssetUnitShowMaint from './AssetUnitShowMaint';
import DicShow from '@/components/DictionaryNew/DicShow';
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
    const {
      location: {
        query: { recordID, projectID },
      },
    } = this.props;
    this.dispatch({
      type: 'assetDatamaint/fetchUnit',
      search: { building_type: 2, parent_id: recordID, project_id: projectID },
      pagination: {},
    });

    this.dispatch({
      type: 'assetDatamaint/fetchFormBuild',
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

  // 新增单元
  handleAddClick = () => {
    const {
      location: {
        query: { projectID },
      },
    } = this.props;
    this.dispatch({
      type: 'assetDatamaint/LoadUnit',
      payload: {
        type: 'A',
        inProjectID: projectID,
      },
    });
  };

  // 编辑单元
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
      type: 'assetDatamaint/LoadUnit',
      payload: {
        type: 'E',
        id: item.record_id,
        inProjectID: projectID,
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
      location: {
        query: { currentName },
      },
    } = this.props;
    if (formTypeUnit === 'A' || formTypeUnit === 'E') {
      return (
        <AssetUnitEditMaint
          onCancel={this.handleFormCancel}
          onSubmit={this.handleFormSubmit}
          titleName={currentName}
        />
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
        dataUnit: { list, pagination },
        formDataBuild,
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
        render: val => {
          return <span>{val === 1 ? '是' : '否'}</span>;
        },
      },
      {
        title: '出租状态',
        dataIndex: 'rent_status',
        width: 150,
        render: val => {
          if (val === 0) {
            return '';
          }
          return <DicShow pcode="pa$#build$#rente" code={[val]} />;
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
        title: '已租面积（㎡）',
        dataIndex: 'rent_area',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1) {
            if (item.rent_status !== 3) {
              return 0;
            }
            return -1;
          }
          return <span>{this.statusValue(item.rent_area)}</span>;
        },
      },
      {
        title: '出租率',
        dataIndex: '',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1) {
            if (item.rent_status !== 3) {
              return 0;
            }
            return <span>100%</span>;
          }
          return <span>{item.rent_area}</span>;
        },
      },
      {
        title: '未租面积（㎡）',
        dataIndex: 'parent_path',
        width: 150,
        render: item => {
          if (item.is_all_rent === 1 && item.rent_status !== 3) {
            return item.rent_area;
          }
          return <span>{this.statusValue(item.rent_area)}</span>;
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
            <p>{formDataBuild.name}</p>
            <Row type="flex" justify="start">
              <Col span={4}>单元数：{formDataBuild.unit_num}</Col>
              <Col span={4}>楼层数：{formDataBuild.layer_num}</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span={4}>
                建筑面积（㎡）：
                {formDataBuild.building_area ? formDataBuild.building_area / 100 : 0}
              </Col>
              <Col span={4}>已租面积（㎡）：{this.statusArea(formDataBuild)}</Col>
              <Col span={4}>出租率：{this.statusLv(formDataBuild)}</Col>
              <Col span={4}>未租面积（㎡）：{this.statusTorentArea(formDataBuild)}</Col>
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
