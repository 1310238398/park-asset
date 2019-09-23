import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal } from 'antd';
import PButton from '@/components/PermButton';
import AssetBuildEditMaint from './AssetBuildEditMaint';
import AssetBuildShowMaint from './AssetBuildShowMaint';
import loudongshu from '@/assets/loudongshu.png';
import zichanmianji from '@/assets/zichanmianji.png';
import yizumianji from '@/assets/yizumianji.png';
import weizumianji from '@/assets/weizumianji.png';
import chuzujunjia from '@/assets/chuzujunjia.png';
import ruzhuqiyezongshu from '@/assets/ruzhuqiyezongshu.png';
import styles from './AssetDataMaint.less';

@connect(state => ({
  assetDatamaint: state.assetDatamaint,
  loading: state.loading.models.assetDatamaint,
}))
@Form.create()
class AssetBuildMaint extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const { onProjectId } = this.props;
    this.dispatch({
      type: 'assetDatamaint/loadForm',
      payload: {
        onProjectId,
      },
    });
  }

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  // 跳转 如果有单元数，就跳转单元，如果没有，就跳转楼层。
  onItemDetailClick = item => {
    if (item) {
      this.dispatch({
        type: 'assetDatamaint/cellRoute',
        payload: item,
      });
    } else {
      this.dispatch({
        type: 'assetDatamaint/floorRoute',
        payload: item,
      });
    }
  };

  // 新建楼栋
  handleAddBuildClick = () => {
    this.dispatch({
      type: 'assetDatamaint/LoadBuild',
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
      type: 'assetDatamaint/LoadBuild',
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
      title: `确定删除【楼栋数据：${item.name}】？`,
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
      type: 'assetDatamaint/LoadBuild',
      payload: {
        type: 'S',
        id: item.record_id,
      },
    });
  };

  // 关闭弹窗
  handleFormCancel = () => {
    this.dispatch({
      type: 'assetDatamaint/changeFormVisibleBuild',
      payload: false,
    });
  };

  // 提交数据
  handleFormSubmit = data => {
    this.dispatch({
      type: 'assetDatamaint/submitBuild',
      payload: data,
    });
    this.clearSelectRows();
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

  handleDelOKClick(id) {
    this.dispatch({
      type: 'assetDatamaint/delBuild',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  // 显示弹窗
  renderDataForm() {
    const {
      assetDatamaint: { formTypeBuild },
    } = this.props;
    if (formTypeBuild === 'A' || formTypeBuild === 'E') {
      return (
        <AssetBuildEditMaint onCancel={this.handleFormCancel} onSubmit={this.handleFormSubmit} />
      );
    }
    if (formTypeBuild === 'S') {
      return <AssetBuildShowMaint onCancel={this.handleFormCancel} />;
    }
    return <React.Fragment></React.Fragment>;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 6 },
        lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 6 },
        lg: { span: 12 },
      },
    };
    const col = {
      sm: 24,
      md: 6,
    };
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={16}>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="楼栋号">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="建筑类型">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <Form.Item {...formItemLayout} label="在租均价">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col {...col}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
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
        title: '楼栋号',
        dataIndex: 'photo',
        width: 100,
        render: value => {
          return <img src={value} alt="" style={{ width: 60, height: 60 }} />;
        },
      },
      {
        title: '是否整栋出租',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '出租状态',
        dataIndex: 'floor_area',
        width: 150,
      },
      {
        title: '建筑面积（㎡）',
        dataIndex: 'address',
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
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={loudongshu} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>总楼栋数</span>
                  <span className={styles.contenOne}>5楼</span>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={zichanmianji} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>资产总面积（㎡）</span>
                  <span className={styles.contenOne}>291738.23</span>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={yizumianji} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>已租面积（㎡）</span>
                  <span className={styles.contenOne}>
                    291738.23<span className={styles.guttetZb}>18.91%</span>
                  </span>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={weizumianji} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>未租面积（㎡）</span>
                  <span className={styles.contenOne}>291738.23</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '10px' }}>
            {/* <Col className="gutter-row" span={6}>
            <div className={styles.gutterboxbuild}>
              <div>
                <img src="" alt=""/>
              </div>
              <div>
                <p>未租空置（㎡）</p>
                <p>
                  100000|<span className={styles.guttetZb}>81.96%</span>
                </p>
              </div>
            </div>
          </Col> */}
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={chuzujunjia} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>出租均价（元/㎡/天）</span>
                  <span className={styles.contenOne}>2.23</span>
                </div>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className={styles.gutterboxbuild}>
                <div className={styles.gutterboxbuildImg}>
                  <img src={ruzhuqiyezongshu} alt="" className={styles.dataImg} />
                </div>
                <div>
                  <span className={styles.titeleOne}>入驻企业总数</span>
                  <span className={styles.contenOne}>40</span>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton
                code="addbuild"
                icon="plus"
                type="primary"
                onClick={() => this.handleAddBuildClick()}
              >
                新建楼栋
              </PButton>
              <PButton
                code="tembuild"
                // icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                模板下载
              </PButton>
              <PButton
                code="loadbuild"
                // icon="plus"
                type="primary"
                onClick={() => this.handleAddClick()}
              >
                批量导入
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="editbuild"
                  icon="edit"
                  onClick={() => this.handleEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="delbuild"
                  icon="delete"
                  type="danger"
                  onClick={() => this.handleDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                <PButton code="querybuild" onClick={() => this.handleSeeClick(selectedRows[0])}>
                  查看
                </PButton>,
                // selectedRows[0].status === 2 && (
                //   <PButton
                //     key="enable"
                //     code="enable"
                //     icon="check"
                //     onClick={() => this.handleItemEnableClick(selectedRows[0])}
                //   >
                //     启用
                //   </PButton>
                // ),
                // selectedRows[0].status === 1 && (
                //   <PButton
                //     key="disable"
                //     code="disable"
                //     icon="stop"
                //     type="danger"
                //     onClick={() => this.handleItemDisableClick(selectedRows[0])}
                //   >
                //     禁用
                //   </PButton>
                // ),
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
          {this.renderDataForm()}
        </Card>
      </div>
    );
  }
}
export default AssetBuildMaint;
